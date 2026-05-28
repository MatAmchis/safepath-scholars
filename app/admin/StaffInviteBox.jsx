"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const roleOptions = [
  { value: "coordinator", label: "Coordinator" },
  { value: "essay_lead", label: "Essay Lead" },
  { value: "volunteer_lead", label: "Volunteer Lead" },
  { value: "viewer", label: "Viewer" },
  { value: "admin", label: "Admin" },
];

export default function StaffInviteBox() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submitInvite(event) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/staff-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save staff invite.");
      }

      setEmail("");
      setRole("viewer");
      setNote("");
      setMessage("Invite saved. When this person logs in, the role will apply automatically.");
      router.refresh();
    } catch (error) {
      console.error("Staff invite error:", error);
      setMessage(error.message || "Could not save staff invite.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={submitInvite}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
          Pending staff invite
        </p>

        <h2 className="mt-3 text-2xl font-black text-slate-950">
          Assign a role before the person logs in.
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          Enter the staff member’s email and role. After they log in through the
          normal magic-link flow, their profile will be created and the role will
          be applied automatically.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="person@example.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Role
          </span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Internal note
          </span>
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save pending invite"}
        </button>

        {message && (
          <p className="text-sm font-semibold text-slate-600">{message}</p>
        )}
      </div>
    </form>
  );
}