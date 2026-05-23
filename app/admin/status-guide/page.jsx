import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell } from "../AdminChrome";

const studentStatuses = [
  ["needs_review", "New student intake, not yet reviewed."],
  ["needs_match", "Reviewed and approved for matching."],
  ["active", "Student is currently receiving support."],
  ["paused", "Student support is temporarily inactive."],
  ["completed", "Student support has been completed."],
  ["closed", "No further action is needed."],
];

const volunteerStatuses = [
  ["screening", "Volunteer application received, not yet approved."],
  ["approved", "Volunteer is cleared for matching or assignment."],
  ["waitlisted", "Potentially useful, but not currently assigned."],
  ["rejected", "Volunteer was not accepted."],
  ["paused", "Volunteer is temporarily inactive."],
  ["inactive", "Volunteer is no longer active."],
];

const essayStatuses = [
  ["submitted", "New essay submission received."],
  ["assigned", "Reviewer has been assigned."],
  ["in_review", "Reviewer is working on feedback."],
  ["feedback_returned", "Feedback has been sent back to the student."],
  ["closed", "No further essay action is needed."],
];

function StatusCard({ title, rows }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map(([status, meaning]) => (
          <div key={status} className="grid gap-2 py-4 md:grid-cols-[180px_1fr]">
            <code className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800">
              {status}
            </code>
            <p className="text-sm leading-6 text-slate-600">{meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function StatusGuidePage() {
  const { user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  return (
    <AdminPageShell
      title="Status Guide"
      subtitle="Internal reference for interpreting student, volunteer, and essay workflow statuses."
      profile={profile}
      user={user}
      current="/admin/status-guide"
    >
      <section className="grid gap-8">
        <StatusCard title="Student Statuses" rows={studentStatuses} />
        <StatusCard title="Volunteer Statuses" rows={volunteerStatuses} />
        <StatusCard title="Essay Statuses" rows={essayStatuses} />
      </section>
    </AdminPageShell>
  );
}