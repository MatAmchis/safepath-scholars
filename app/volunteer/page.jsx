import { getVolunteerAccess } from "./volunteerHelpers";
import {
  VolunteerAccessRestricted,
  VolunteerPageShell,
  VolunteerMetricCard,
  VolunteerInfoCard,
} from "./VolunteerChrome";

export default async function VolunteerDashboardPage() {
  const { supabase, user, volunteer, isApprovedVolunteer } =
    await getVolunteerAccess();

  if (!isApprovedVolunteer) {
    return <VolunteerAccessRestricted user={user} volunteer={volunteer} />;
  }

  const [essaysResult, matchesResult, sessionsResult] = await Promise.all([
    supabase
      .from("essay_submissions")
      .select("*")
      .eq("assigned_volunteer_id", volunteer.id)
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("matches")
      .select("*, students(full_name), volunteers(full_name)")
      .eq("volunteer_id", volunteer.id)
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("sessions")
      .select("*")
      .eq("volunteer_id", volunteer.id)
      .order("session_date", { ascending: false })
      .limit(50),
  ]);

  const essays = essaysResult.data || [];
  const matches = matchesResult.data || [];
  const sessions = sessionsResult.data || [];

  const activeMatches = matches.filter((match) => match.status === "active");
  const serviceHours = (
    sessions.reduce(
      (sum, session) => sum + Number(session.duration_minutes || 0),
      0
    ) / 60
  ).toFixed(1);

  return (
    <VolunteerPageShell
      title="Volunteer Dashboard"
      subtitle="View your approved volunteer profile and assigned SafePath Scholars work."
      volunteer={volunteer}
      current="/volunteer"
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VolunteerMetricCard label="Assigned essays" value={essays.length} />
        <VolunteerMetricCard label="Matches" value={matches.length} />
        <VolunteerMetricCard label="Active matches" value={activeMatches.length} />
        <VolunteerMetricCard label="Service hours" value={serviceHours} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <VolunteerInfoCard title="Volunteer profile">
          <p>
            <span className="font-bold text-slate-800">Name:</span>{" "}
            {volunteer.full_name || "—"}
          </p>

          <p>
            <span className="font-bold text-slate-800">Email:</span>{" "}
            {volunteer.email || "—"}
          </p>

          <p>
            <span className="font-bold text-slate-800">Status:</span>{" "}
            {volunteer.status || "—"}
          </p>

          <p>
            <span className="font-bold text-slate-800">Skills:</span>{" "}
            {volunteer.skills?.join(", ") || "—"}
          </p>

          <p>
            <span className="font-bold text-slate-800">Availability:</span>{" "}
            {volunteer.weekly_availability || "—"}
          </p>
        </VolunteerInfoCard>

        <VolunteerInfoCard title="Portal status">
          <p>
            This is the first version of the volunteer portal. More pages will
            be added next for assigned essays, active matches, session logging,
            and resources.
          </p>
        </VolunteerInfoCard>

        <VolunteerInfoCard title="Important boundaries">
          <ul className="list-disc space-y-2 pl-5">
            <li>No legal, visa, asylum, immigration, or relocation advice.</li>
            <li>No essay ghostwriting or substantial authorship.</li>
            <li>No promises of admission, scholarships, visas, or outcomes.</li>
            <li>Escalate safety or conduct concerns to program leadership.</li>
          </ul>
        </VolunteerInfoCard>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <a
          href="/volunteer/essays"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
        >
          <h2 className="text-xl font-black text-slate-950">
            Assigned Essays
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Coming next: view essay assignments, prompts, deadlines, and files.
          </p>
        </a>

        <a
          href="/volunteer/matches"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
        >
          <h2 className="text-xl font-black text-slate-950">
            Student Matches
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Coming next: view your active student matches and service tracks.
          </p>
        </a>

        <a
          href="/volunteer/sessions"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
        >
          <h2 className="text-xl font-black text-slate-950">
            Session Logging
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Coming next: log tutoring, mentorship, essay feedback, and
            application sessions.
          </p>
        </a>
      </section>
    </VolunteerPageShell>
  );
}