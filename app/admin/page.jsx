import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import EssayDownloadButton from "./EssayDownloadButton";
import LogoutButton from "./LogoutButton";
import {
  AdminStatusSelect,
  AdminPrioritySelect,
  AdminNotesBox,
  EssayReviewerSelect,
  CreateMatchBox,
} from "./AdminActionControls";
import {
  LogSessionBox,
  ApplicationOutcomeBox,
} from "./SessionOutcomeControls";

const STUDENT_STATUS_OPTIONS = [
  { value: "needs_review", label: "Needs review" },
  { value: "needs_match", label: "Needs match" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

const VOLUNTEER_STATUS_OPTIONS = [
  { value: "screening", label: "Screening" },
  { value: "approved", label: "Approved" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "paused", label: "Paused" },
  { value: "inactive", label: "Inactive" },
];
const ESSAY_STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "assigned", label: "Assigned" },
  { value: "in_review", label: "In review" },
  { value: "feedback_returned", label: "Feedback returned" },
  { value: "closed", label: "Closed" },
];

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

function DataTable({ title, headers, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-3 font-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-6 text-slate-500"
                  colSpan={headers.length}
                >
                  No records yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${index}-${cellIndex}`}
                      className="max-w-[320px] px-5 py-4 align-top text-slate-700"
                    >
                      {cell || "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-700">
            Access restricted
          </p>

          <h1 className="mt-4 text-3xl font-black">Admin access required</h1>

          <p className="mt-4 leading-7 text-slate-600">
            You are logged in, but this account has not been assigned the admin
            role yet.
          </p>

          <p className="mt-4 rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
            Current email: {user.email}
          </p>
        </div>
      </main>
    );
  }

  const [
    studentsResult,
    volunteersResult,
    essaysResult,
    contactsResult,
    feedbackResult,
    matchesResult,
    sessionsResult,
    applicationsResult,
  ] = await Promise.all([
    supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("essay_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("matches")
      .select("*, students(full_name, email), volunteers(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("sessions")
      .select(
        "*, students(full_name), volunteers(full_name), matches(service_track)"
      )
      .order("session_date", { ascending: false })
      .limit(50),

    supabase
      .from("applications")
      .select("*, students(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const students = studentsResult.data || [];
  const volunteers = volunteersResult.data || [];
  const essays = essaysResult.data || [];
  const contacts = contactsResult.data || [];
  const feedback = feedbackResult.data || [];
  const matches = matchesResult.data || [];
  const sessions = sessionsResult.data || [];
  const applications = applicationsResult.data || [];

  const activeMatches = matches.filter((match) => match.status === "active");
  const serviceHours = (
    sessions.reduce(
      (sum, item) => sum + Number(item.duration_minutes || 0),
      0
    ) / 60
  ).toFixed(1);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              SafePath Scholars
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-slate-600">
              Welcome, {profile.full_name || profile.email || user.email}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100"
            >
              Back to website
            </a>

            <LogoutButton />
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Student intakes" value={students.length} />
          <MetricCard label="Volunteer applications" value={volunteers.length} />
          <MetricCard label="Essay submissions" value={essays.length} />
          <MetricCard label="Contact messages" value={contacts.length} />
          <MetricCard label="Feedback records" value={feedback.length} />
          <MetricCard label="Active matches" value={activeMatches.length} />
          <MetricCard label="Sessions logged" value={sessions.length} />
          <MetricCard label="Service hours" value={serviceHours} />
        </section>

        <section className="mt-10 grid gap-8">
          <CreateMatchBox students={students} volunteers={volunteers} />

          <LogSessionBox matches={matches} />

          <ApplicationOutcomeBox students={students} />

          <DataTable
            title="Recent Student Intakes"
            headers={[
              "Name",
              "Email",
              "Location",
              "Needs",
              "Status",
              "Priority",
              "Internal Notes",
            ]}
            rows={students.map((student) => [
              student.full_name,
              student.email,
              student.current_location,
              student.support_needs?.join(", "),
              <AdminStatusSelect
                key={`status-${student.id}`}
                action="updateStudentStatus"
                id={student.id}
                value={student.status}
                options={STUDENT_STATUS_OPTIONS}
              />,
              <AdminPrioritySelect
                key={`priority-${student.id}`}
                id={student.id}
                value={student.priority}
              />,
              <AdminNotesBox
                key={`notes-${student.id}`}
                action="updateStudentNotes"
                id={student.id}
                value={student.admin_notes}
                placeholder="Internal notes, triage, follow-up, urgency, risk flags."
              />,
            ])}
          />

          <DataTable
            title="Active Matches"
            headers={["Student", "Volunteer", "Track", "Status", "Start Date"]}
            rows={matches.map((match) => [
              match.students?.full_name,
              match.volunteers?.full_name,
              match.service_track,
              match.status,
              match.start_date,
            ])}
          />

          <DataTable
            title="Recent Sessions"
            headers={[
              "Date",
              "Student",
              "Volunteer",
              "Type",
              "Minutes",
              "Next Steps",
            ]}
            rows={sessions.map((session) => [
              session.session_date,
              session.students?.full_name,
              session.volunteers?.full_name,
              session.service_type,
              session.duration_minutes,
              session.next_steps,
            ])}
          />

          <DataTable
            title="Applications and Outcomes"
            headers={[
              "Student",
              "Program",
              "Type",
              "Deadline",
              "Submitted",
              "Outcome",
            ]}
            rows={applications.map((application) => [
              application.students?.full_name,
              application.institution_or_program,
              application.application_type,
              application.deadline,
              application.submitted ? "Yes" : "No",
              application.outcome,
            ])}
          />

          <DataTable
            title="Recent Volunteer Applications"
            headers={[
              "Name",
              "Email",
              "School",
              "Skills",
              "Status",
              "Internal Notes",
            ]}
            rows={volunteers.map((volunteer) => [
              volunteer.full_name,
              volunteer.email,
              volunteer.school,
              volunteer.skills?.join(", "),
              <AdminStatusSelect
                key={`status-${volunteer.id}`}
                action="updateVolunteerStatus"
                id={volunteer.id}
                value={volunteer.status}
                options={VOLUNTEER_STATUS_OPTIONS}
              />,
              <AdminNotesBox
                key={`notes-${volunteer.id}`}
                action="updateVolunteerNotes"
                id={volunteer.id}
                value={volunteer.admin_notes}
                placeholder="Screening notes, strengths, concerns, assignment ideas."
              />,
            ])}
          />

          <DataTable
            title="Recent Essay Submissions"
            headers={[
              "Student",
              "Email",
              "Type",
              "Deadline",
              "File",
              "Reviewer",
              "Status",
              "Internal Notes",
            ]}
            rows={essays.map((essay) => [
              essay.student_name,
              essay.student_email,
              essay.document_type,
              essay.deadline,
              <EssayDownloadButton
                key={`download-${essay.id}`}
                filePath={essay.file_path}
                driveLink={essay.drive_link}
              />,
              <EssayReviewerSelect
                key={`reviewer-${essay.id}`}
                essayId={essay.id}
                currentVolunteerId={essay.assigned_volunteer_id}
                volunteers={volunteers}
              />,
              <AdminStatusSelect
                key={`status-${essay.id}`}
                action="updateEssayStatus"
                id={essay.id}
                value={essay.status}
                options={ESSAY_STATUS_OPTIONS}
              />,
              <AdminNotesBox
                key={`notes-${essay.id}`}
                action="updateEssayNotes"
                id={essay.id}
                value={essay.admin_notes}
                placeholder="Reviewer notes, assignment notes, quality concerns, next action."
              />,
            ])}
          />

          <DataTable
            title="Recent Contact Messages"
            headers={["Name", "Email", "Type", "Status"]}
            rows={contacts.map((message) => [
              message.name,
              message.email,
              message.inquiry_type,
              message.status,
            ])}
          />

          <DataTable
            title="Recent Feedback"
            headers={["Type", "Email", "Services", "Helpful", "Concern"]}
            rows={feedback.map((item) => [
              item.respondent_type,
              item.email,
              item.service_used?.join(", "),
              item.rating_helpfulness,
              item.concern_reported ? "Yes" : "No",
            ])}
          />
        </section>
      </div>
    </main>
  );
}