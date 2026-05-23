import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const NOTIFICATION_FROM =
  process.env.NOTIFICATION_FROM || "SafePath Scholars <onboarding@resend.dev>";

const NOTIFICATION_TYPES = {
  contact: "New Contact Message",
  student: "New Student Intake",
  volunteer: "New Volunteer Application",
  essay: "New Essay Submission",
  feedback: "New Feedback Submission",
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (value === true) return "Yes";
  if (value === false) return "No";

  return value ? String(value) : "—";
}

function formatRows(fields) {
  return fields
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a; width: 220px;">
            ${escapeHtml(label)}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155;">
            ${escapeHtml(formatValue(value))}
          </td>
        </tr>
      `
    )
    .join("");
}

function getNotificationContent(type, payload) {
  if (type === "contact") {
    return {
      subject: "SafePath Scholars: New contact message",
      heading: "New contact message",
      fields: [
        ["Name", payload.name],
        ["Email", payload.email],
        ["Inquiry type", payload.inquiryType],
        ["Organization", payload.organization],
        ["Message", payload.message],
      ],
    };
  }

  if (type === "student") {
    return {
      subject: "SafePath Scholars: New student intake",
      heading: "New student intake",
      fields: [
        ["Student name", payload.name],
        ["Email", payload.email],
        ["Age", payload.age],
        ["Location", payload.location],
        ["Preferred language", payload.language],
        ["Education level", payload.educationLevel],
        ["Support needs", payload.supportNeeds],
        ["Deadline", payload.deadline],
        ["Under 18", payload.under18],
        ["Priority", payload.priority],
        ["Notes", payload.notes],
      ],
    };
  }

  if (type === "volunteer") {
    return {
      subject: "SafePath Scholars: New volunteer application",
      heading: "New volunteer application",
      fields: [
        ["Volunteer name", payload.name],
        ["Email", payload.email],
        ["School", payload.school],
        ["Age", payload.age],
        ["Skills", payload.skills],
        ["Languages", payload.languages],
        ["Weekly availability", payload.weeklyAvailability],
        ["Experience", payload.experience],
      ],
    };
  }

  if (type === "essay") {
    return {
      subject: "SafePath Scholars: New essay submission",
      heading: "New essay submission",
      fields: [
        ["Student name", payload.studentName],
        ["Student email", payload.studentEmail],
        ["Document type", payload.documentType],
        ["Deadline", payload.deadline],
        ["File path", payload.filePath],
        ["Drive link", payload.driveLink],
        ["Prompt", payload.prompt],
        ["Notes", payload.notes],
        ["Integrity acknowledged", payload.integrityAck],
      ],
    };
  }

  if (type === "feedback") {
    return {
      subject: "SafePath Scholars: New feedback submission",
      heading: "New feedback submission",
      fields: [
        ["Respondent type", payload.respondentType],
        ["Email", payload.email],
        ["Services used", payload.services],
        ["Helpfulness", payload.ratingHelpfulness],
        ["Clarity", payload.ratingClarity],
        ["Professionalism", payload.ratingProfessionalism],
        ["Comfort", payload.ratingComfort],
        ["Most helpful", payload.mostHelpful],
        ["Could improve", payload.couldImprove],
        ["Testimonial permission", payload.testimonialPermission],
        ["Concern reported", payload.concernReported],
        ["Follow-up requested", payload.followUpRequested],
      ],
    };
  }

  return null;
}

function buildHtml({ heading, fields }) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 22px 26px;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #6ee7b7; font-weight: 700;">
            SafePath Scholars
          </p>
          <h1 style="margin: 8px 0 0; font-size: 24px; line-height: 1.3;">
            ${escapeHtml(heading)}
          </h1>
        </div>

        <div style="padding: 24px 26px;">
          <p style="margin: 0 0 18px; color: #475569; line-height: 1.6;">
            A new submission was received through the SafePath Scholars website.
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>
              ${formatRows(fields)}
            </tbody>
          </table>

          <p style="margin: 22px 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
            Review this record in the SafePath Scholars admin dashboard.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY environment variable." },
      { status: 500 }
    );
  }

  if (!NOTIFICATION_EMAIL) {
    return NextResponse.json(
      { error: "Missing NOTIFICATION_EMAIL environment variable." },
      { status: 500 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const type = String(body?.type || "");
  const payload = body?.payload || {};

  if (!Object.keys(NOTIFICATION_TYPES).includes(type)) {
    return NextResponse.json(
      { error: "Invalid notification type." },
      { status: 400 }
    );
  }

  const content = getNotificationContent(type, payload);

  if (!content) {
    return NextResponse.json(
      { error: "Could not build notification content." },
      { status: 400 }
    );
  }

  const { error } = await resend.emails.send({
    from: NOTIFICATION_FROM,
    to: [NOTIFICATION_EMAIL],
    subject: content.subject,
    html: buildHtml(content),
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Email send failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}