import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import StaffRoleSelect from "../StaffRoleSelect";
import StaffInviteBox from "../StaffInviteBox";
import StaffInviteActions from "../StaffInviteActions";
import { getRoleLabel, isFullAdmin } from "../adminPermissions";

export default async function StaffAdminPage() {
  const { supabase, user, profile, role, isAdmin } = await getAdmin();

  if (!isAdmin || !isFullAdmin(role)) {
    return <AccessRestricted user={user} profile={profile} />;
  }

  const [profilesResult, invitesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false }),

    supabase
      .from("pending_staff_invites")
      .select("id, email, role, note, created_at, accepted_at")
      .order("created_at", { ascending: false }),
  ]);

  const staffProfiles = profilesResult.data || [];
  const pendingInvites = invitesResult.data || [];

  return (
    <AdminPageShell
      title="Staff Roles"
      subtitle="Assign and update admin-side roles for SafePath Scholars staff accounts."
      profile={profile}
      user={user}
      current="/admin/staff"
    >
      <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
          Full admin only
        </p>

        <h2 className="mt-3 text-2xl font-black text-slate-950">
          Manage admin portal access carefully.
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
          Existing staff accounts appear once they have logged in. Pending staff
          invites let you assign a role before login; once that email signs in,
          the role is applied automatically.
        </p>
      </div>

      <div className="mb-8">
        <StaffInviteBox />
      </div>

      {(profilesResult.error || invitesResult.error) && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load staff data.
          </p>
          <p className="mt-2 text-sm text-rose-700">
            {profilesResult.error?.message || invitesResult.error?.message}
          </p>
        </div>
      )}

      <div className="mb-8">
        <DataTable
          title={`Pending Staff Invites (${pendingInvites.length})`}
          headers={["Email", "Role", "Note", "Status", "Created", "Actions"]}
          rows={pendingInvites.map((invite) => [
            invite.email,
            getRoleLabel(invite.role),
            invite.note || "—",
            invite.accepted_at ? "Accepted" : "Pending",
            invite.created_at
              ? new Date(invite.created_at).toLocaleDateString()
              : "—",
            <StaffInviteActions
              key={invite.id}
              inviteId={invite.id}
              email={invite.email}
              acceptedAt={invite.accepted_at}
            />,
          ])}
        />
      </div>

      <DataTable
        title={`Staff Profiles (${staffProfiles.length})`}
        headers={["Name", "Email", "Current Role", "Role Control", "Created"]}
        rows={staffProfiles.map((staffProfile) => [
          staffProfile.full_name || "—",
          staffProfile.email || "—",
          getRoleLabel(staffProfile.role),
          <StaffRoleSelect
            key={staffProfile.id}
            profileId={staffProfile.id}
            currentRole={staffProfile.role}
            email={staffProfile.email}
            isCurrentUser={staffProfile.id === user.id}
          />,
          staffProfile.created_at
            ? new Date(staffProfile.created_at).toLocaleDateString()
            : "—",
        ])}
      />
    </AdminPageShell>
  );
}