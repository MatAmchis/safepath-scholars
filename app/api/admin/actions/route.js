import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

const STUDENT_STATUSES = [
  "needs_review",
  "needs_match",
  "active",
  "paused",
  "completed",
  "closed",
];

const VOLUNTEER_STATUSES = [
  "screening",
  "approved",
  "waitlisted",
  "rejected",
  "paused",
  "inactive",
];

export async function POST(request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const action = String(body?.action || "");

  try {
    if (action === "updateStudentStatus") {
      const id = String(body?.id || "");
      const status = String(body?.status || "");

      if (!id || !STUDENT_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Invalid student status update." },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("students")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({ ok: true });
    }

    if (action === "updateVolunteerStatus") {
      const id = String(body?.id || "");
      const status = String(body?.status || "");

      if (!id || !VOLUNTEER_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Invalid volunteer status update." },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("volunteers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({ ok: true });
    }

    if (action === "assignEssayReviewer") {
      const essayId = String(body?.essayId || "");
      const volunteerId = String(body?.volunteerId || "");

      if (!essayId) {
        return NextResponse.json(
          { error: "Missing essay ID." },
          { status: 400 }
        );
      }

      const updatePayload = volunteerId
        ? {
            assigned_volunteer_id: volunteerId,
            status: "assigned",
          }
        : {
            assigned_volunteer_id: null,
            status: "submitted",
          };

      const { error } = await supabase
        .from("essay_submissions")
        .update(updatePayload)
        .eq("id", essayId);

      if (error) throw error;

      return NextResponse.json({ ok: true });
    }

    if (action === "createMatch") {
      const studentId = String(body?.studentId || "");
      const volunteerId = String(body?.volunteerId || "");
      const serviceTrack = String(body?.serviceTrack || "").trim();

      if (!studentId || !volunteerId || !serviceTrack) {
        return NextResponse.json(
          { error: "Student, volunteer, and service track are required." },
          { status: 400 }
        );
      }

      const { error: matchError } = await supabase.from("matches").insert({
        student_id: studentId,
        volunteer_id: volunteerId,
        service_track: serviceTrack,
        status: "active",
      });

      if (matchError) throw matchError;

      const { error: studentError } = await supabase
        .from("students")
        .update({ status: "active" })
        .eq("id", studentId);

      if (studentError) throw studentError;

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Unknown admin action." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Admin action failed." },
      { status: 500 }
    );
  }
}