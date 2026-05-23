import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";

export default async function MessagesAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const { data: contacts = [] } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminPageShell
      title="Messages"
      subtitle="Review contact messages, referrals, partnership inquiries, and safety concerns."
      profile={profile}
      user={user}
      current="/admin/messages"
    >
      <DataTable
        title="Contact Messages"
        headers={["Name", "Email", "Type", "Organization", "Message", "Status"]}
        rows={contacts.map((message) => [
          message.name,
          message.email,
          message.inquiry_type,
          message.organization,
          message.message,
          message.status,
        ])}
      />
    </AdminPageShell>
  );
}