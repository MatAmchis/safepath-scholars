import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import { LogSessionBox } from "../SessionOutcomeControls";
import AdminExportButton from "../AdminExportButton";

export default async function SessionsAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const [matchesResult, sessionsResult] = await Promise.all([
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
  ]);

  const matches = matchesResult.data || [];
  const sessions = sessionsResult.data || [];

  return (
    <AdminPageShell
      title="Sessions"
      subtitle="Log tutoring, essay feedback, application support, and mentorship sessions."
      profile={profile}
      user={user}
      current="/admin/sessions"
    >
      <section className="grid gap-8">
        <LogSessionBox matches={matches} />
    <div className="mb-6 flex justify-end">
      <AdminExportButton
        type="sessions"
        label="Export sessions CSV"
        filename="sessions.csv"
      />
    </div>
        <DataTable
          title="Recent Sessions"
          headers={["Date", "Student", "Volunteer", "Type", "Minutes", "Next Steps"]}
          rows={sessions.map((session) => [
            session.session_date,
            session.students?.full_name,
            session.volunteers?.full_name,
            session.service_type,
            session.duration_minutes,
            session.next_steps,
          ])}
        />
      </section>
    </AdminPageShell>
  );
}