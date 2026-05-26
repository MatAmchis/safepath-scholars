import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { isAnyAdminRole, normalizeRole } from "./adminPermissions";

export async function getAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  const isAdmin = isAnyAdminRole(role);

  return {
    supabase,
    user,
    profile: profile || {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "",
      role: "",
    },
    role,
    isAdmin,
  };
}