import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function getSafeNextPath(next) {
  if (!next || typeof next !== "string") {
    return "/admin";
  }

  if (!next.startsWith("/")) {
    return "/admin";
  }

  if (next.startsWith("//")) {
    return "/admin";
  }

  return next;
}

function getUserFullName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    ""
  );
}

async function ensureProfileExistsFallback(supabase, user) {
  if (!user?.id || !user?.email) {
    return;
  }

  const fullName = getUserFullName(user);

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("Could not check profile after login:", selectError);
    return;
  }

  if (!existingProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      role: null,
    });

    if (insertError) {
      console.error("Could not create profile after login:", insertError);
    }

    return;
  }

  const updates = {
    email: user.email,
  };

  if (!existingProfile.full_name && fullName) {
    updates.full_name = fullName;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (updateError) {
    console.error("Could not update profile after login:", updateError);
  }
}

async function syncProfileAndClaimInvite(supabase, user) {
  if (!user?.id || !user?.email) {
    return;
  }

  const fullName = getUserFullName(user);

  const { error } = await supabase.rpc("claim_pending_staff_invite", {
    full_name_input: fullName,
  });

  if (!error) {
    return;
  }

  console.error("Could not claim pending staff invite:", error);

  await ensureProfileExistsFallback(supabase, user);
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Could not load user after login:", userError);
  }

  if (user) {
    await syncProfileAndClaimInvite(supabase, user);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}