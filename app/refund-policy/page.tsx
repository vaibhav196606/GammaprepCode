import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Gammaprep",
  description: "Gammaprep's refund and cancellation policy.",
  robots: { index: false },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-sm dark:prose-invert">
        <h1>Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: April 2025</p>

        <h2>Career Audit (₹499)</h2>
        <p>
          A full refund is available if requested within 24 hours of purchase, provided you
          have <strong>not yet submitted</strong> your resume and LinkedIn URL. Once your
          submission is received and our team begins the review, no refund is applicable.
        </p>

        <h2>Interview Sprint (₹9,999)</h2>
        <p>
          A full refund is available if requested within 48 hours of purchase and before
          the first group session has been attended. After attending any session or accessing
          session recordings, refunds are not available.
        </p>

        <h2>Placement Mentorship (₹29,999)</h2>
        <p>
          A full refund is available if requested within 48 hours of purchase and before the
          first 1:1 mentorship call is scheduled. Once an initial call has been booked or
          conducted, no refund is applicable.
        </p>

        <h2>How to Request a Refund</h2>
        <p>
          Email us at{" "}
          <a href="mailto:info@gammaprep.com">info@gammaprep.com</a> with your registered
          email address, order ID, and reason for the refund. Approved refunds are processed
          within 5–7 business days to the original payment method.
        </p>

        <h2>Exceptions</h2>
        <p>
          Refunds are not provided for change of mind after the applicable refund window,
          failure to attend scheduled sessions without prior notice, or violation of our Terms
          and Conditions.
        </p>

        <h2>Questions?</h2>
        <p>
          Reach us at <a href="mailto:info@gammaprep.com">info@gammaprep.com</a> or on{" "}
          <a href="https://wa.me/919XXXXXXXXX">WhatsApp</a>.
        </p>
      </div>
    </div>
  );
}
