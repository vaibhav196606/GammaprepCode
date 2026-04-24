import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  return profile?.is_admin ? supabase : null;
}

export async function POST(req: Request) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const body = await req.json();

  const { data: session, error } = await serviceSupabase
    .from("sprint_sessions")
    .insert({
      title: body.title,
      session_type: body.session_type,
      scheduled_at: body.scheduled_at,
      meeting_link: body.meeting_link ?? null,
      recording_url: body.recording_url ?? null,
      is_published: body.is_published ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session });
}
