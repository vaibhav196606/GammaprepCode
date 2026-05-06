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

export async function PUT(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.title !== undefined) {
    if (!String(body.title).trim()) {
      return NextResponse.json({ error: "title cannot be empty" }, { status: 400 });
    }
    update.title = String(body.title).trim();
  }
  if (body.description !== undefined) {
    update.description =
      body.description === null ? null : String(body.description).trim() || null;
  }
  if (body.day_number !== undefined) {
    const day = Number(body.day_number);
    if (!Number.isInteger(day) || day < 1 || day > 21) {
      return NextResponse.json(
        { error: "day_number must be 1-21" },
        { status: 400 }
      );
    }
    update.day_number = day;
  }
  if (body.sort_order !== undefined && Number.isInteger(body.sort_order)) {
    update.sort_order = body.sort_order;
  }

  const serviceSupabase = createServiceClient();
  const { error } = await serviceSupabase
    .from("sprint_checklist_items")
    .update(update)
    .eq("id", params.itemId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { itemId: string } }
) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const { error } = await serviceSupabase
    .from("sprint_checklist_items")
    .delete()
    .eq("id", params.itemId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
