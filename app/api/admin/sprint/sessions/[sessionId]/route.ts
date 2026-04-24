import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  return !!profile?.is_admin;
}

export async function PUT(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const body = await req.json();

  const { error } = await serviceSupabase
    .from("sprint_sessions")
    .update({
      title: body.title,
      session_type: body.session_type,
      scheduled_at: body.scheduled_at,
      meeting_link: body.meeting_link ?? null,
      recording_url: body.recording_url ?? null,
      is_published: body.is_published,
    })
    .eq("id", params.sessionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { sessionId: string } }
) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const { error } = await serviceSupabase
    .from("sprint_sessions")
    .delete()
    .eq("id", params.sessionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
