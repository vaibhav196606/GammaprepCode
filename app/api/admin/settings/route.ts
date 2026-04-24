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

  const upserts = Object.entries(body)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) => ({ key, value }));

  for (const { key, value } of upserts) {
    await serviceSupabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
  }

  return NextResponse.json({ success: true });
}
