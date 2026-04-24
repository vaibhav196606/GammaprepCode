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

export async function POST(req: Request) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceSupabase = createServiceClient();
  const body = await req.json();

  const { data: promoCode, error } = await serviceSupabase
    .from("promo_codes")
    .insert({
      code: body.code,
      discount_pct: body.discount_pct,
      max_uses: body.max_uses ?? null,
      valid_from: body.valid_from ?? null,
      valid_until: body.valid_until ?? null,
      product_id: body.product_id ?? null,
      is_active: body.is_active ?? true,
      used_count: 0,
    })
    .select("*, products(slug, name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ promoCode });
}
