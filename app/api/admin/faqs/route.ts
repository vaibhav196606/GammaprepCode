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

  const { data: faq, error } = await serviceSupabase
    .from("faqs")
    .insert({
      question: body.question,
      answer: body.answer,
      product_id: body.product_id ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .select("*, products(slug, name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ faq });
}
