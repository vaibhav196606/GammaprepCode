import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (typeof body.completed !== "boolean") {
    return NextResponse.json(
      { error: "completed (boolean) is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("sprint_checklist_items")
    .update({
      completed: body.completed,
      completed_at: body.completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.itemId)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
