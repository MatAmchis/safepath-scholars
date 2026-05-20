"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSigningOut ? "Signing out..." : "Logout"}
    </button>
  );
}