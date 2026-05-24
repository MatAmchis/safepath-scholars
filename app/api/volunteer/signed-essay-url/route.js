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
    const filePath = body?.filePath;

    if (!filePath || typeof filePath !== "string") {
      return NextResponse.json(
        { error: "Missing essay file path." },
        { status: 400 }
      );
    }

    if (!filePath.startsWith("essay-submissions/")) {
      return NextResponse.json(
        { error: "Invalid essay file path." },
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

    const { data: essay, error: essayError } = await supabase
      .from("essay_submissions")
      .select("id, file_path, assigned_volunteer_id")
      .eq("file_path", filePath)
      .eq("assigned_volunteer_id", volunteer.id)
      .maybeSingle();

    if (essayError || !essay) {
      return NextResponse.json(
        { error: "Essay not found or not assigned to this volunteer." },
        { status: 403 }
      );
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("essay-drafts")
        .createSignedUrl(filePath, 60);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      return NextResponse.json(
        { error: signedUrlError?.message || "Could not create download link." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: signedUrlData.signedUrl });
  } catch (error) {
    console.error("Volunteer signed essay URL error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}