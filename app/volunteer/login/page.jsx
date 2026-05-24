"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

export default function VolunteerLoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function signInWithMagicLink(event) {
    event.preventDefault();
    setMessage("");
    setIsSending(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/volunteer`,
        },
      });

      if (error) {
        throw error;
      }

      setMessage("Check your email for the volunteer login link.");
    } catch (error) {
      console.error("Volunteer login error:", error);
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-950">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
          SafePath Scholars
        </p>

        <h1 className="mt-4 text-3xl font-black tracking-tight">
          Volunteer Login
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          This portal is for approved SafePath Scholars volunteers. Use the same
          email address you submitted in your volunteer application.
        </p>

        <form onSubmit={signInWithMagicLink} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">
              Email address
            </span>

            <input
              type="email"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send volunteer login link"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            {message}
          </p>
        )}

        <div className="mt-6 border-t border-slate-200 pt-5">
          <a
            href="/"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            Back to SafePath Scholars website
          </a>
        </div>
      </div>
    </main>
  );
}