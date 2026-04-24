import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Gammaprep",
  description: "Privacy policy for Gammaprep - how we collect, use, and protect your data.",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-sm dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 2025</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you register, we collect your name, email address, and phone number. During
          onboarding, we collect professional information such as your current role, company,
          target companies, and career goals. When you purchase a product, we process payment
          information through Cashfree (we do not store card details). For Career Audit, we
          store your resume (PDF) and LinkedIn URL.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Deliver the product or service you purchased</li>
          <li>Personalize your onboarding experience and product recommendation</li>
          <li>Send transactional emails (order confirmation, report delivery)</li>
          <li>Respond to your support requests</li>
          <li>Improve our platform and offerings</li>
        </ul>

        <h2>3. Data Storage and Security</h2>
        <p>
          Your data is stored in Supabase (PostgreSQL) hosted on AWS. Files (resumes, audit
          reports) are stored in Supabase Storage. We use industry-standard encryption in
          transit (TLS) and at rest. Access to your data is restricted to Gammaprep
          administrators.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell or rent your personal data. We share data only with:
        </p>
        <ul>
          <li>
            <strong>Cashfree</strong> - payment processing
          </li>
          <li>
            <strong>Resend</strong> - transactional email delivery
          </li>
          <li>
            <strong>Supabase</strong> - database and file storage infrastructure
          </li>
          <li>
            <strong>Vercel</strong> - hosting platform
          </li>
        </ul>

        <h2>5. Cookies and Analytics</h2>
        <p>
          We use session cookies for authentication (managed by Supabase Auth). We may use
          Google Analytics to understand aggregate usage patterns. You can opt out via browser
          settings or Google Analytics Opt-out Add-on.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any
          time by emailing us at{" "}
          <a href="mailto:info@gammaprep.com">info@gammaprep.com</a>. We will respond within
          30 days.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          For any privacy-related questions, write to us at{" "}
          <a href="mailto:info@gammaprep.com">info@gammaprep.com</a>.
        </p>
      </div>
    </div>
  );
}
