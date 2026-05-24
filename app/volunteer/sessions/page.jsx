import { getVolunteerAccess } from "../volunteerHelpers";
import {
  VolunteerAccessRestricted,
  VolunteerPageShell,
} from "../VolunteerChrome";
import VolunteerSessionForm from "../VolunteerSessionForm";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(minutes) {
  const value = Number(minutes || 0);

  if (!value) {
    return "—";
  }

  if (value < 60) {
    return `${value} min`;
  }

  const hours = value / 60;

  return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)} hr`;
}

function EmptyHistory() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-2xl font-black text-slate-950">
        No sessions logged yet
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        Once you log a session, it will appear here as part of your volunteer
        service history.
      </p>
    </div>
  );
}

function SessionCard({ session, match, student }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Logged Session
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {student?.full_name || "Matched student"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {formatDate(session.session_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700">
            {formatDuration(session.duration_minutes)}
          </span>

          {session.service_type && (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-800">
              {session.service_type}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Student
          </p>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {student?.full_name || "—"}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {student?.email || "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Match track
          </p>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {match?.service_track ||
              match?.service_type ||
              match?.support_type ||
              "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Logged
          </p>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {formatDate(session.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black text-slate-950">Session notes</p>

          <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {session.notes || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm font-black text-slate-950">Next steps</p>

          <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {session.next_steps || "—"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function VolunteerSessionsPage() {
  const { supabase, user, volunteer, isApprovedVolunteer } =
    await getVolunteerAccess();

  if (!isApprovedVolunteer) {
    return <VolunteerAccessRestricted user={user} volunteer={volunteer} />;
  }

  const [matchesResult, sessionsResult] = await Promise.all([
    supabase
      .from("matches")
      .select("*")
      .eq("volunteer_id", volunteer.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("sessions")
      .select("*")
      .eq("volunteer_id", volunteer.id)
      .order("session_date", { ascending: false }),
  ]);

  const matches = matchesResult.data || [];
  const sessions = sessionsResult.data || [];

  const studentIds = [
    ...new Set([
      ...matches.map((match) => match.student_id).filter(Boolean),
      ...sessions.map((session) => session.student_id).filter(Boolean),
    ]),
  ];

  let studentsById = {};

  if (studentIds.length > 0) {
    const { data: students } = await supabase
      .from("students")
      .select("id, full_name, email, school, status")
      .in("id", studentIds);

    studentsById = Object.fromEntries(
      (students || []).map((student) => [student.id, student])
    );
  }

  const matchesById = Object.fromEntries(
    matches.map((match) => [match.id, match])
  );

  return (
    <VolunteerPageShell
      title="Session Logging"
      subtitle="Log approved educational support sessions and view your volunteer service history."
      volunteer={volunteer}
      current="/volunteer/sessions"
    >
      {(matchesResult.error || sessionsResult.error) && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load session information.
          </p>

          <p className="mt-2 text-sm text-rose-700">
            {matchesResult.error?.message || sessionsResult.error?.message}
          </p>
        </div>
      )}

      <section className="grid gap-8">
        <VolunteerSessionForm matches={matches} studentsById={studentsById} />

        <div>
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            Session history
          </h2>

          <div className="grid gap-6">
            {sessions.length === 0 ? (
              <EmptyHistory />
            ) : (
              sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  match={matchesById[session.match_id]}
                  student={studentsById[session.student_id]}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </VolunteerPageShell>
  );
}