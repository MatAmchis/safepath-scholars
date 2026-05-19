import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

function DataTable({ title, headers, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-3 font-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-slate-500" colSpan={headers.length}>
                  No records yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${index}-${cellIndex}`}
                      className="max-w-[260px] truncate px-5 py-4 text-slate-700"
                    >
                      {cell || "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-700">
            Access restricted
          </p>
          <h1 className="mt-4 text-3xl font-black">Admin access required</h1>
          <p className="mt-4 leading-7 text-slate-600">
            You are logged in, but this account has not been assigned the admin role yet.
          </p>
          <p className="mt-4 rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
            Current email: {user.email}
          </p>
        </div>
      </main>
    );
  }

  const [studentsResult, volunteersResult, essaysResult, contactsResult, feedbackResult] =
    await Promise.all([
      supabase.from("students").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("volunteers").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("essay_submissions").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

  const students = studentsResult.data || [];
  const volunteers = volunteersResult.data || [];
  const essays = essaysResult.data || [];
  const contacts = contactsResult.data || [];
  const feedback = feedbackResult.data || [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              SafePath Scholars
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-3 text-slate-600">
              Welcome, {profile.full_name || profile.email || user.email}.
            </p>
          </div>

          <a
            href="/"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            Back to website
          </a>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Student intakes" value={students.length} />
          <MetricCard label="Volunteer applications" value={volunteers.length} />
          <MetricCard label="Essay submissions" value={essays.length} />
          <MetricCard label="Contact messages" value={contacts.length} />
          <MetricCard label="Feedback records" value={feedback.length} />
        </section>

        <section className="mt-10 grid gap-8">
          <DataTable
            title="Recent Student Intakes"
            headers={["Name", "Email", "Location", "Needs", "Status"]}
            rows={students.map((student) => [
              student.full_name,
              student.email,
              student.current_location,
              student.support_needs?.join(", "),
              student.status,
            ])}
          />

          <DataTable
            title="Recent Volunteer Applications"
            headers={["Name", "Email", "School", "Skills", "Status"]}
            rows={volunteers.map((volunteer) => [
              volunteer.full_name,
              volunteer.email,
              volunteer.school,
              volunteer.skills?.join(", "),
              volunteer.status,
            ])}
          />

          <DataTable
            title="Recent Essay Submissions"
            headers={["Student", "Email", "Type", "Deadline", "File", "Status"]}
            rows={essays.map((essay) => [
              essay.student_name,
              essay.student_email,
              essay.document_type,
              essay.deadline,
              essay.file_path || essay.drive_link || "No file/link",
              essay.status,
            ])}
          />

          <DataTable
            title="Recent Contact Messages"
            headers={["Name", "Email", "Type", "Status"]}
            rows={contacts.map((message) => [
              message.name,
              message.email,
              message.inquiry_type,
              message.status,
            ])}
          />
          <DataTable
            title="Recent Feedback"
            headers={["Type", "Email", "Services", "Helpful", "Concern"]}
            rows={feedback.map((item) => [
              item.respondent_type,
              item.email,
              item.service_used?.join(", "),
              item.rating_helpfulness,
              item.concern_reported ? "Yes" : "No",
            ])}
          />
        </section>
      </div>
    </main>
  );
}