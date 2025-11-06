import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';

export default function RefundPolicy() {
  return (
    <>
      <SEOHead 
        title="Refund & Cancellation Policy - Gammaprep"
        description="Refund and Cancellation Policy for Gammaprep - Gamma Tech & Services LLP placement bootcamp"
      />
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Cancellation Policy</h1>
              <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Overview</h2>
                  <p>
                    At Gammaprep (operated by Gamma Tech & Services LLP), we strive to provide high-quality education 
                    and training. This Refund & Cancellation Policy explains the terms under which refunds may be requested 
                    and processed.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Eligibility for Refund</h2>
                  <div className="bg-blue-50 border-l-4 border-primary p-4 mb-4">
                    <p className="font-semibold text-lg mb-2">50% Refund Policy</p>
                    <p>
                      Students are eligible for a <strong>50% refund</strong> if they cancel their enrollment within{' '}
                      <strong>3 days from the start of the bootcamp</strong>.
                    </p>
                  </div>
                  <p className="mb-2">To be eligible for a refund, the following conditions must be met:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Cancellation request must be submitted within 3 days of bootcamp commencement</li>
                    <li>Request must be made through email to info@gammaprep.com</li>
                    <li>Provide order ID and payment transaction details</li>
                    <li>Refund request must be made by the enrolled student</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Non-Refundable Scenarios</h2>
                  <p className="mb-2">Refunds will NOT be provided in the following cases:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Cancellation requests made after 3 days from the bootcamp start date</li>
                    <li>Violation of our Terms and Conditions resulting in termination</li>
                    <li>Unauthorized recording or sharing of course materials</li>
                    <li>Failure to attend classes (classes are live with no recordings)</li>
                    <li>Change of mind after the 3-day refund period</li>
                    <li>Technical issues on the student&apos;s end (internet, device, etc.)</li>
                    <li>Partial completion of the course</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Refund Process</h2>
                  <p className="mb-2">If your refund request is approved:</p>
                  <ol className="list-decimal list-inside ml-4 space-y-2">
                    <li>
                      <strong>Submit Request:</strong> Email your cancellation request to info@gammaprep.com with your 
                      order ID, payment details, and reason for cancellation
                    </li>
                    <li>
                      <strong>Verification:</strong> Our team will verify your enrollment date and eligibility 
                      within 2-3 business days
                    </li>
                    <li>
                      <strong>Approval:</strong> Once approved, 50% of your payment amount will be refunded
                    </li>
                    <li>
                      <strong>Processing Time:</strong> Refunds will be processed within 7-10 business days to your 
                      original payment method
                    </li>
                    <li>
                      <strong>Confirmation:</strong> You will receive an email confirmation once the refund is processed
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Payment Gateway Charges</h2>
                  <p>
                    Please note that payment gateway charges and transaction fees are non-refundable and will be deducted 
                    from your refund amount as per the payment processor's policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Batch Postponement</h2>
                  <p>
                    In case Gammaprep needs to postpone a batch start date, students will be notified in advance and given 
                    the option to:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Continue with the new batch schedule</li>
                    <li>Request a full refund (100%) if the new schedule doesn&apos;t suit them</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Service Cancellation by Gammaprep</h2>
                  <p>
                    If Gammaprep cancels the bootcamp for any reason, students will receive a <strong>full refund (100%)</strong> of 
                    their payment within 7-10 business days.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Dispute Resolution</h2>
                  <p>
                    If you have any concerns regarding refunds or cancellations, please contact us first. We are 
                    committed to resolving all disputes fairly and promptly. All disputes shall be subject to the 
                    jurisdiction of courts in Hyderabad, Telangana, India.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
                  <p>
                    We reserve the right to modify this Refund & Cancellation Policy at any time. Changes will be 
                    effective immediately upon posting on our website. Your continued use of our services after any 
                    modifications constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
                  <p className="mb-2">For refund or cancellation requests, please contact:</p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="font-semibold">Gamma Tech & Services LLP</p>
                    <p>SY.35P&36 2, Mytri Square, 41/11, Gachibowli - Miyapur Rd, Kondapur</p>
                    <p>Hanuman Nagar, Prashanth Nagar Colony, Gachibowli, Kothaguda</p>
                    <p>Hyderabad, Telangana 500084</p>
                    <p className="mt-2">Email: <a href="mailto:info@gammaprep.com" className="text-primary hover:underline">info@gammaprep.com</a></p>
                    <p>Phone: <a href="tel:+918890240404" className="text-primary hover:underline">+91 8890240404</a></p>
                  </div>
                </section>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-8">
                  <p className="font-semibold text-yellow-900 mb-2">⚠️ Important Note</p>
                  <p className="text-yellow-800">
                    By enrolling in our bootcamp, you acknowledge that you have read, understood, and agree to this 
                    Refund & Cancellation Policy. Please ensure you are certain about your enrollment decision, as 
                    refunds are only available within the first 3 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

