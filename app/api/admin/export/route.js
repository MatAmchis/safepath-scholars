import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const EXPORT_CONFIG = {
  students: {
    table: "students",
    filename: "students.csv",
    defaultColumns: [
      "id",
      "created_at",
      "full_name",
      "email",
      "current_location",
      "support_needs",
      "status",
      "priority",
      "admin_notes",
    ],
  },
  volunteers: {
    table: "volunteers",
    filename: "volunteers.csv",
    defaultColumns: [
      "id",
      "created_at",
      "full_name",
      "email",
      "school",
      "skills",
      "status",
      "admin_notes",
    ],
  },
  essays: {
    table: "essay_submissions",
    filename: "essay_submissions.csv",
    defaultColumns: [
      "id",
      "created_at",
      "student_name",
      "student_email",
      "document_type",
      "deadline",
      "status",
      "assigned_volunteer_id",
      "file_path",
      "admin_notes",
    ],
  },
  matches: {
    table: "matches",
    filename: "matches.csv",
    defaultColumns: [
      "id",
      "created_at",
      "student_id",
      "volunteer_id",
      "service_track",
      "status",
      "notes",
    ],
  },
  sessions: {
    table: "sessions",
    filename: "sessions.csv",
    defaultColumns: [
      "id",
      "created_at",
      "session_date",
      "student_id",
      "volunteer_id",
      "match_id",
      "service_type",
      "duration_minutes",
      "notes",
      "next_steps",
    ],
  },
  applications: {
    table: "applications",
    filename: "applications.csv",
    defaultColumns: [
      "id",
      "created_at",
      "student_id",
      "application_type",
      "institution",
      "program_name",
      "deadline",
      "status",
      "outcome",
      "notes",
    ],
  },
  messages: {
    table: "contact_messages",
    filename: "contact_messages.csv",
    defaultColumns: [
      "id",
      "created_at",
      "name",
      "email",
      "inquiry_type",
      "message",
      "status",
    ],
  },
  feedback: {
    table: "feedback",
    filename: "feedback.csv",
    defaultColumns: [
      "id",
      "created_at",
      "name",
      "email",
      "role",
      "rating",
      "message",
      "status",
    ],
  },
};

function csvEscape(value) {
  if (value === null || value === undefined) {
    return "";
  }

  let text;

  if (Array.isArray(value)) {
    text = value.join("; ");
  } else if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }

  const needsQuotes =
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r");

  const escaped = text.replaceAll('"', '""');

  return needsQuotes ? `"${escaped}"` : escaped;
}

function getColumns(rows, defaultColumns) {
  const seen = new Set();
  const columns = [];

  for (const column of defaultColumns) {
    if (!seen.has(column)) {
      seen.add(column);
      columns.push(column);
    }
  }

  for (const row of rows) {
    for (const column of Object.keys(row || {})) {
      if (!seen.has(column)) {
        seen.add(column);
        columns.push(column);
      }
    }
  }

  return columns;
}

function rowsToCsv(rows, defaultColumns) {
  const columns = getColumns(rows, defaultColumns);

  const header = columns.map(csvEscape).join(",");

  const body = rows
    .map((row) => columns.map((column) => csvEscape(row?.[column])).join(","))
    .join("\n");

  return body ? `${header}\n${body}\n` : `${header}\n`;
}

async function requireAdmin(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    isAdmin: profile?.role === "admin",
  };
}

export async function GET(request) {
  try {
    const supabase = await createClient();

    const { isAdmin } = await requireAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const config = EXPORT_CONFIG[type];

    if (!config) {
      return NextResponse.json(
        { error: "Unsupported export type." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(config.table)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not export data." },
        { status: 500 }
      );
    }

    const csv = rowsToCsv(data || [], config.defaultColumns);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${config.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Admin CSV export error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}