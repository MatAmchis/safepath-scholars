import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();

    if (body?.action !== "log_session") {
      return NextResponse.json(
        { error: "Unsupported volunteer action." },
        { status: 400 }
      );
    }

    const matchId = body?.matchId;
    const serviceType = String(body?.serviceType || "").trim();
    const sessionDate = String(body?.sessionDate || "").trim();
    const durationMinutes = Number(body?.durationMinutes);
    const notes = String(body?.notes || "").trim();
    const nextSteps = String(body?.nextSteps || "").trim();

    if (!matchId) {
      return NextResponse.json(
        { error: "Missing student match." },
        { status: 400 }
      );
    }

    if (!serviceType) {
      return NextResponse.json(
        { error: "Missing service type." },
        { status: 400 }
      );
    }

    if (!sessionDate) {
      return NextResponse.json(
        { error: "Missing session date." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json(
        { error: "Duration must be greater than zero." },
        { status: 400 }
      );
    }

    if (!notes) {
      return NextResponse.json(
        { error: "Session notes are required." },
        { status: 400 }
      );
    }

    const { data: volunteer, error: volunteerError } = await supabase
      .from("volunteers")
      .select("id, email, status")
      .ilike("email", user.email)
      .maybeSingle();

    if (volunteerError || !volunteer || volunteer.status !== "approved") {
      return NextResponse.json(
        { error: "Approved volunteer access required." },
        { status: 403 }
      );
    }

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("id, student_id, volunteer_id, status")
      .eq("id", matchId)
      .eq("volunteer_id", volunteer.id)
      .maybeSingle();

    if (matchError || !match) {
      return NextResponse.json(
        { error: "Match not found for this volunteer." },
        { status: 403 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        match_id: match.id,
        student_id: match.student_id,
        volunteer_id: volunteer.id,
        session_date: sessionDate,
        duration_minutes: Math.round(durationMinutes),
        service_type: serviceType,
        notes,
        next_steps: nextSteps || null,
      })
      .select("id")
      .single();

    if (sessionError) {
      return NextResponse.json(
        { error: sessionError.message || "Could not log session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Volunteer action error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}