import { getVolunteerAccess } from "../volunteerHelpers";
import {
  VolunteerAccessRestricted,
  VolunteerPageShell,
} from "../VolunteerChrome";

const policyLinks = [
  {
    title: "Volunteer Code of Conduct",
    description:
      "Core expectations for professionalism, communication, confidentiality, boundaries, and volunteer behavior.",
    href: "/volunteer-code-of-conduct.pdf",
  },
  {
    title: "Essay Integrity Policy",
    description:
      "Rules for ethical essay support, including what volunteers may and may not do when reviewing student writing.",
    href: "/essay-integrity-policy.pdf",
  },
  {
    title: "No Legal or Visa Advice Disclaimer",
    description:
      "Clear boundary that SafePath Scholars and its volunteers do not provide legal, visa, asylum, immigration, or relocation advice.",
    href: "/no-legal-visa-advice-disclaimer.pdf",
  },
  {
    title: "Privacy Statement",
    description:
      "How student, volunteer, and program information should be treated and protected.",
    href: "/privacy-statement.pdf",
  },
];

const boundaryRules = [
  "Do not provide legal, visa, asylum, immigration, relocation, financial, medical, emergency, or mental health advice.",
  "Do not promise admission, scholarships, visas, safety, relocation, financial aid, or any other outcome.",
  "Do not write, ghostwrite, fabricate, or substantially author student essays.",
  "Do not communicate with students outside approved program channels unless specifically authorized.",
  "Do not request unnecessary personal, legal, financial, medical, or family information.",
  "Do not form personal, romantic, financial, or private relationships with students through the program.",
];

const essayFeedbackRules = [
  "You may comment on clarity, structure, grammar, flow, organization, tone, and authenticity.",
  "You may ask guiding questions that help the student clarify their own ideas.",
  "You may suggest that a section needs more detail, stronger organization, or clearer examples.",
  "You may not invent experiences, rewrite the essay into your own voice, or make the essay misleading.",
  "The student must remain the author of all submitted work.",
  "When in doubt, give feedback as comments or questions rather than rewriting the student’s work.",
];

const sessionLoggingRules = [
  "Log every tutoring, mentorship, essay, application, or advising-support session.",
  "Keep notes factual, brief, professional, and limited to educational support.",
  "Include the service type, date, duration, what was covered, and next steps.",
  "Do not include sensitive legal, medical, financial, family, or trauma details unless absolutely necessary for program safety.",
  "Escalate serious concerns instead of trying to solve them alone.",
];

const escalationRules = [
  "A student describes immediate danger or safety concerns.",
  "A student asks for legal, visa, asylum, immigration, or relocation advice.",
  "A student reports coercion, abuse, exploitation, self-harm risk, or emergency needs.",
  "A volunteer or student violates program boundaries.",
  "You are unsure whether a request is appropriate for a volunteer to handle.",
];

function ResourceCard({ title, description, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
    >
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
        Policy PDF
      </p>

      <h2 className="mt-3 text-xl font-black text-slate-950">{title}</h2>

      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

      <p className="mt-5 text-sm font-bold text-emerald-700">
        Open document →
      </p>
    </a>
  );
}

function RuleSection({ title, subtitle, items, tone = "default" }) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : tone === "danger"
        ? "border-rose-200 bg-rose-50"
        : "border-slate-200 bg-white";

  const bulletClass =
    tone === "warning"
      ? "bg-amber-600"
      : tone === "danger"
        ? "bg-rose-600"
        : "bg-emerald-600";

  return (
    <section className={`rounded-3xl border p-6 shadow-sm ${toneClasses}`}>
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>

      {subtitle && (
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
          {subtitle}
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            <span
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${bulletClass}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function VolunteerResourcesPage() {
  const { user, volunteer, isApprovedVolunteer } = await getVolunteerAccess();

  if (!isApprovedVolunteer) {
    return <VolunteerAccessRestricted user={user} volunteer={volunteer} />;
  }

  return (
    <VolunteerPageShell
      title="Volunteer Resources"
      subtitle="Review program policies, support boundaries, essay feedback rules, session logging expectations, and escalation guidance."
      volunteer={volunteer}
      current="/volunteer/resources"
    >
      <section className="grid gap-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-800">
            Volunteer reference hub
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Use this page before working with students.
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
            This page summarizes the operating rules for approved SafePath
            Scholars volunteers. It does not replace the official policy
            documents, but it gives you the key boundaries to follow while
            supporting students.
          </p>
        </div>

        <section>
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            Core policy documents
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {policyLinks.map((link) => (
              <ResourceCard
                key={link.title}
                title={link.title}
                description={link.description}
                href={link.href}
              />
            ))}
          </div>
        </section>

        <RuleSection
          title="Communication and role boundaries"
          subtitle="Volunteers provide educational support only. These boundaries protect students, volunteers, and the program."
          items={boundaryRules}
          tone="warning"
        />

        <RuleSection
          title="Essay feedback boundaries"
          subtitle="Essay support should improve clarity and authenticity without replacing the student’s own voice or authorship."
          items={essayFeedbackRules}
        />

        <RuleSection
          title="Session logging expectations"
          subtitle="Every support interaction should be documented clearly enough for program leadership to understand what happened and what should happen next."
          items={sessionLoggingRules}
        />

        <RuleSection
          title="When to escalate to program leadership"
          subtitle="Do not handle serious safety, legal, conduct, or emergency concerns alone."
          items={escalationRules}
          tone="danger"
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Quick volunteer checklist
          </h2>

          <div className="mt-5 grid gap-3">
            {[
              "I understand that I am providing educational support only.",
              "I understand that I may not give legal, visa, asylum, immigration, relocation, financial, medical, or emergency advice.",
              "I understand that I may not ghostwrite or substantially author student essays.",
              "I understand that I must log support sessions accurately.",
              "I understand that serious concerns should be escalated to program leadership.",
            ].map((item) => (
              <label
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600"
                />
                <span className="text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </span>
              </label>
            ))}
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            These checkboxes are a personal reminder and are not saved yet.
          </p>
        </div>
      </section>
    </VolunteerPageShell>
  );
}