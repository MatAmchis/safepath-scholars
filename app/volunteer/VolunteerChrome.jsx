import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

const volunteerLinks = [
  { href: "/volunteer", label: "Dashboard" },
];

async function signOutVolunteer() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/volunteer/login");
}

export function VolunteerAccessRestricted({ user, volunteer }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-950">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-700">
          Access restricted
        </p>

        <h1 className="mt-4 text-3xl font-black">
          Approved volunteer access required
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          You are logged in, but this email is not currently approved for the
          SafePath Scholars volunteer portal.
        </p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          <p>
            <span className="font-bold">Current email:</span> {user.email}
          </p>

          <p>
            <span className="font-bold">Volunteer record:</span>{" "}
            {volunteer ? "Found" : "Not found"}
          </p>

          <p>
            <span className="font-bold">Volunteer status:</span>{" "}
            {volunteer?.status || "No approved volunteer status"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            Back to website
          </a>

          <form action={signOutVolunteer}>
            <button
              type="submit"
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export function VolunteerPageShell({
  title,
  subtitle,
  volunteer,
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
              {subtitle || `Welcome, ${volunteer.full_name || volunteer.email}.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100"
            >
              Back to website
            </a>

            <form action={signOutVolunteer}>
              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        <nav className="mb-10 flex gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {volunteerLinks.map((link) => (
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

export function VolunteerMetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

export function VolunteerInfoCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-600">{children}</div>
    </div>
  );
}