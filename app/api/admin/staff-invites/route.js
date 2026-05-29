import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import {
  ADMIN_ROLES,
  isFullAdmin,
  normalizeRole,
} from "../../../admin/adminPermissions";

export const dynamic = "force-dynamic";

const allowedInviteRoles = new Set([
  ADMIN_ROLES.ADMIN,
  ADMIN_ROLES.COORDINATOR,
  ADMIN_ROLES.ESSAY_LEAD,
  ADMIN_ROLES.VOLUNTEER_LEAD,
  ADMIN_ROLES.VIEWER,
]);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isLikelyEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getAdminContext(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      role: "",
      error: "Not authenticated.",
      status: 401,
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return {
      user,
      profile: null,
      role: "",
      error: "Admin profile not found.",
      status: 403,
    };
  }

  return {
    user,
    profile,
    role: normalizeRole(profile.role),
    error: null,
    status: 200,
  };
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const email = normalizeEmail(body?.email);
    const role = normalizeRole(body?.role);
    const note = String(body?.note || "").trim();

    if (!email || !isLikelyEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!allowedInviteRoles.has(role)) {
      return NextResponse.json(
        { error: "Select a valid staff role." },
        { status: 400 }
      );
    }

    const adminContext = await getAdminContext(supabase);

    if (adminContext.error) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    if (!isFullAdmin(adminContext.role)) {
      return NextResponse.json(
        { error: "Only full admins can create staff invites." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("pending_staff_invites")
      .upsert(
        {
          email,
          role,
          note: note || null,
          created_by: adminContext.user.id,
          accepted_at: null,
        },
        {
          onConflict: "email",
        }
      )
      .select("id, email, role, note, created_at, accepted_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not save staff invite." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invite: data,
    });
  } catch (error) {
    console.error("Staff invite route error:", error);

    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const inviteId = String(body?.inviteId || "").trim();

    if (!inviteId) {
      return NextResponse.json(
        { error: "Missing invite id." },
        { status: 400 }
      );
    }

    const adminContext = await getAdminContext(supabase);

    if (adminContext.error) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    if (!isFullAdmin(adminContext.role)) {
      return NextResponse.json(
        { error: "Only full admins can delete staff invites." },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("pending_staff_invites")
      .delete()
      .eq("id", inviteId);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not delete staff invite." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inviteId,
    });
  } catch (error) {
    console.error("Delete staff invite route error:", error);

    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}