import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { canPerformAdminAction } from "../../../admin/adminPermissions";

export const dynamic = "force-dynamic";

async function getAdminContext(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      role: "",
      error: "Not authenticated.",
      status: 401,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      user,
      profile: null,
      role: "",
      error: "Admin profile not found.",
      status: 403,
    };
  }

  return {
    user,
    profile,
    role: profile.role || "",
    error: null,
    status: 200,
  };
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function dateOrNull(value) {
  const text = cleanString(value);
  return text || null;
}

function getFirstValue(body, keys) {
  for (const key of keys) {
    if (body?.[key] !== undefined && body?.[key] !== null) {
      return body[key];
    }
  }

  return "";
}

async function updateStudentStatus(supabase, body) {
  const id = getFirstValue(body, ["id", "studentId"]);
  const value = cleanString(getFirstValue(body, ["value", "status"]));

  if (!id || !value) {
    return NextResponse.json(
      { error: "Missing student id or status." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("students")
    .update({ status: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function updateStudentPriority(supabase, body) {
  const id = getFirstValue(body, ["id", "studentId"]);
  const value = cleanString(getFirstValue(body, ["value", "priority"]));

  if (!id || !value) {
    return NextResponse.json(
      { error: "Missing student id or priority." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("students")
    .update({ priority: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function updateStudentNotes(supabase, body) {
  const id = getFirstValue(body, ["id", "studentId"]);
  const value = cleanString(getFirstValue(body, ["value", "notes", "adminNotes"]));

  if (!id) {
    return NextResponse.json(
      { error: "Missing student id." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("students")
    .update({ admin_notes: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function updateVolunteerStatus(supabase, body) {
  const id = getFirstValue(body, ["id", "volunteerId"]);
  const value = cleanString(getFirstValue(body, ["value", "status"]));

  if (!id || !value) {
    return NextResponse.json(
      { error: "Missing volunteer id or status." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("volunteers")
    .update({ status: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function updateVolunteerNotes(supabase, body) {
  const id = getFirstValue(body, ["id", "volunteerId"]);
  const value = cleanString(getFirstValue(body, ["value", "notes", "adminNotes"]));

  if (!id) {
    return NextResponse.json(
      { error: "Missing volunteer id." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("volunteers")
    .update({ admin_notes: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function assignEssayReviewer(supabase, body) {
  const essayId = getFirstValue(body, ["essayId", "id"]);
  const volunteerId = cleanString(
    getFirstValue(body, ["volunteerId", "assignedVolunteerId", "value"])
  );

  if (!essayId) {
    return NextResponse.json(
      { error: "Missing essay id." },
      { status: 400 }
    );
  }

  const update = {
    assigned_volunteer_id: volunteerId || null,
    status: volunteerId ? "assigned" : "submitted",
  };

  const { error } = await supabase
    .from("essay_submissions")
    .update(update)
    .eq("id", essayId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function updateEssayStatus(supabase, body) {
  const id = getFirstValue(body, ["id", "essayId"]);
  const value = cleanString(getFirstValue(body, ["value", "status"]));

  if (!id || !value) {
    return NextResponse.json(
      { error: "Missing essay id or status." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("essay_submissions")
    .update({ status: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function updateEssayNotes(supabase, body) {
  const id = getFirstValue(body, ["id", "essayId"]);
  const value = cleanString(getFirstValue(body, ["value", "notes", "adminNotes"]));

  if (!id) {
    return NextResponse.json(
      { error: "Missing essay id." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("essay_submissions")
    .update({ admin_notes: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function createMatch(supabase, body) {
  const studentId = getFirstValue(body, ["studentId", "student_id"]);
  const volunteerId = getFirstValue(body, ["volunteerId", "volunteer_id"]);
  const serviceTrack = cleanString(
    getFirstValue(body, ["serviceTrack", "service_track", "track"])
  );
  const startDate = dateOrNull(getFirstValue(body, ["startDate", "start_date"]));
  const notes = cleanString(getFirstValue(body, ["notes", "matchNotes"]));

  if (!studentId || !volunteerId) {
    return NextResponse.json(
      { error: "Missing student or volunteer." },
      { status: 400 }
    );
  }

  const { data: match, error } = await supabase
    .from("matches")
    .insert({
      student_id: studentId,
      volunteer_id: volunteerId,
      service_track: serviceTrack || null,
      start_date: startDate,
      status: "active",
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("students")
    .update({ status: "active" })
    .eq("id", studentId);

  return NextResponse.json({ success: true, matchId: match.id });
}

async function logSession(supabase, body) {
  const matchId = getFirstValue(body, ["matchId", "match_id"]);
  const sessionDate = dateOrNull(getFirstValue(body, ["sessionDate", "session_date"]));
  const serviceType = cleanString(
    getFirstValue(body, ["serviceType", "service_type"])
  );
  const durationMinutes = numberOrNull(
    getFirstValue(body, ["durationMinutes", "duration_minutes"])
  );
  const notes = cleanString(getFirstValue(body, ["notes", "sessionNotes"]));
  const nextSteps = cleanString(getFirstValue(body, ["nextSteps", "next_steps"]));

  if (!matchId) {
    return NextResponse.json(
      { error: "Missing match id." },
      { status: 400 }
    );
  }

  if (!sessionDate || !serviceType || !durationMinutes) {
    return NextResponse.json(
      { error: "Missing session date, service type, or duration." },
      { status: 400 }
    );
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, student_id, volunteer_id")
    .eq("id", matchId)
    .maybeSingle();

  if (matchError || !match) {
    return NextResponse.json(
      { error: "Match not found." },
      { status: 404 }
    );
  }

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      match_id: match.id,
      student_id: match.student_id,
      volunteer_id: match.volunteer_id,
      session_date: sessionDate,
      service_type: serviceType,
      duration_minutes: Math.round(durationMinutes),
      notes: notes || null,
      next_steps: nextSteps || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, sessionId: session.id });
}

async function saveApplicationOutcome(supabase, body) {
  const studentId = getFirstValue(body, ["studentId", "student_id"]);
  const applicationType = cleanString(
    getFirstValue(body, ["applicationType", "application_type"])
  );
  const institutionOrProgram = cleanString(
    getFirstValue(body, [
      "institutionOrProgram",
      "institution_or_program",
      "institution",
      "programName",
      "program_name",
    ])
  );
  const deadline = dateOrNull(getFirstValue(body, ["deadline"]));
  const submittedValue = getFirstValue(body, ["submitted"]);
  const outcome = cleanString(getFirstValue(body, ["outcome"]));
  const notes = cleanString(getFirstValue(body, ["notes", "applicationNotes"]));

  if (!studentId) {
    return NextResponse.json(
      { error: "Missing student id." },
      { status: 400 }
    );
  }

  const submitted =
    submittedValue === true ||
    submittedValue === "true" ||
    submittedValue === "yes" ||
    submittedValue === "on";

  const { data: application, error } = await supabase
    .from("applications")
    .insert({
      student_id: studentId,
      application_type: applicationType || null,
      institution_or_program: institutionOrProgram || null,
      deadline,
      submitted,
      outcome: outcome || null,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, applicationId: application.id });
}

const ACTION_HANDLERS = {
  updateStudentStatus,
  updateStudentPriority,
  updateStudentNotes,
  updateVolunteerStatus,
  updateVolunteerNotes,
  assignEssayReviewer,
  updateEssayStatus,
  updateEssayNotes,
  createMatch,
  logSession,
  saveApplicationOutcome,
};

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const action = cleanString(body?.action);

    if (!action) {
      return NextResponse.json(
        { error: "Missing admin action." },
        { status: 400 }
      );
    }

    const adminContext = await getAdminContext(supabase);

    if (adminContext.error) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    if (!canPerformAdminAction(adminContext.role, action)) {
      return NextResponse.json(
        {
          error: "You do not have permission to perform this admin action.",
          action,
          role: adminContext.role,
        },
        { status: 403 }
      );
    }

    const handler = ACTION_HANDLERS[action];

    if (!handler) {
      return NextResponse.json(
        { error: "Unsupported admin action." },
        { status: 400 }
      );
    }

    return await handler(supabase, body, adminContext);
  } catch (error) {
    console.error("Admin action route error:", error);

    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}