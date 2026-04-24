import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Gammaprep <info@gammaprep.com>";

export async function sendEnrollmentEmail({
  to,
  name,
  productName,
  orderId,
  amount,
}: {
  to: string;
  name: string;
  productName: string;
  orderId: string;
  amount: number;
}) {
  const dashboardPath: Record<string, string> = {
    "Career Audit": "/dashboard/career-audit",
    "Interview Sprint": "/dashboard/interview-sprint",
    "Placement Mentorship": "/dashboard/placement-mentorship",
  };

  const nextStep: Record<string, string> = {
    "Career Audit":
      "Head to your dashboard to upload your resume and LinkedIn URL. You'll receive your audit report within 24–48 hours.",
    "Interview Sprint":
      "Head to your dashboard to see your session schedule, prep plan, and resources. Your sprint starts now!",
    "Placement Mentorship":
      "Our team will reach out within 24 hours to schedule your first weekly call. Check your dashboard for updates.",
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";
  const dashboardUrl = `${appUrl}${dashboardPath[productName] ?? "/dashboard"}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're enrolled in ${productName}! 🎉`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Welcome, ${name}!</h2>
        <p style="color: #555; margin-bottom: 24px;">
          You're officially enrolled in <strong>${productName}</strong>. Here's your confirmation.
        </p>

        <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #555;">Order ID</span>
            <span style="font-weight: 600;">${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #555;">Product</span>
            <span style="font-weight: 600;">${productName}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #555;">Amount paid</span>
            <span style="font-weight: 600;">₹${amount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <p style="margin-bottom: 24px;"><strong>What's next?</strong><br/>${nextStep[productName] ?? "Head to your dashboard to get started."}</p>

        <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Go to Dashboard →
        </a>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or WhatsApp us at +91 88902 40404.
        </p>
      </div>
    `,
  });
}

export async function sendAuditReportEmail({
  to,
  name,
  reportUrl,
}: {
  to: string;
  name: string;
  reportUrl: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Career Audit Report is Ready! 📄",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Hi ${name}, your audit is ready!</h2>
        <p style="color: #555; margin-bottom: 24px;">
          Our expert has completed your Career Audit. Your report includes your profile score,
          top gaps, and a 7-day action plan.
        </p>

        <a href="${appUrl}/dashboard/career-audit" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
          View My Report →
        </a>

        <p style="color: #555; margin-bottom: 16px;">
          After reading your report, if you want expert help <strong>fixing</strong> these gaps fast -
          the Interview Sprint is designed for exactly that. Many students who start with the Audit
          see results 2x faster when they follow up with the Sprint.
        </p>

        <a href="${appUrl}/products/interview-sprint" style="display: inline-block; border: 2px solid #4f46e5; color: #4f46e5; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Learn about Interview Sprint →
        </a>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or WhatsApp us at +91 88902 40404.
        </p>
      </div>
    `,
  });
}

export async function sendAdminAuditNotification({
  userName,
  userEmail,
  auditId,
}: {
  userName: string;
  userEmail: string;
  auditId: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

  await resend.emails.send({
    from: FROM,
    to: "info@gammaprep.com",
    subject: `New Career Audit submission - ${userName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h2>New Audit Submission</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <a href="${appUrl}/admin/career-audits/${auditId}"
           style="display: inline-block; background: #111; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Review in Admin Panel →
        </a>
      </div>
    `,
  });
}

export async function sendAdminCallRequestNotification({
  userName,
  userEmail,
  auditId,
}: {
  userName: string;
  userEmail: string;
  auditId: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

  await resend.emails.send({
    from: FROM,
    to: "info@gammaprep.com",
    subject: `New mentor call request - ${userName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h2>New Mentor Call Request</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p>This student has submitted preferred time slots for a 1:1 strategy call. Review the request and confirm a slot with the meeting link.</p>
        <a href="${appUrl}/admin/career-audits/${auditId}"
           style="display: inline-block; background: #111; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Review in Admin Panel →
        </a>
      </div>
    `,
  });
}

export async function sendCallConfirmedEmail({
  to,
  name,
  confirmedSlot,
  meetingLink,
}: {
  to: string;
  name: string;
  confirmedSlot: string;
  meetingLink: string;
}) {
  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(confirmedSlot));

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your mentor call is confirmed! 📅",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Hi ${name}, your call is booked!</h2>
        <p style="color: #555; margin-bottom: 24px;">
          Your 1:1 Career Strategy Call with your Gammaprep mentor has been confirmed.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 15px; color: #166534;">
            <strong>📅 Confirmed Time (IST)</strong><br/>
            ${formattedTime}
          </p>
        </div>

        <a href="${meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
          Join Call →
        </a>

        <p style="color: #555; font-size: 14px; margin-bottom: 8px;">
          Add this to your calendar and join 5 minutes early to test your audio and video.
        </p>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or WhatsApp us at +91 88902 40404.
        </p>
      </div>
    `,
  });
}
