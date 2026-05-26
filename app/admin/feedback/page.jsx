import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminExportButton from "../AdminExportButton";
import { AdminExportGate } from "../AdminRoleControls";

export default async function FeedbackAdminPage() {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const feedback = data || [];

  return (
    <AdminPageShell
      title="Feedback"
      subtitle="Review feedback submitted by students, volunteers, families, and partners."
      profile={profile}
      user={user}
      current="/admin/feedback"
    >
      <AdminExportGate role={role} type="feedback">
        <div className="mb-6 flex justify-end">
          <AdminExportButton
            type="feedback"
            label="Export feedback CSV"
            filename="feedback.csv"
          />
        </div>
      </AdminExportGate>

      {error && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load feedback.
          </p>
          <p className="mt-2 text-sm text-rose-700">{error.message}</p>
        </div>
      )}

      <DataTable
        title={`Feedback (${feedback.length})`}
        headers={["Type", "Email", "Services", "Helpful", "Concern", "Comments"]}
        rows={feedback.map((item) => [
          item.respondent_type,
          item.email,
          item.service_used?.join(", "),
          item.rating_helpfulness,
          item.concern_reported ? "Yes" : "No",
          item.comments,
        ])}
      />
    </AdminPageShell>
  );
}