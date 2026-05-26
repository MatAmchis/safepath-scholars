import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminFilters from "../AdminFilters";
import AdminExportButton from "../AdminExportButton";
import {
  AdminStatusSelect,
  AdminPrioritySelect,
  AdminNotesBox,
} from "../AdminActionControls";
import { STUDENT_STATUS_OPTIONS } from "../adminOptions";
import {
  AdminActionGate,
  AdminExportGate,
  AdminReadOnlyValue,
} from "../AdminRoleControls";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "standard", label: "Standard" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

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

export default async function StudentsPage({ searchParams }) {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const params = await Promise.resolve(searchParams || {});
  const q = String(params.q || "").trim();
  const status = String(params.status || "").trim();
  const priority = String(params.priority || "").trim();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  let students = data || [];

  students = students.filter((student) => {
    const matchesSearch = includesText(student, q, [
      "full_name",
      "email",
      "current_location",
      "support_needs",
      "admin_notes",
    ]);

    const matchesStatus = status ? student.status === status : true;
    const matchesPriority = priority ? student.priority === priority : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <AdminPageShell
      title="Students"
      subtitle="Review student intakes, update triage status, set priority, and keep internal notes."
      profile={profile}
      user={user}
      current="/admin/students"
    >
      <AdminFilters
        searchPlaceholder="Search name, email, location, needs, notes..."
        showSearch
        showStatus
        showPriority
        statusOptions={STUDENT_STATUS_OPTIONS}
        priorityOptions={PRIORITY_OPTIONS}
      />

      <AdminExportGate role={role} type="students">
        <div className="mb-6 flex justify-end">
          <AdminExportButton
            type="students"
            label="Export students CSV"
            filename="students.csv"
          />
        </div>
      </AdminExportGate>

      {error && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load students.
          </p>
          <p className="mt-2 text-sm text-rose-700">{error.message}</p>
        </div>
      )}

      <DataTable
        title={`Student Intakes (${students.length})`}
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
          <AdminActionGate
            key={`status-${student.id}`}
            role={role}
            action="updateStudentStatus"
            fallback={<AdminReadOnlyValue value={student.status} />}
          >
            <AdminStatusSelect
              action="updateStudentStatus"
              id={student.id}
              value={student.status}
              options={STUDENT_STATUS_OPTIONS}
            />
          </AdminActionGate>,
          <AdminActionGate
            key={`priority-${student.id}`}
            role={role}
            action="updateStudentPriority"
            fallback={<AdminReadOnlyValue value={student.priority} />}
          >
            <AdminPrioritySelect id={student.id} value={student.priority} />
          </AdminActionGate>,
          <AdminActionGate
            key={`notes-${student.id}`}
            role={role}
            action="updateStudentNotes"
            fallback={
              <AdminReadOnlyValue value={student.admin_notes} multiline />
            }
          >
            <AdminNotesBox
              action="updateStudentNotes"
              id={student.id}
              value={student.admin_notes}
              placeholder="Internal notes, triage, follow-up, urgency, risk flags."
            />
          </AdminActionGate>,
        ])}
      />
    </AdminPageShell>
  );
}