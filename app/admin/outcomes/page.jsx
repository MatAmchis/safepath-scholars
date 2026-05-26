import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminExportButton from "../AdminExportButton";
import { ApplicationOutcomeBox } from "../SessionOutcomeControls";
import {
  AdminActionGate,
  AdminExportGate,
  AdminPermissionNotice,
} from "../AdminRoleControls";

export default async function OutcomesAdminPage() {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const [studentsResult, applicationsResult] = await Promise.all([
    supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("applications")
      .select("*, students(full_name)")
      .order("created_at", { ascending: false }),
  ]);

  const students = studentsResult.data || [];
  const applications = applicationsResult.data || [];

  return (
    <AdminPageShell
      title="Outcomes"
      subtitle="Track applications, submissions, outcomes, and milestones."
      profile={profile}
      user={user}
      current="/admin/outcomes"
    >
      <AdminActionGate
        role={role}
        action="saveApplicationOutcome"
        fallback={
          <div className="mb-8">
            <AdminPermissionNotice>
              Your role can view outcomes but cannot save new application outcomes.
            </AdminPermissionNotice>
          </div>
        }
      >
        <div className="mb-8">
          <ApplicationOutcomeBox students={students} />
        </div>
      </AdminActionGate>

      <AdminExportGate role={role} type="applications">
        <div className="mb-6 flex justify-end">
          <AdminExportButton
            type="applications"
            label="Export outcomes CSV"
            filename="applications.csv"
          />
        </div>
      </AdminExportGate>

      <DataTable
        title={`Applications and Outcomes (${applications.length})`}
        headers={[
          "Student",
          "Program",
          "Type",
          "Deadline",
          "Submitted",
          "Outcome",
          "Notes",
        ]}
        rows={applications.map((application) => [
          application.students?.full_name,
          application.institution_or_program,
          application.application_type,
          application.deadline,
          application.submitted ? "Yes" : "No",
          application.outcome,
          application.notes,
        ])}
      />
    </AdminPageShell>
  );
}