import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import { ApplicationOutcomeBox } from "../SessionOutcomeControls";

export default async function OutcomesAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const [studentsResult, applicationsResult] = await Promise.all([
    supabase.from("students").select("*").order("created_at", { ascending: false }).limit(100),
    supabase
      .from("applications")
      .select("*, students(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const students = studentsResult.data || [];
  const applications = applicationsResult.data || [];

  return (
    <AdminPageShell
      title="Outcomes"
      subtitle="Track application submissions, program milestones, scholarships, and decisions."
      profile={profile}
      user={user}
      current="/admin/outcomes"
    >
      <section className="grid gap-8">
        <ApplicationOutcomeBox students={students} />

        <DataTable
          title="Applications and Outcomes"
          headers={["Student", "Program", "Type", "Deadline", "Submitted", "Outcome"]}
          rows={applications.map((application) => [
            application.students?.full_name,
            application.institution_or_program,
            application.application_type,
            application.deadline,
            application.submitted ? "Yes" : "No",
            application.outcome,
          ])}
        />
      </section>
    </AdminPageShell>
  );
}