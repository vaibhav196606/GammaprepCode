import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function assertAdmin(): Promise<boolean> {
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

export async function PATCH(
  req: Request,
  { params }: { params: { promoId: string } }
) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const body = await req.json();

  const { error } = await serviceSupabase
    .from("promo_codes")
    .update({ is_active: body.is_active })
    .eq("id", params.promoId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { promoId: string } }
) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const { error } = await serviceSupabase
    .from("promo_codes")
    .delete()
    .eq("id", params.promoId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
