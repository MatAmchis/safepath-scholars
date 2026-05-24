import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function getVolunteerAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/volunteer/login");
  }

  const { data: volunteer, error } = await supabase
    .from("volunteers")
    .select("*")
    .ilike("email", user.email)
    .maybeSingle();

  const isApprovedVolunteer = !error && volunteer?.status === "approved";

  return {
    supabase,
    user,
    volunteer,
    isApprovedVolunteer,
  };
}