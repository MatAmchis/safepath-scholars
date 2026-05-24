"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export default function VolunteerSessionForm({ matches, studentsById }) {
  const router = useRouter();

  const [matchId, setMatchId] = useState(matches?.[0]?.id || "");
  const [serviceType, setServiceType] = useState("");
  const [sessionDate, setSessionDate] = useState(todayDateString());
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedMatch = useMemo(
    () => matches.find((match) => match.id === matchId),
    [matches, matchId]
  );

  async function submitSession(event) {
    event.preventDefault();

    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/volunteer/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "log_session",
          matchId,
          serviceType,
          sessionDate,
          durationMinutes,
          notes,
          nextSteps,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not log session.");
      }

      setMessage("Session logged successfully.");
      setServiceType("");
      setDurationMinutes("");
      setNotes("");
      setNextSteps("");

      router.refresh();
    } catch (error) {
      console.error("Volunteer session logging error:", error);
      setMessage(error.message || "Could not log session.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-2xl font-black text-slate-950">
          No active matches available
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          You need at least one assigned student match before you can log a
          session.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitSession}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
          Log session
        </p>

        <h2 className="mt-3 text-2xl font-black text-slate-950">
          Record volunteer support
        </h2>

        <p className="mt-2 text-sm leading-7 text-slate-600">
          Log tutoring, mentorship, essay feedback, application help, or other
          approved educational support.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">
            Student match
          </span>

          <select
            required
            value={matchId}
            onChange={(event) => setMatchId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {matches.map((match) => {
              const student = studentsById[match.student_id];
              const label = student?.full_name || "Matched student";
              const track =
                match.service_track ||
                match.service_type ||
                match.support_type ||
                "support";

              return (
                <option key={match.id} value={match.id}>
                  {label} — {track}
                </option>
              );
            })}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">
            Service type
          </span>

          <select
            required
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Select service type</option>
            <option value="Essay feedback">Essay feedback</option>
            <option value="Tutoring">Tutoring</option>
            <option value="English support">English support</option>
            <option value="Application guidance">Application guidance</option>
            <option value="Mentorship">Mentorship</option>
            <option value="Other educational support">
              Other educational support
            </option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">
            Session date
          </span>

          <input
            type="date"
            required
            value={sessionDate}
            onChange={(event) => setSessionDate(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">
            Duration in minutes
          </span>

          <input
            type="number"
            required
            min="1"
            max="600"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="60"
          />
        </label>
      </div>

      {selectedMatch && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          <p>
            <span className="font-bold text-slate-800">Selected match:</span>{" "}
            {studentsById[selectedMatch.student_id]?.full_name ||
              "Matched student"}
          </p>

          <p>
            <span className="font-bold text-slate-800">Track:</span>{" "}
            {selectedMatch.service_track ||
              selectedMatch.service_type ||
              selectedMatch.support_type ||
              "—"}
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">
            Session notes
          </span>

          <textarea
            required
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Briefly describe what was covered. Keep notes factual and professional."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-800">
            Next steps
          </span>

          <textarea
            rows={5}
            value={nextSteps}
            onChange={(event) => setNextSteps(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Optional: what should happen before the next session?"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-bold text-amber-900">
          Keep session notes within program boundaries.
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Do not provide legal, visa, asylum, immigration, financial, medical,
          emergency, or relocation advice. Escalate serious concerns to program
          leadership.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Log session"}
        </button>

        {message && (
          <p className="text-sm font-bold text-slate-700">{message}</p>
        )}
      </div>
    </form>
  );
}