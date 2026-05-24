import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function humanizeKey(key) {
  return String(key)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.length ? value.map(escapeHtml).join(", ") : "—";
  }

  if (typeof value === "object") {
    return `<pre style="white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;">${escapeHtml(
      JSON.stringify(value, null, 2)
    )}</pre>`;
  }

  return escapeHtml(value);
}

function buildPayloadTable(payload) {
  const entries = Object.entries(payload || {}).filter(
    ([key]) => !["file", "attachment"].includes(key)
  );

  if (entries.length === 0) {
    return "<p>No submitted fields were included.</p>";
  }

  return `
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      <tbody>
        ${entries
          .map(
            ([key, value]) => `
              <tr>
                <td style="width:34%;vertical-align:top;padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;color:#334155;">
                  ${escapeHtml(humanizeKey(key))}
                </td>
                <td style="vertical-align:top;padding:10px;border:1px solid #e2e8f0;color:#334155;">
                  ${formatValue(value)}
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function getSubmissionLabel(type) {
  const labels = {
    contact: "New contact message",
    student: "New student intake",
    volunteer: "New volunteer application",
    essay: "New essay submission",
    feedback: "New feedback submission",
  };

  return labels[type] || "New SafePath Scholars submission";
}

function getRecipientEmail(type, payload) {
  const candidatesByType = {
    contact: ["email", "contact_email", "sender_email"],
    student: ["email", "student_email", "contact_email"],
    volunteer: ["email", "volunteer_email", "contact_email"],
    essay: ["email", "student_email", "contact_email"],
    feedback: ["email", "contact_email"],
  };

  const candidates = candidatesByType[type] || ["email", "contact_email"];

  for (const key of candidates) {
    const value = payload?.[key];

    if (typeof value === "string" && value.includes("@")) {
      return value.trim();
    }
  }

  return "";
}

function getRecipientName(payload) {
  const candidates = [
    "full_name",
    "name",
    "student_name",
    "volunteer_name",
    "parent_guardian_name",
  ];

  for (const key of candidates) {
    const value = payload?.[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function buildAdminEmail({ type, payload }) {
  const label = getSubmissionLabel(type);

  return {
    subject: `SafePath Scholars: ${label}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h1 style="margin:0 0 8px;font-size:24px;">${escapeHtml(label)}</h1>

        <p style="margin:0 0 16px;color:#475569;">
          A new submission was received through the SafePath Scholars website.
        </p>

        ${buildPayloadTable(payload)}

        <p style="margin-top:20px;color:#64748b;font-size:13px;">
          This is an automated admin notification from SafePath Scholars.
        </p>
      </div>
    `,
  };
}

function buildConfirmationEmail({ type, payload }) {
  const name = getRecipientName(payload);
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";

  const baseFooter = `
    <p style="margin-top:20px;color:#64748b;font-size:13px;">
      SafePath Scholars provides educational support only. We do not provide legal, visa,
      asylum, immigration, relocation, financial, medical, emergency, or mental health advice.
    </p>
  `;

  if (type === "student") {
    return {
      subject: "SafePath Scholars: We received your student intake form",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h1 style="margin:0 0 12px;font-size:24px;">Student intake received</h1>

          <p>${greeting}</p>

          <p>
            Thank you for contacting SafePath Scholars. We received your student intake form.
            Our team will review your information and follow up if we are able to offer support
            or need more details.
          </p>

          <p>
            Submitting this form does not guarantee tutoring, essay feedback, mentorship,
            application support, scholarships, admission, relocation, legal help, or any other outcome.
          </p>

          ${baseFooter}
        </div>
      `,
    };
  }

  if (type === "volunteer") {
    return {
      subject: "SafePath Scholars: We received your volunteer application",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h1 style="margin:0 0 12px;font-size:24px;">Volunteer application received</h1>

          <p>${greeting}</p>

          <p>
            Thank you for applying to volunteer with SafePath Scholars. We received your
            volunteer application and will review your experience, availability, skills, and fit.
          </p>

          <p>
            If approved, you may receive access to the volunteer portal and be considered for
            student matches, essay review assignments, tutoring, mentorship, or other educational support roles.
          </p>

          <p>
            Submitting an application does not guarantee acceptance or assignment.
          </p>

          ${baseFooter}
        </div>
      `,
    };
  }

  if (type === "essay") {
    return {
      subject: "SafePath Scholars: We received your essay submission",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h1 style="margin:0 0 12px;font-size:24px;">Essay submission received</h1>

          <p>${greeting}</p>

          <p>
            Thank you for submitting your essay or writing draft to SafePath Scholars.
            We received your file and related information.
          </p>

          <p>
            If we are able to review it, feedback will focus on clarity, structure, organization,
            grammar, and authenticity. You must remain the author of your work.
          </p>

          <p>
            SafePath Scholars does not ghostwrite essays, fabricate experiences, or guarantee
            admissions, scholarships, or application outcomes.
          </p>

          ${baseFooter}
        </div>
      `,
    };
  }

  if (type === "feedback") {
    return {
      subject: "SafePath Scholars: We received your feedback",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h1 style="margin:0 0 12px;font-size:24px;">Feedback received</h1>

          <p>${greeting}</p>

          <p>
            Thank you for sharing feedback with SafePath Scholars. We received your message
            and will use it to improve the program.
          </p>

          ${baseFooter}
        </div>
      `,
    };
  }

  return {
    subject: "SafePath Scholars: We received your message",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h1 style="margin:0 0 12px;font-size:24px;">Message received</h1>

        <p>${greeting}</p>

        <p>
          Thank you for contacting SafePath Scholars. We received your message and will review it.
        </p>

        <p>
          If a response is needed, someone from the team will follow up.
        </p>

        ${baseFooter}
      </div>
    `,
  };
}

export async function POST(request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    const from = process.env.NOTIFICATION_FROM;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    if (!notificationEmail) {
      return NextResponse.json(
        { error: "Missing NOTIFICATION_EMAIL." },
        { status: 500 }
      );
    }

    if (!from) {
      return NextResponse.json(
        { error: "Missing NOTIFICATION_FROM." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const type = String(body?.type || "").trim();
    const payload = body?.payload || {};

    if (!type) {
      return NextResponse.json(
        { error: "Missing notification type." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const adminEmail = buildAdminEmail({ type, payload });

    const adminResult = await resend.emails.send({
      from,
      to: notificationEmail,
      subject: adminEmail.subject,
      html: adminEmail.html,
    });

    const recipientEmail = getRecipientEmail(type, payload);

    let confirmationResult = null;

    if (recipientEmail) {
      const confirmationEmail = buildConfirmationEmail({ type, payload });

      confirmationResult = await resend.emails.send({
        from,
        to: recipientEmail,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
      });
    }

    return NextResponse.json({
      success: true,
      adminEmailId: adminResult?.data?.id || null,
      confirmationEmailId: confirmationResult?.data?.id || null,
      confirmationRecipient: recipientEmail || null,
    });
  } catch (error) {
    console.error("Notification route error:", error);

    return NextResponse.json(
      { error: error.message || "Could not send notification." },
      { status: 500 }
    );
  }
}