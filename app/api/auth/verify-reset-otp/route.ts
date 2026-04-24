import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = (body.email as string)?.toLowerCase().trim();
  const otp = (body.otp as string)?.trim();

  if (!email || !otp) {
    return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("password_reset_otps")
    .select("otp, expires_at")
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
  }

  if (data.otp !== otp) {
    return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
