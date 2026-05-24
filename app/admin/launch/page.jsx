import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell } from "../AdminChrome";

const launchChecklist = [
  {
    group: "Website and public materials",
    items: [
      "Website live",
      "Custom domain working",
      "Public policy PDFs linked",
      "No Legal/Visa Advice disclaimer visible",
      "Essay Integrity Policy linked",
      "Volunteer Code of Conduct linked",
    ],
  },
  {
    group: "Public forms",
    items: [
      "Student intake form tested",
      "Volunteer application tested",
      "Essay submission tested",
      "Feedback form tested",
      "Contact form tested",
    ],
  },
  {
    group: "Notifications and backend",
    items: [
      "Email notifications tested",
      "Supabase rows created correctly",
      "Admin login tested",
      "Admin logout tested",
      "Private essay upload tested",
      "Private essay download tested",
    ],
  },
  {
    group: "Admin workflow",
    items: [
      "Student status updates tested",
      "Student priority updates tested",
      "Student internal notes tested",
      "Volunteer approval tested",
      "Volunteer internal notes tested",
      "Essay reviewer assignment tested",
      "Essay status updates tested",
      "Essay internal notes tested",
      "Match creation tested",
      "Session logging tested",
      "Outcome tracking tested",
    ],
  },
  {
    group: "Recruitment readiness",
    items: [
      "Volunteer recruitment message ready",
      "Student referral message ready",
      "Volunteer onboarding checklist ready",
      "Admin status guide ready",
      "First 5 volunteers screened",
      "First 5 students reviewed",
    ],
  },
  {
    group: "Cleanup",
    items: [
      "Duplicate Vercel projects deleted",
      "Vercel environment variables confirmed",
      "Test records cleaned from Supabase",
      "Only real production Vercel project kept",
    ],
  },
];

function ChecklistCard({ group, items }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{group}</h2>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
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
    </div>
  );
}

export default async function LaunchTrackerPage() {
  const { user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  return (
    <AdminPageShell
      title="Launch Tracker"
      subtitle="Internal pre-recruitment checklist for confirming that SafePath Scholars is ready for a soft launch."
      profile={profile}
      user={user}
      current="/admin/launch"
    >
      <section className="grid gap-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
            Pre-recruitment checklist
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Use this before posting recruitment messages.
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
            This page is a lightweight internal tracker. Check items manually as
            you test the website, forms, admin dashboard, notifications, and
            launch materials. These checkboxes are not saved yet; they are meant
            as an operational checklist before recruitment.
          </p>
        </div>

        {launchChecklist.map((section) => (
          <ChecklistCard
            key={section.group}
            group={section.group}
            items={section.items}
          />
        ))}
      </section>
    </AdminPageShell>
  );
}