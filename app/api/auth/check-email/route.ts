import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ exists: false });
  }

  const supabase = createServiceClient();
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const exists = users.some(
    (u) => u.email?.toLowerCase() === (email as string).toLowerCase()
  );

  return NextResponse.json({ exists });
}
