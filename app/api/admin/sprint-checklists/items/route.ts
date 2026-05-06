import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  return !!profile?.is_admin;
}

export async function POST(req: Request) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const day = Number(body.day_number);
  if (!Number.isInteger(day) || day < 1 || day > 21) {
    return NextResponse.json(
      { error: "day_number must be an integer between 1 and 21" },
      { status: 400 }
    );
  }
  if (!body.enrollment_id || !body.user_id || !body.title?.trim()) {
    return NextResponse.json(
      { error: "enrollment_id, user_id, and title are required" },
      { status: 400 }
    );
  }

  const serviceSupabase = createServiceClient();
  const { data: item, error } = await serviceSupabase
    .from("sprint_checklist_items")
    .insert({
      enrollment_id: body.enrollment_id,
      user_id: body.user_id,
      day_number: day,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      sort_order: Number.isInteger(body.sort_order) ? body.sort_order : 0,
    })
    .select("id, day_number, title, description, sort_order, completed")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item });
}
