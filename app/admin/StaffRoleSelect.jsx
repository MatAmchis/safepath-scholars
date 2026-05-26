"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const roleOptions = [
  { value: "", label: "No role" },
  { value: "admin", label: "Admin" },
  { value: "coordinator", label: "Coordinator" },
  { value: "essay_lead", label: "Essay Lead" },
  { value: "volunteer_lead", label: "Volunteer Lead" },
  { value: "viewer", label: "Viewer" },
];

export default function StaffRoleSelect({
  profileId,
  currentRole,
  email,
  isCurrentUser,
}) {
  const router = useRouter();

  const [role, setRole] = useState(currentRole || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveRole() {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update role.");
      }

      setMessage("Saved.");
      router.refresh();
    } catch (error) {
      console.error("Role update error:", error);
      setMessage(error.message || "Could not update role.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-w-[240px] space-y-2">
      <select
        value={role}
        onChange={(event) => setRole(event.target.value)}
        disabled={isSaving}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        {roleOptions.map((option) => (
          <option key={option.value || "none"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={saveRole}
        disabled={isSaving}
        className="w-full rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save role"}
      </button>

      {isCurrentUser && (
        <p className="text-xs font-semibold text-amber-700">
          This is your current account. You cannot remove your own admin role.
        </p>
      )}

      {message && (
        <p className="text-xs font-semibold text-slate-600">{message}</p>
      )}

      <p className="text-xs text-slate-400">{email}</p>
    </div>
  );
}