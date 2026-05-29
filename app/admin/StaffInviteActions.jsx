"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StaffInviteActions({ inviteId, email, acceptedAt }) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteInvite() {
    const label = acceptedAt ? "remove this invite record" : "cancel this pending invite";

    const confirmed = window.confirm(
      `Are you sure you want to ${label} for ${email}?`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/staff-invites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete invite.");
      }

      setMessage("Removed.");
      router.refresh();
    } catch (error) {
      console.error("Delete staff invite error:", error);
      setMessage(error.message || "Could not delete invite.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-w-[160px] space-y-2">
      <button
        type="button"
        onClick={deleteInvite}
        disabled={isDeleting}
        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-black text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting
          ? "Removing..."
          : acceptedAt
            ? "Remove record"
            : "Cancel invite"}
      </button>

      {message && (
        <p className="text-xs font-semibold text-slate-500">{message}</p>
      )}
    </div>
  );
}