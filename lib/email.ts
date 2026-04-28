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

        <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3730a3;">
            🎁 Free bonus: Schedule a 1:1 strategy call with your mentor
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #4338ca;">
            Book a free 30-minute live session to walk through your audit findings and build a
            personalised action plan with your mentor. Pick your preferred time slots from your dashboard.
          </p>
          <a href="${appUrl}/dashboard/career-audit" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Schedule My Free Call →
          </a>
        </div>

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

export async function sendApplicationReceivedEmail({
  to,
  name,
  targetRole,
  replyByDate,
}: {
  to: string;
  name: string;
  targetRole: string;
  replyByDate: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Placement Mentorship application is in 👀",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Hi ${name}, we've got your application!</h2>
        <p style="color: #555; margin-bottom: 24px;">
          We read every application personally. You applied for a spot in our <strong>Placement Mentorship</strong>
          program targeting <strong>${targetRole}</strong>.
        </p>

        <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 15px; color: #92400e;">
            <strong>⏳ What's next?</strong><br/>
            Our team will review your application and get back to you by <strong>${replyByDate}</strong>.
            You'll receive an invite email if you're selected.
          </p>
        </div>

        <p style="color: #555; margin-bottom: 24px;">
          In the meantime, feel free to browse your dashboard or explore our other programs.
        </p>

        <a href="${appUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Go to Dashboard →
        </a>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or WhatsApp us at +91 88902 40404.
        </p>
      </div>
    `,
  });
}

export async function sendAdminApplicationNotification({
  userName,
  userEmail,
  applicationId,
  targetRole,
  yearsExperience,
  timeline,
}: {
  userName: string;
  userEmail: string;
  applicationId: string;
  targetRole: string;
  yearsExperience: number;
  timeline: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";
  const timelineLabels: Record<string, string> = {
    immediate: "Immediate",
    "1_to_3_months": "1–3 months",
    "3_to_6_months": "3–6 months",
    exploring: "Just exploring",
  };

  await resend.emails.send({
    from: FROM,
    to: "info@gammaprep.com",
    subject: `New mentorship application — ${userName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h2>New Mentorship Application</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Target role:</strong> ${targetRole}</p>
        <p><strong>Years of experience:</strong> ${yearsExperience}</p>
        <p><strong>Timeline:</strong> ${timelineLabels[timeline] ?? timeline}</p>
        <a href="${appUrl}/admin/mentorship-applications/${applicationId}"
           style="display: inline-block; background: #111; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
          Review Application →
        </a>
      </div>
    `,
  });
}

export async function sendApplicationInviteEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're invited to Placement Mentorship 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Congrats, ${name} — you're in!</h2>
        <p style="color: #555; margin-bottom: 24px;">
          We reviewed your application and we'd love to have you in our <strong>Placement Mentorship</strong> program.
          You've been selected based on your goals and fit.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 15px; color: #166534;">
            <strong>Your invite is ready.</strong><br/>
            Complete your enrollment at <strong>₹14,999</strong> to lock in your spot.
            Seats are limited and this invite is personal to you.
          </p>
        </div>

        <a href="${appUrl}/checkout/placement-mentorship" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
          Complete Enrollment →
        </a>

        <p style="color: #555; font-size: 14px;">
          After enrollment, our team will reach out within 24 hours to schedule your first weekly call.
        </p>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or WhatsApp us at +91 88902 40404.
        </p>
      </div>
    `,
  });
}

export async function sendApplicationRejectedEmail({
  to,
  name,
  adminNotes,
}: {
  to: string;
  name: string;
  adminNotes?: string | null;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "About your Placement Mentorship application",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Hi ${name},</h2>
        <p style="color: #555; margin-bottom: 16px;">
          Thank you for taking the time to apply to our Placement Mentorship program. We genuinely appreciate
          your interest and the effort you put into your application.
        </p>

        <p style="color: #555; margin-bottom: 16px;">
          After careful review, we're not moving forward with your application at this time.
          ${adminNotes ? `<br/><br/><strong>Feedback from our team:</strong> ${adminNotes}` : ""}
        </p>

        <p style="color: #555; margin-bottom: 24px;">
          This isn't a permanent door closing — you're welcome to re-apply in <strong>90 days</strong>
          if your situation changes. In the meantime, our
          <a href="${appUrl}/products/interview-sprint" style="color: #4f46e5;">Interview Sprint</a>
          is a great way to build momentum while you prepare.
        </p>

        <a href="${appUrl}/products/interview-sprint" style="display: inline-block; border: 2px solid #4f46e5; color: #4f46e5; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Explore Interview Sprint →
        </a>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or WhatsApp us at +91 88902 40404.
        </p>
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
