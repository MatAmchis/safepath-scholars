import { getAdmin } from "./adminHelpers";
import {
  AccessRestricted,
  AdminPageShell,
  MetricCard,
} from "./AdminChrome";
import { CreateMatchBox } from "./AdminActionControls";
import {
  LogSessionBox,
  ApplicationOutcomeBox,
} from "./SessionOutcomeControls";

export default async function AdminOverviewPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const [
    studentsResult,
    volunteersResult,
    essaysResult,
    contactsResult,
    feedbackResult,
    matchesResult,
    sessionsResult,
    applicationsResult,
  ] = await Promise.all([
    supabase.from("students").select("*").limit(100),
    supabase.from("volunteers").select("*").limit(100),
    supabase.from("essay_submissions").select("*").limit(100),
    supabase.from("contact_messages").select("*").limit(100),
    supabase.from("feedback").select("*").limit(100),
    supabase
      .from("matches")
      .select("*, students(full_name, email), volunteers(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("sessions")
      .select("*, students(full_name), volunteers(full_name), matches(service_track)")
      .order("session_date", { ascending: false })
      .limit(100),
    supabase
      .from("applications")
      .select("*, students(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const students = studentsResult.data || [];
  const volunteers = volunteersResult.data || [];
  const essays = essaysResult.data || [];
  const contacts = contactsResult.data || [];
  const feedback = feedbackResult.data || [];
  const matches = matchesResult.data || [];
  const sessions = sessionsResult.data || [];
  const applications = applicationsResult.data || [];

  const activeMatches = matches.filter((match) => match.status === "active");
  const serviceHours = (
    sessions.reduce(
      (sum, item) => sum + Number(item.duration_minutes || 0),
      0
    ) / 60
  ).toFixed(1);

  return (
    <AdminPageShell
      title="Admin Overview"
      profile={profile}
      user={user}
      current="/admin"
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Student intakes" value={students.length} />
        <MetricCard label="Volunteer applications" value={volunteers.length} />
        <MetricCard label="Essay submissions" value={essays.length} />
        <MetricCard label="Contact messages" value={contacts.length} />
        <MetricCard label="Feedback records" value={feedback.length} />
        <MetricCard label="Active matches" value={activeMatches.length} />
        <MetricCard label="Sessions logged" value={sessions.length} />
        <MetricCard label="Service hours" value={serviceHours} />
      </section>

      <section className="mt-10 grid gap-8">
        <CreateMatchBox students={students} volunteers={volunteers} />
        <LogSessionBox matches={matches} />
        <ApplicationOutcomeBox students={students} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <a
            href="/admin/students"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-xl font-black text-slate-950">Students</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review intakes, update priority, and save internal notes.
            </p>
          </a>

          <a
            href="/admin/volunteers"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-xl font-black text-slate-950">Volunteers</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Approve, waitlist, reject, and document screening notes.
            </p>
          </a>

          <a
            href="/admin/essays"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-xl font-black text-slate-950">Essays</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Download private drafts, assign reviewers, and track review status.
            </p>
          </a>

          <a
            href="/admin/outcomes"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
          >
            <h2 className="text-xl font-black text-slate-950">Outcomes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track applications, submissions, scholarships, and decisions.
            </p>
          </a>
        </div>
      </section>
    </AdminPageShell>
  );
}