import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";

export default async function FeedbackAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const { data: feedback = [] } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminPageShell
      title="Feedback"
      subtitle="Review student, volunteer, guardian, and partner feedback."
      profile={profile}
      user={user}
      current="/admin/feedback"
    >
      <DataTable
        title="Feedback Records"
        headers={[
          "Type",
          "Email",
          "Services",
          "Helpful",
          "Concern",
          "Most Helpful",
          "Could Improve",
        ]}
        rows={feedback.map((item) => [
          item.respondent_type,
          item.email,
          item.service_used?.join(", "),
          item.rating_helpfulness,
          item.concern_reported ? "Yes" : "No",
          item.most_helpful,
          item.could_improve,
        ])}
      />
    </AdminPageShell>
  );
}