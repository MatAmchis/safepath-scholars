import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminFilters from "../AdminFilters";
import AdminExportButton from "../AdminExportButton";
import { AdminStatusSelect, AdminNotesBox } from "../AdminActionControls";
import { VOLUNTEER_STATUS_OPTIONS } from "../adminOptions";
import {
  AdminActionGate,
  AdminExportGate,
  AdminReadOnlyValue,
} from "../AdminRoleControls";

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

export default async function VolunteersPage({ searchParams }) {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const params = await Promise.resolve(searchParams || {});
  const q = String(params.q || "").trim();
  const status = String(params.status || "").trim();

  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  let volunteers = data || [];

  volunteers = volunteers.filter((volunteer) => {
    const matchesSearch = includesText(volunteer, q, [
      "full_name",
      "email",
      "school",
      "skills",
      "admin_notes",
      "availability",
      "weekly_availability",
    ]);

    const matchesStatus = status ? volunteer.status === status : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminPageShell
      title="Volunteers"
      subtitle="Screen volunteer applications, approve volunteers, and keep internal assignment notes."
      profile={profile}
      user={user}
      current="/admin/volunteers"
    >
      <AdminFilters
        searchPlaceholder="Search name, email, school, skills, notes..."
        showSearch
        showStatus
        statusOptions={VOLUNTEER_STATUS_OPTIONS}
      />

      <AdminExportGate role={role} type="volunteers">
        <div className="mb-6 flex justify-end">
          <AdminExportButton
            type="volunteers"
            label="Export volunteers CSV"
            filename="volunteers.csv"
          />
        </div>
      </AdminExportGate>

      {error && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load volunteers.
          </p>
          <p className="mt-2 text-sm text-rose-700">{error.message}</p>
        </div>
      )}

      <DataTable
        title={`Volunteer Applications (${volunteers.length})`}
        headers={["Name", "Email", "School", "Skills", "Status", "Internal Notes"]}
        rows={volunteers.map((volunteer) => [
          volunteer.full_name,
          volunteer.email,
          volunteer.school,
          volunteer.skills?.join(", "),
          <AdminActionGate
            key={`status-${volunteer.id}`}
            role={role}
            action="updateVolunteerStatus"
            fallback={<AdminReadOnlyValue value={volunteer.status} />}
          >
            <AdminStatusSelect
              action="updateVolunteerStatus"
              id={volunteer.id}
              value={volunteer.status}
              options={VOLUNTEER_STATUS_OPTIONS}
            />
          </AdminActionGate>,
          <AdminActionGate
            key={`notes-${volunteer.id}`}
            role={role}
            action="updateVolunteerNotes"
            fallback={
              <AdminReadOnlyValue value={volunteer.admin_notes} multiline />
            }
          >
            <AdminNotesBox
              action="updateVolunteerNotes"
              id={volunteer.id}
              value={volunteer.admin_notes}
              placeholder="Screening notes, strengths, concerns, assignment ideas."
            />
          </AdminActionGate>,
        ])}
      />
    </AdminPageShell>
  );
}