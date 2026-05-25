import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminFilters from "../AdminFilters";
import EssayDownloadButton from "../EssayDownloadButton";
import {
  AdminStatusSelect,
  AdminNotesBox,
  EssayReviewerSelect,
} from "../AdminActionControls";
import { ESSAY_STATUS_OPTIONS } from "../adminOptions";

function includesText(record, query, fields) {
  if (!query) return true;

  const q = query.toLowerCase();

  return fields.some((field) => {
    const value = record?.[field];

    if (Array.isArray(value)) {
      return value.join(" ").toLowerCase().includes(q);
    }

    return String(value || "").toLowerCase().includes(q);
  });
}

export default async function EssaysPage({ searchParams }) {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const params = await Promise.resolve(searchParams || {});
  const q = String(params.q || "").trim();
  const status = String(params.status || "").trim();
  const reviewer = String(params.reviewer || "").trim();

  const [essaysResult, volunteersResult] = await Promise.all([
    supabase
      .from("essay_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),

    supabase
      .from("volunteers")
      .select("id, full_name, email, status")
      .order("full_name", { ascending: true }),
  ]);

  let essays = essaysResult.data || [];
  const volunteers = volunteersResult.data || [];

  essays = essays.filter((essay) => {
    const matchesSearch = includesText(essay, q, [
      "student_name",
      "student_email",
      "document_type",
      "prompt",
      "notes",
      "admin_notes",
    ]);

    const matchesStatus = status ? essay.status === status : true;

    const matchesReviewer =
      reviewer === "unassigned"
        ? !essay.assigned_volunteer_id
        : reviewer
          ? essay.assigned_volunteer_id === reviewer
          : true;

    return matchesSearch && matchesStatus && matchesReviewer;
  });

  const reviewerOptions = volunteers.map((volunteer) => ({
    value: volunteer.id,
    label: volunteer.full_name || volunteer.email || "Unnamed volunteer",
  }));

  return (
    <AdminPageShell
      title="Essays"
      subtitle="Review essay submissions, download files, assign reviewers, and track feedback status."
      profile={profile}
      user={user}
      current="/admin/essays"
    >
      <AdminFilters
        searchPlaceholder="Search student, email, essay type, prompt, notes..."
        showSearch
        showStatus
        showReviewer
        statusOptions={ESSAY_STATUS_OPTIONS}
        reviewerOptions={reviewerOptions}
      />

      {(essaysResult.error || volunteersResult.error) && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load essays.
          </p>
          <p className="mt-2 text-sm text-rose-700">
            {essaysResult.error?.message || volunteersResult.error?.message}
          </p>
        </div>
      )}

      <DataTable
        title={`Essay Submissions (${essays.length})`}
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