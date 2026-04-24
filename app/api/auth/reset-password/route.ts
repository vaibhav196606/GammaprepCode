import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = (body.email as string)?.toLowerCase().trim();
  const otp = (body.otp as string)?.trim();
  const password = body.password as string;

  if (!email || !otp || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Re-verify OTP before resetting
  const { data: otpRow, error: otpError } = await supabase
    .from("password_reset_otps")
    .select("otp, expires_at")
    .eq("email", email)
    .single();

  if (otpError || !otpRow) {
    return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
  }

  if (new Date(otpRow.expires_at) < new Date()) {
    return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
  }

  if (otpRow.otp !== otp) {
    return NextResponse.json({ error: "Incorrect OTP." }, { status: 400 });
  }

  // Find the user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });

  if (listError) {
    console.error("listUsers error:", listError);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }

  const user = users.find((u) => u.email?.toLowerCase() === email);

  if (!user) {
    return NextResponse.json({ error: "No account found with this email address." }, { status: 404 });
  }

  // Update the password
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
  });

  if (updateError) {
    console.error("updateUserById error:", updateError);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }

  // Invalidate OTP after successful reset
  await supabase.from("password_reset_otps").delete().eq("email", email);

  return NextResponse.json({ success: true });
}
