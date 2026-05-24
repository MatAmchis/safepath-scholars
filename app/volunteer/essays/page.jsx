import { getVolunteerAccess } from "../volunteerHelpers";
import {
  VolunteerAccessRestricted,
  VolunteerPageShell,
} from "../VolunteerChrome";
import EssayDownloadButton from "../EssayDownloadButton";

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
        No assigned essays yet
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        When an admin assigns an essay to you, it will appear here with the
        prompt, deadline, notes, status, and secure download button.
      </p>
    </div>
  );
}

function EssayCard({ essay }) {
  const studentName = getField(essay, [
    "student_name",
    "full_name",
    "name",
    "student_full_name",
  ]);

  const studentEmail = getField(essay, [
    "student_email",
    "email",
    "contact_email",
  ]);

  const essayType = getField(essay, [
    "essay_type",
    "document_type",
    "submission_type",
    "type",
  ]);

  const prompt = getField(essay, [
    "essay_prompt",
    "prompt",
    "question",
    "description",
  ]);

  const deadline = getField(essay, [
    "deadline",
    "due_date",
    "application_deadline",
  ]);

  const notes = getField(essay, [
    "admin_notes",
    "notes",
    "student_notes",
    "additional_context",
  ]);

  const filePath = getField(essay, ["file_path", "storage_path"]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Assigned Essay
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {studentName || "Student essay"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Submitted {formatDate(essay.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700">
            {essay.status || "submitted"}
          </span>

          {essayType && (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-800">
              {essayType}
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
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Deadline
          </p>
          <p className="mt-2 text-sm font-bold text-slate-800">
            {formatDate(deadline)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            File
          </p>
          <div className="mt-2">
            <EssayDownloadButton filePath={filePath} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black text-slate-950">Prompt / task</p>
          <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {prompt || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm font-black text-slate-950">Notes</p>
          <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {notes || "—"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function VolunteerEssaysPage() {
  const { supabase, user, volunteer, isApprovedVolunteer } =
    await getVolunteerAccess();

  if (!isApprovedVolunteer) {
    return <VolunteerAccessRestricted user={user} volunteer={volunteer} />;
  }

  const { data: essays, error } = await supabase
    .from("essay_submissions")
    .select("*")
    .eq("assigned_volunteer_id", volunteer.id)
    .order("created_at", { ascending: false });

  return (
    <VolunteerPageShell
      title="Assigned Essays"
      subtitle="View essay assignments that have been assigned to your approved volunteer profile."
      volunteer={volunteer}
      current="/volunteer/essays"
    >
      {error && (
        <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-bold text-rose-800">
            Could not load assigned essays.
          </p>
          <p className="mt-2 text-sm text-rose-700">{error.message}</p>
        </div>
      )}

      <section className="grid gap-6">
        {!error && (!essays || essays.length === 0) ? (
          <EmptyState />
        ) : (
          (essays || []).map((essay) => (
            <EssayCard key={essay.id} essay={essay} />
          ))
        )}
      </section>
    </VolunteerPageShell>
  );
}