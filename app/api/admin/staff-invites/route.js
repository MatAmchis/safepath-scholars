import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import {
  ADMIN_ROLES,
  getRoleLabel,
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

function getBaseUrl(request) {
  const requestUrl = new URL(request.url);

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    requestUrl.origin
  );
}

function buildStaffInviteEmail({ email, role, note, baseUrl }) {
  const roleLabel = getRoleLabel(role);
  const loginUrl = `${baseUrl}/login`;

  const subject = `You’ve been invited to SafePath Scholars as ${roleLabel}`;

  const text = `
You’ve been invited to SafePath Scholars as ${roleLabel}.

To accept the invite, log in using this exact email address:

${email}

Login here:
${loginUrl}

After you log in, your staff role will be applied automatically.

${note ? `Internal note from admin: ${note}` : ""}

SafePath Scholars
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 640px;">
      <h2 style="margin-bottom: 12px;">You’ve been invited to SafePath Scholars</h2>

      <p>
        You have been invited to access the SafePath Scholars admin portal as:
      </p>

      <p style="font-size: 18px; font-weight: 700; margin: 16px 0;">
        ${roleLabel}
      </p>

      <p>
        To accept the invite, log in using this exact email address:
      </p>

      <p style="font-weight: 700; background: #f1f5f9; padding: 12px 16px; border-radius: 12px;">
        ${email}
      </p>

      <p>
        After you log in, your staff role will be applied automatically.
      </p>

      <p style="margin: 24px 0;">
        <a
          href="${loginUrl}"
          style="background: #020617; color: white; padding: 12px 18px; border-radius: 12px; text-decoration: none; font-weight: 700;"
        >
          Log in to SafePath Scholars
        </a>
      </p>

      ${
        note
          ? `<p style="background: #fffbeb; border: 1px solid #fde68a; padding: 12px 16px; border-radius: 12px;">
              <strong>Admin note:</strong> ${note}
            </p>`
          : ""
      }

      <p style="margin-top: 28px; color: #64748b; font-size: 13px;">
        SafePath Scholars
      </p>
    </div>
  `;

  return { subject, text, html };
}

async function sendStaffInviteEmail({ email, role, note, baseUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.NOTIFICATION_FROM ||
    "SafePath Scholars <notifications@safepathscholars.org>";

  if (!apiKey) {
    return {
      sent: false,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const emailContent = buildStaffInviteEmail({
    email,
    role,
    note,
    baseUrl,
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      sent: false,
      error:
        data?.message ||
        data?.error ||
        `Resend request failed with status ${response.status}.`,
    };
  }

  return {
    sent: true,
    id: data?.id || null,
  };
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

    const emailResult = await sendStaffInviteEmail({
      email,
      role,
      note,
      baseUrl: getBaseUrl(request),
    });

    return NextResponse.json({
      success: true,
      invite: data,
      emailSent: emailResult.sent,
      emailId: emailResult.id || null,
      emailError: emailResult.error || null,
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