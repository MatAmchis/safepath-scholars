import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import EssayDownloadButton from "../EssayDownloadButton";
import {
  AdminStatusSelect,
  AdminNotesBox,
  EssayReviewerSelect,
} from "../AdminActionControls";
import { ESSAY_STATUS_OPTIONS } from "../adminOptions";

export default async function EssaysAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const [essaysResult, volunteersResult] = await Promise.all([
    supabase
      .from("essay_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const essays = essaysResult.data || [];
  const volunteers = volunteersResult.data || [];

  return (
    <AdminPageShell
      title="Essays"
      subtitle="Download private essay files, assign reviewers, update status, and save reviewer notes."
      profile={profile}
      user={user}
      current="/admin/essays"
    >
      <DataTable
        title="Essay Submissions"
        headers={[
          "Student",
          "Email",
          "Type",
          "Deadline",
          "File",
          "Reviewer",
          "Status",
          "Internal Notes",
        ]}
        rows={essays.map((essay) => [
          essay.student_name,
          essay.student_email,
          essay.document_type,
          essay.deadline,
          <EssayDownloadButton
            key={`download-${essay.id}`}
            filePath={essay.file_path}
            driveLink={essay.drive_link}
          />,
          <EssayReviewerSelect
            key={`reviewer-${essay.id}`}
            essayId={essay.id}
            currentVolunteerId={essay.assigned_volunteer_id}
            volunteers={volunteers}
          />,
          <AdminStatusSelect
            key={`status-${essay.id}`}
            action="updateEssayStatus"
            id={essay.id}
            value={essay.status}
            options={ESSAY_STATUS_OPTIONS}
          />,
          <AdminNotesBox
            key={`notes-${essay.id}`}
            action="updateEssayNotes"
            id={essay.id}
            value={essay.admin_notes}
            placeholder="Reviewer notes, assignment notes, quality concerns, next action."
          />,
        ])}
      />
    </AdminPageShell>
  );
}