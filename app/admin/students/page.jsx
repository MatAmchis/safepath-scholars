import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import {
  AdminStatusSelect,
  AdminPrioritySelect,
  AdminNotesBox,
} from "../AdminActionControls";
import { STUDENT_STATUS_OPTIONS } from "../adminOptions";

export default async function StudentsAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const { data: students = [] } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminPageShell
      title="Students"
      subtitle="Review student intakes, update status, set urgency, and save internal notes."
      profile={profile}
      user={user}
      current="/admin/students"
    >
      <DataTable
        title="Student Intakes"
        headers={[
          "Name",
          "Email",
          "Location",
          "Needs",
          "Status",
          "Priority",
          "Internal Notes",
        ]}
        rows={students.map((student) => [
          student.full_name,
          student.email,
          student.current_location,
          student.support_needs?.join(", "),
          <AdminStatusSelect
            key={`status-${student.id}`}
            action="updateStudentStatus"
            id={student.id}
            value={student.status}
            options={STUDENT_STATUS_OPTIONS}
          />,
          <AdminPrioritySelect
            key={`priority-${student.id}`}
            id={student.id}
            value={student.priority}
          />,
          <AdminNotesBox
            key={`notes-${student.id}`}
            action="updateStudentNotes"
            id={student.id}
            value={student.admin_notes}
            placeholder="Internal notes, triage, follow-up, urgency, risk flags."
          />,
        ])}
      />
    </AdminPageShell>
  );
}