"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

async function runAdminAction(payload) {
  const response = await fetch("/api/admin/actions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Admin action failed.");
  }

  return data;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function LogSessionBox({ matches }) {
  const router = useRouter();
  const [matchId, setMatchId] = useState("");
  const [sessionDate, setSessionDate] = useState(todayIsoDate());
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [serviceType, setServiceType] = useState("Application mentorship");
  const [sessionNotes, setSessionNotes] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const activeMatches = matches.filter((match) => match.status === "active");

  async function handleSubmit() {
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action: "logSession",
        matchId,
        sessionDate,
        durationMinutes: Number(durationMinutes),
        serviceType,
        sessionNotes,
        nextSteps,
      });

      setMessage("Session logged");
      setMatchId("");
      setSessionDate(todayIsoDate());
      setDurationMinutes("60");
      setServiceType("Application mentorship");
      setSessionNotes("");
      setNextSteps("");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error logging session");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-950">
          Log Service Session
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Record tutoring, essay feedback, application mentorship, or scholarship support.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Match
          </span>
          <select
            value={matchId}
            onChange={(event) => setMatchId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Select match</option>
            {activeMatches.map((match) => (
              <option key={match.id} value={match.id}>
                {(match.students?.full_name || "Student")} →{" "}
                {(match.volunteers?.full_name || "Volunteer")} —{" "}
                {match.service_track}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Date
          </span>
          <input
            type="date"
            value={sessionDate}
            onChange={(event) => setSessionDate(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Minutes
          </span>
          <input
            type="number"
            min="15"
            step="15"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Service type
          </span>
          <select
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option>Application mentorship</option>
            <option>Essay feedback</option>
            <option>SAT Math</option>
            <option>SAT Reading/Writing</option>
            <option>English tutoring</option>
            <option>Scholarship search</option>
            <option>General mentorship</option>
            <option>Operations / intake support</option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Session notes
          </span>
          <textarea
            value={sessionNotes}
            onChange={(event) => setSessionNotes(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="What was covered?"
          />
        </label>

        <label className="block md:col-span-3">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Next steps
          </span>
          <textarea
            value={nextSteps}
            onChange={(event) => setNextSteps(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="What should happen before the next session?"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !matchId || !sessionDate || !durationMinutes}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Logging..." : "Log session"}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm font-bold text-slate-600">{message}</p>
      )}
    </div>
  );
}

export function ApplicationOutcomeBox({ students }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [institutionOrProgram, setInstitutionOrProgram] = useState("");
  const [applicationType, setApplicationType] = useState("College application");
  const [deadline, setDeadline] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState("");
  const [outcome, setOutcome] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action: "createApplicationOutcome",
        studentId,
        institutionOrProgram,
        applicationType,
        deadline,
        submitted,
        submittedDate,
        outcome,
        notes,
      });

      setMessage("Application/outcome record saved");
      setStudentId("");
      setInstitutionOrProgram("");
      setApplicationType("College application");
      setDeadline("");
      setSubmitted(false);
      setSubmittedDate("");
      setOutcome("Pending");
      setNotes("");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error saving outcome");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-950">
          Track Application / Outcome
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Record applications supported, scholarship submissions, and outcomes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Student
          </span>
          <select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Institution / Program
          </span>
          <input
            value={institutionOrProgram}
            onChange={(event) => setInstitutionOrProgram(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Example: University, scholarship, program"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Application type
          </span>
          <select
            value={applicationType}
            onChange={(event) => setApplicationType(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option>College application</option>
            <option>Scholarship application</option>
            <option>Transfer application</option>
            <option>Summer program</option>
            <option>English test registration</option>
            <option>SAT registration</option>
            <option>Other</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Deadline
          </span>
          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={submitted}
            onChange={(event) => setSubmitted(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />
          <span className="text-sm font-bold text-slate-700">Submitted</span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Submitted date
          </span>
          <input
            type="date"
            value={submittedDate}
            onChange={(event) => setSubmittedDate(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Outcome
          </span>
          <select
            value={outcome}
            onChange={(event) => setOutcome(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option>Pending</option>
            <option>Submitted</option>
            <option>Accepted</option>
            <option>Rejected</option>
            <option>Waitlisted</option>
            <option>Scholarship awarded</option>
            <option>Scholarship denied</option>
            <option>Withdrawn</option>
            <option>Unknown</option>
          </select>
        </label>

        <label className="block md:col-span-4">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Notes
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="What support was provided? What was submitted? What outcome occurred?"
          />
        </label>

        <div className="flex items-end md:col-span-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !studentId || !institutionOrProgram}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save application/outcome"}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm font-bold text-slate-600">{message}</p>
      )}
    </div>
  );
}