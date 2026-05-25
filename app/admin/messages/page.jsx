import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import AdminFilters from "../AdminFilters";

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

export default async function MessagesPage({ searchParams }) {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const params = await Promise.resolve(searchParams || {});
  const q = String(params.q || "").trim();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  let messages = data || [];

  messages = messages.filter((message) =>
    includesText(message, q, [
      "name",
      "email",
      "inquiry_type",
      "message",
      "status",
    ])
  );

  return (
    <AdminPageShell
      title="Messages"
      subtitle="Review contact messages, referrals, questions, and partner inquiries."
      profile={profile}
      user={user}
      current="/admin/messages"
    >
      <AdminFilters
        searchPlaceholder="Search name, email, inquiry type, message..."
        showSearch
      />

      {error && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load messages.
          </p>
          <p className="mt-2 text-sm text-rose-700">{error.message}</p>
        </div>
      )}

      <DataTable
        title={`Contact Messages (${messages.length})`}
        headers={["Name", "Email", "Type", "Message", "Status", "Received"]}
        rows={messages.map((message) => [
          message.name,
          message.email,
          message.inquiry_type,
          message.message,
          message.status,
          message.created_at
            ? new Date(message.created_at).toLocaleDateString()
            : "—",
        ])}
      />
    </AdminPageShell>
  );
}