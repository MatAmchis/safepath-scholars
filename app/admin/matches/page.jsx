import { getAdmin } from "../adminHelpers";
import { AccessRestricted, AdminPageShell, DataTable } from "../AdminChrome";
import { CreateMatchBox } from "../AdminActionControls";

export default async function MatchesAdminPage() {
  const { supabase, user, profile, isAdmin } = await getAdmin();

  if (!isAdmin) {
    return <AccessRestricted user={user} />;
  }

  const [studentsResult, volunteersResult, matchesResult] = await Promise.all([
    supabase.from("students").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("volunteers").select("*").order("created_at", { ascending: false }).limit(100),
    supabase
      .from("matches")
      .select("*, students(full_name, email), volunteers(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const students = studentsResult.data || [];
  const volunteers = volunteersResult.data || [];
  const matches = matchesResult.data || [];

  return (
    <AdminPageShell
      title="Matches"
      subtitle="Create and review student-volunteer matches."
      profile={profile}
      user={user}
      current="/admin/matches"
    >
      <section className="grid gap-8">
        <CreateMatchBox students={students} volunteers={volunteers} />

        <DataTable
          title="Matches"
          headers={["Student", "Volunteer", "Track", "Status", "Start Date"]}
          rows={matches.map((match) => [
            match.students?.full_name,
            match.volunteers?.full_name,
            match.service_track,
            match.status,
            match.start_date,
          ])}
        />
      </section>
    </AdminPageShell>
  );
}