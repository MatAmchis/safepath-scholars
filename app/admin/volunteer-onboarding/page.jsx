import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell } from "../AdminChrome";

const sections = [
  {
    title: "1. Approval workflow",
    items: [
      "Volunteer submits application.",
      "Admin screens the application.",
      "Admin checks experience, communication quality, skills, and fit.",
      "Admin marks volunteer as approved, waitlisted, or rejected.",
      "Approved volunteers may be matched with students or assigned essays.",
    ],
  },
  {
    title: "2. Matching workflow",
    items: [
      "Match by service need, language, deadline, and skill.",
      "Create the match in /admin/matches.",
      "Student becomes active after the match is created.",
      "Volunteer should not contact the student outside approved channels.",
    ],
  },
  {
    title: "3. Session logging",
    items: [
      "Every session must be logged in /admin/sessions.",
      "Log the date, service type, duration, notes, and next steps.",
      "Notes should be factual, professional, and limited to educational support.",
    ],
  },
  {
    title: "4. Communication boundaries",
    items: [
      "Do not provide legal, visa, asylum, immigration, relocation, or financial advice.",
      "Do not promise admission, scholarships, visas, or outcomes.",
      "Do not use inappropriate direct messaging.",
      "Do not build personal or private relationships outside the program scope.",
      "Escalate concerns to program leadership.",
    ],
  },
  {
    title: "5. Essay feedback rules",
    items: [
      "Volunteers may comment on clarity, structure, grammar, organization, and authenticity.",
      "Volunteers may not write, ghostwrite, fabricate, or substantially author essays.",
      "The student must remain the author of all submitted work.",
    ],
  },
  {
    title: "6. Concern escalation",
    items: [
      "Contact program leadership immediately for safety concerns.",
      "Escalate conduct concerns, coercion concerns, mental health concerns, legal concerns, or emergency concerns.",
      "Volunteers should not try to handle serious concerns alone.",
    ],
  },
];

function ChecklistSection({ title, items }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function VolunteerOnboardingPage() {
  const { user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  return (
    <AdminPageShell
      title="Volunteer Onboarding Checklist"
      subtitle="Internal checklist for approving, matching, supervising, and supporting SafePath Scholars volunteers."
      profile={profile}
      user={user}
      current="/admin/volunteer-onboarding"
    >
      <section className="grid gap-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-800">
            Internal use only
          </p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Purpose of onboarding
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
            This checklist helps program leadership keep volunteer screening,
            matching, session logging, essay feedback, and escalation practices
            consistent. It does not replace the Volunteer Code of Conduct.
          </p>
        </div>

        {sections.map((section) => (
          <ChecklistSection
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </section>
    </AdminPageShell>
  );
}