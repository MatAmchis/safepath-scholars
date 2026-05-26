import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminExportButton from "../AdminExportButton";
import { LogSessionBox } from "../SessionOutcomeControls";
import {
  AdminActionGate,
  AdminExportGate,
  AdminPermissionNotice,
} from "../AdminRoleControls";

export default async function SessionsAdminPage() {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const [matchesResult, sessionsResult] = await Promise.all([
    supabase
      .from("matches")
      .select("*, students(full_name), volunteers(full_name)")
      .order("created_at", { ascending: false }),

    supabase
      .from("sessions")
      .select("*, students(full_name), volunteers(full_name)")
      .order("session_date", { ascending: false }),
  ]);

  const matches = matchesResult.data || [];
  const sessions = sessionsResult.data || [];

  return (
    <AdminPageShell
      title="Sessions"
      subtitle="Log and review tutoring, mentorship, essay feedback, and application support sessions."
      profile={profile}
      user={user}
      current="/admin/sessions"
    >
      <AdminActionGate
        role={role}
        action="logSession"
        fallback={
          <div className="mb-8">
            <AdminPermissionNotice>
              Your role can view sessions but cannot log sessions from the admin dashboard.
            </AdminPermissionNotice>
          </div>
        }
      >
        <div className="mb-8">
          <LogSessionBox matches={matches} />
        </div>
      </AdminActionGate>

      <AdminExportGate role={role} type="sessions">
        <div className="mb-6 flex justify-end">
          <AdminExportButton
            type="sessions"
            label="Export sessions CSV"
            filename="sessions.csv"
          />
        </div>
      </AdminExportGate>

      <DataTable
        title={`Sessions (${sessions.length})`}
        headers={[
          "Date",
          "Student",
          "Volunteer",
          "Type",
          "Minutes",
          "Notes",
          "Next Steps",
        ]}
        rows={sessions.map((session) => [
          session.session_date,
          session.students?.full_name,
          session.volunteers?.full_name,
          session.service_type,
          session.duration_minutes,
          session.notes,
          session.next_steps,
        ])}
      />
    </AdminPageShell>
  );
}