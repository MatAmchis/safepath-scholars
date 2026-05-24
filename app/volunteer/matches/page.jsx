import { getVolunteerAccess } from "../volunteerHelpers";
import {
  VolunteerAccessRestricted,
  VolunteerPageShell,
} from "../VolunteerChrome";

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

function getField(record, names) {
  for (const name of names) {
    if (record?.[name] !== undefined && record?.[name] !== null) {
      return record[name];
    }
  }

  return "";
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h2 className="text-2xl font-black text-slate-950">
        No student matches yet
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        When an admin matches you with a student, the match will appear here
        with the service track, status, start date, and notes.
      </p>
    </div>
  );
}

function MatchCard({ match, student }) {
  const serviceTrack = getField(match, [
    "service_track",
    "service_type",
    "service_needed",
    "track",
    "support_type",
  ]);

  const startDate = getField(match, [
    "start_date",
    "matched_at",
    "created_at",
  ]);

  const notes = getField(match, [
    "notes",
    "admin_notes",
    "match_notes",
    "next_steps",
  ]);

  const studentName =
    getField(student, ["full_name", "student_name", "name"]) ||
    getField(match, ["student_name", "student_full_name"]);

  const studentEmail =
    getField(student, ["email", "student_email", "contact_email"]) ||
    getField(match, ["student_email"]);

  const studentSchool =
    getField(student, ["school", "current_school", "institution"]) ||
    getField(match, ["student_school"]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Student Match
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {studentName || "Matched student"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Created {formatDate(match.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700">
            {match.status || "active"}
          </span>

          {serviceTrack && (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-800">
              {serviceTrack}
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
            {studentName || "—"}
          </p>

          <p className="mt-1 text-sm text-slate-600">{studentEmail || "—"}</p>

          <p className="mt-1 text-sm text-slate-600">{studentSchool || "—"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Service track
          </p>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {serviceTrack || "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Start date
          </p>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {formatDate(startDate)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-black text-slate-950">
          Notes / next steps
        </p>

        <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          {notes || "—"}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-bold text-amber-900">
          Reminder: keep support within program boundaries.
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Do not provide legal, visa, asylum, immigration, financial, or
          relocation advice. Escalate safety, conduct, or emergency concerns to
          program leadership.
        </p>
      </div>
    </article>
  );
}

export default async function VolunteerMatchesPage() {
  const { supabase, user, volunteer, isApprovedVolunteer } =
    await getVolunteerAccess();

  if (!isApprovedVolunteer) {
    return <VolunteerAccessRestricted user={user} volunteer={volunteer} />;
  }

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .eq("volunteer_id", volunteer.id)
    .order("created_at", { ascending: false });

  const studentIds = [
    ...new Set((matches || []).map((match) => match.student_id).filter(Boolean)),
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

  return (
    <VolunteerPageShell
      title="Student Matches"
      subtitle="View students who have been matched to your approved volunteer profile."
      volunteer={volunteer}
      current="/volunteer/matches"
    >
      {matchesError && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load matches.
          </p>
          <p className="mt-2 text-sm text-rose-700">
            {matchesError.message}
          </p>
        </div>
      )}

      <section className="grid gap-6">
        {!matchesError && (!matches || matches.length === 0) ? (
          <EmptyState />
        ) : (
          (matches || []).map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              student={studentsById[match.student_id]}
            />
          ))
        )}
      </section>
    </VolunteerPageShell>
  );
}