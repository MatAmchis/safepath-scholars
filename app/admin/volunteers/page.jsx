import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import {
  AdminStatusSelect,
  AdminNotesBox,
} from "../AdminActionControls";
import { VOLUNTEER_STATUS_OPTIONS } from "../adminOptions";

export default async function VolunteersAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const { data: volunteers = [] } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminPageShell
      title="Volunteers"
      subtitle="Screen volunteers, approve applicants, and record internal notes."
      profile={profile}
      user={user}
      current="/admin/volunteers"
    >
      <DataTable
        title="Volunteer Applications"
        headers={["Name", "Email", "School", "Skills", "Status", "Internal Notes"]}
        rows={volunteers.map((volunteer) => [
          volunteer.full_name,
          volunteer.email,
          volunteer.school,
          volunteer.skills?.join(", "),
          <AdminStatusSelect
            key={`status-${volunteer.id}`}
            action="updateVolunteerStatus"
            id={volunteer.id}
            value={volunteer.status}
            options={VOLUNTEER_STATUS_OPTIONS}
          />,
          <AdminNotesBox
            key={`notes-${volunteer.id}`}
            action="updateVolunteerNotes"
            id={volunteer.id}
            value={volunteer.admin_notes}
            placeholder="Screening notes, strengths, concerns, assignment ideas."
          />,
        ])}
      />
    </AdminPageShell>
  );
}