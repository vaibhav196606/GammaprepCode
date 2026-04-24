import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendBrevoEmail } from "@/lib/brevo";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = (body.email as string)?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

  const supabase = createServiceClient();

  const { error: upsertError } = await supabase
    .from("password_reset_otps")
    .upsert({ email, otp, expires_at: expiresAt }, { onConflict: "email" });

  if (upsertError) {
    console.error("OTP upsert error:", upsertError);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }

  try {
    await sendBrevoEmail({
      to: email,
      subject: "Your Gammaprep password reset OTP",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111;">
          <h2 style="margin-bottom:8px;font-size:22px;">Reset your password</h2>
          <p style="color:#555;margin-bottom:24px;">
            Use the OTP below to reset your Gammaprep account password.
            It expires in <strong>10 minutes</strong>.
          </p>
          <div style="font-size:36px;font-weight:800;letter-spacing:14px;text-align:center;
                      padding:24px;background:#f3f4f6;border-radius:12px;font-family:monospace;">
            ${otp}
          </div>
          <p style="color:#999;font-size:13px;margin-top:24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Brevo send error:", err);
    return NextResponse.json({ error: "Failed to send OTP email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
