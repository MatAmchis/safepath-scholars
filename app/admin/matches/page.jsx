import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminExportButton from "../AdminExportButton";
import { CreateMatchBox } from "../AdminActionControls";
import {
  AdminActionGate,
  AdminExportGate,
  AdminPermissionNotice,
} from "../AdminRoleControls";

export default async function MatchesAdminPage() {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const [studentsResult, volunteersResult, matchesResult] = await Promise.all([
    supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("matches")
      .select("*, students(full_name), volunteers(full_name)")
      .order("created_at", { ascending: false }),
  ]);

  const students = studentsResult.data || [];
  const volunteers = volunteersResult.data || [];
  const matches = matchesResult.data || [];

  return (
    <AdminPageShell
      title="Matches"
      subtitle="Create and review student-volunteer matches."
      profile={profile}
      user={user}
      current="/admin/matches"
    >
      <AdminActionGate
        role={role}
        action="createMatch"
        fallback={
          <div className="mb-8">
            <AdminPermissionNotice>
              Your role can view matches but cannot create new matches.
            </AdminPermissionNotice>
          </div>
        }
      >
        <div className="mb-8">
          <CreateMatchBox students={students} volunteers={volunteers} />
        </div>
      </AdminActionGate>

      <AdminExportGate role={role} type="matches">
        <div className="mb-6 flex justify-end">
          <AdminExportButton
            type="matches"
            label="Export matches CSV"
            filename="matches.csv"
          />
        </div>
      </AdminExportGate>

      <DataTable
        title={`Matches (${matches.length})`}
        headers={["Student", "Volunteer", "Track", "Status", "Start Date", "Notes"]}
        rows={matches.map((match) => [
          match.students?.full_name,
          match.volunteers?.full_name,
          match.service_track,
          match.status,
          match.start_date,
          match.notes,
        ])}
      />
    </AdminPageShell>
  );
}