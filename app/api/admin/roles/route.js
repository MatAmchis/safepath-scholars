import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { ADMIN_ROLES, isFullAdmin, normalizeRole } from "../../../admin/adminPermissions";

export const dynamic = "force-dynamic";

const allowedRoles = new Set([
  "",
  ADMIN_ROLES.ADMIN,
  ADMIN_ROLES.COORDINATOR,
  ADMIN_ROLES.ESSAY_LEAD,
  ADMIN_ROLES.VOLUNTEER_LEAD,
  ADMIN_ROLES.VIEWER,
]);

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

    const profileId = String(body?.profileId || "").trim();
    const newRole = normalizeRole(body?.role);

    if (!profileId) {
      return NextResponse.json(
        { error: "Missing profile id." },
        { status: 400 }
      );
    }

    if (!allowedRoles.has(newRole)) {
      return NextResponse.json(
        { error: "Invalid role." },
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
        { error: "Only full admins can manage staff roles." },
        { status: 403 }
      );
    }

    if (profileId === adminContext.user.id && newRole !== ADMIN_ROLES.ADMIN) {
      return NextResponse.json(
        { error: "You cannot remove your own admin role." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole || null })
      .eq("id", profileId);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not update role." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profileId,
      role: newRole || null,
    });
  } catch (error) {
    console.error("Admin role route error:", error);

    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}