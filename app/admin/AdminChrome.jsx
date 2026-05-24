import LogoutButton from "./LogoutButton";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/status-guide", label: "Status Guide" },
  { href: "/admin/volunteer-onboarding", label: "Volunteer Onboarding" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/volunteers", label: "Volunteers" },
  { href: "/admin/essays", label: "Essays" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/outcomes", label: "Outcomes" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/feedback", label: "Feedback" },
];

export function AccessRestricted({ user }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-950">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-700">
          Access restricted
        </p>

        <h1 className="mt-4 text-3xl font-black">Admin access required</h1>

        <p className="mt-4 leading-7 text-slate-600">
          You are logged in, but this account has not been assigned the admin
          role yet.
        </p>

        <p className="mt-4 rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
          Current email: {user.email}
        </p>
      </div>
    </main>
  );
}

export function AdminPageShell({
  title,
  subtitle,
  profile,
  user,
  current,
  children,
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              SafePath Scholars
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {title}
            </h1>

            <p className="mt-3 text-slate-600">
              {subtitle ||
                `Welcome, ${profile.full_name || profile.email || user.email}.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100"
            >
              Back to website
            </a>

            <LogoutButton />
          </div>
        </div>

        <nav className="mb-10 flex gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {adminLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={
                current === link.href
                  ? "whitespace-nowrap rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                  : "whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {children}
      </div>
    </main>
  );
}

export function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

export function DataTable({ title, headers, rows }) {
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
                <td
                  className="px-5 py-6 text-slate-500"
                  colSpan={headers.length}
                >
                  No records yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${index}-${cellIndex}`}
                      className="max-w-[340px] px-5 py-4 align-top text-slate-700"
                    >
                      {cell === null || cell === undefined || cell === ""
                        ? "—"
                        : cell}
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