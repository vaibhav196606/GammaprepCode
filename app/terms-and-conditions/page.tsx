import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gammaprep",
  description: "Terms and conditions for using Gammaprep's career coaching services.",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-sm dark:prose-invert">
        <h1>Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: April 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Gammaprep (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these
          Terms and Conditions. If you do not agree, please do not use our platform.
        </p>

        <h2>2. Services</h2>
        <p>Gammaprep offers three career coaching products:</p>
        <ul>
          <li>
            <strong>Career Audit (₹499)</strong> - Manual resume and LinkedIn review with a
            PDF report delivered by our team within 48 hours of submission.
          </li>
          <li>
            <strong>Interview Sprint (₹9,999)</strong> - Structured 14–21 day program with
            group sessions, mock interviews, and resources.
          </li>
          <li>
            <strong>Placement Mentorship (₹29,999)</strong> - Weekly 1:1 mentorship, mock
            interviews, job tracking, and referral support.
          </li>
        </ul>

        <h2>3. Payment</h2>
        <p>
          All payments are processed securely via Cashfree. Prices are in Indian Rupees (INR)
          and inclusive of 18% GST where applicable. A valid payment receipt will be emailed
          upon successful transaction.
        </p>

        <h2>4. Delivery</h2>
        <p>
          Career Audit reports are delivered within 48 hours of the student submitting their
          resume and LinkedIn URL. Group sessions and mentorship calls are scheduled at
          Gammaprep&apos;s discretion and communicated via the platform and email. Gammaprep
          reserves the right to reschedule sessions with reasonable advance notice.
        </p>

        <h2>5. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate information during registration and onboarding</li>
          <li>Not share session recordings or proprietary materials outside the platform</li>
          <li>Participate in good faith in all mentorship interactions</li>
          <li>Not use the platform for any unlawful purpose</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on the platform - including session recordings, worksheets, templates,
          and audit reports - is the intellectual property of Gammaprep and may not be
          reproduced, shared, or distributed without written consent.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          Gammaprep provides guidance and coaching to improve career outcomes but does not
          guarantee job placement or specific salary packages. Results depend on individual
          effort, market conditions, and other factors outside our control.
        </p>

        <h2>8. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time. Continued use of the
          platform after modifications constitutes acceptance of the updated Terms.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the
          jurisdiction of courts in Bengaluru, Karnataka.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions? Write to us at{" "}
          <a href="mailto:info@gammaprep.com">info@gammaprep.com</a>.
        </p>
      </div>
    </div>
  );
}
