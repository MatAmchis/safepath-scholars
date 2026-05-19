import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to access this file." },
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
      { error: "Admin access is required to access this file." },
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

  const filePath = String(body?.filePath || "").trim();

  if (!filePath) {
    return NextResponse.json(
      { error: "Missing file path." },
      { status: 400 }
    );
  }

  if (!filePath.startsWith("essay-submissions/")) {
    return NextResponse.json(
      { error: "Invalid essay file path." },
      { status: 400 }
    );
  }

  const { data: essayRecord, error: essayError } = await supabase
    .from("essay_submissions")
    .select("id, file_path")
    .eq("file_path", filePath)
    .maybeSingle();

  if (essayError) {
    return NextResponse.json(
      { error: essayError.message },
      { status: 500 }
    );
  }

  if (!essayRecord) {
    return NextResponse.json(
      { error: "No essay submission record found for this file." },
      { status: 404 }
    );
  }

  const { data, error } = await supabase.storage
    .from("essay-drafts")
    .createSignedUrl(filePath, 60);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    expiresInSeconds: 60,
  });
}