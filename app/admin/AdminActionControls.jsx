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

export function AdminStatusSelect({ action, id, value, options }) {
  const router = useRouter();
  const [currentValue, setCurrentValue] = useState(value || "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(event) {
    const nextValue = event.target.value;
    setCurrentValue(nextValue);
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action,
        id,
        status: nextValue,
      });

      setMessage("Saved");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-w-[160px] flex-col gap-1">
      <select
        value={currentValue}
        onChange={handleChange}
        disabled={isSaving}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {message && (
        <p className="text-[11px] font-semibold text-slate-500">{message}</p>
      )}
    </div>
  );
}
export function AdminPrioritySelect({ id, value }) {
  const router = useRouter();
  const [currentValue, setCurrentValue] = useState(value || "medium");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(event) {
    const nextValue = event.target.value;
    setCurrentValue(nextValue);
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action: "updateStudentPriority",
        id,
        priority: nextValue,
      });

      setMessage("Saved");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-w-[150px] flex-col gap-1">
      <select
        value={currentValue}
        onChange={handleChange}
        disabled={isSaving}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      {message && (
        <p className="text-[11px] font-semibold text-slate-500">{message}</p>
      )}
    </div>
  );
}

export function AdminNotesBox({ action, id, value, placeholder }) {
  const router = useRouter();
  const [notes, setNotes] = useState(value || "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action,
        id,
        notes,
      });

      setMessage("Saved");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-w-[240px] flex-col gap-2">
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={3}
        placeholder={placeholder || "Internal admin notes"}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save notes"}
      </button>

      {message && (
        <p className="text-[11px] font-semibold text-slate-500">{message}</p>
      )}
    </div>
  );
}
export function EssayReviewerSelect({ essayId, currentVolunteerId, volunteers }) {
  const router = useRouter();
  const [volunteerId, setVolunteerId] = useState(currentVolunteerId || "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(event) {
    const nextVolunteerId = event.target.value;
    setVolunteerId(nextVolunteerId);
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action: "assignEssayReviewer",
        essayId,
        volunteerId: nextVolunteerId,
      });

      setMessage("Assigned");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error");
    } finally {
      setIsSaving(false);
    }
  }

  const approvedVolunteers = volunteers.filter(
    (volunteer) => volunteer.status === "approved"
  );

  return (
    <div className="flex min-w-[190px] flex-col gap-1">
      <select
        value={volunteerId}
        onChange={handleChange}
        disabled={isSaving}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
      >
        <option value="">Unassigned</option>
        {approvedVolunteers.map((volunteer) => (
          <option key={volunteer.id} value={volunteer.id}>
            {volunteer.full_name}
          </option>
        ))}
      </select>

      {message && (
        <p className="text-[11px] font-semibold text-slate-500">{message}</p>
      )}
    </div>
  );
}

export function CreateMatchBox({ students, volunteers }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [serviceTrack, setServiceTrack] = useState("Application mentorship");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const eligibleStudents = students.filter((student) =>
    ["needs_review", "needs_match", "paused"].includes(student.status)
  );

  const approvedVolunteers = volunteers.filter(
    (volunteer) => volunteer.status === "approved"
  );

  async function handleCreateMatch() {
    setMessage("");
    setIsSaving(true);

    try {
      await runAdminAction({
        action: "createMatch",
        studentId,
        volunteerId,
        serviceTrack,
      });

      setMessage("Match created");
      setStudentId("");
      setVolunteerId("");
      setServiceTrack("Application mentorship");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Error creating match");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-950">
          Create Student-Volunteer Match
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Select a student, approved volunteer, and service track. Creating a
          match automatically marks the student as active.
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
            {eligibleStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Volunteer
          </span>
          <select
            value={volunteerId}
            onChange={(event) => setVolunteerId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Select volunteer</option>
            {approvedVolunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.full_name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Service track
          </span>
          <select
            value={serviceTrack}
            onChange={(event) => setServiceTrack(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option>Application mentorship</option>
            <option>Essay feedback</option>
            <option>SAT Math</option>
            <option>SAT Reading/Writing</option>
            <option>English tutoring</option>
            <option>Scholarship search</option>
            <option>General mentorship</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleCreateMatch}
            disabled={isSaving || !studentId || !volunteerId || !serviceTrack}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Creating..." : "Create match"}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm font-bold text-slate-600">{message}</p>
      )}
    </div>
  );
}