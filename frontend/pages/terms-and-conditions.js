import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <>
      <SEOHead 
        title="Terms & Conditions - Gammaprep"
        description="Terms and Conditions for Gammaprep - Gamma Tech & Services LLP placement bootcamp"
      />
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
              <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
                  <p>
                    By accessing and using the services provided by Gammaprep (operated by Gamma Tech & Services LLP), 
                    you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
                    you may not access our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Services</h2>
                  <p>
                    Gammaprep provides live online placement bootcamp training covering Data Structures & Algorithms, 
                    System Design, Data Science, and Machine Learning. Our services include:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Live interactive classes (no recordings)</li>
                    <li>Study materials and resources</li>
                    <li>Mock interviews and assessments</li>
                    <li>Resume building assistance</li>
                    <li>Job referrals (assured for enrolled students)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Enrollment and Payment</h2>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Enrollment is confirmed only after successful payment</li>
                    <li>All fees are in Indian Rupees (INR)</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Payment is processed through secure third-party payment gateways</li>
                    <li>Once enrolled, you gain access to the entire bootcamp curriculum</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Refund Policy</h2>
                  <p>
                    Please refer to our <Link href="/refund-policy" className="text-primary hover:underline">Refund & Cancellation Policy</Link> for 
                    detailed information about refunds and cancellations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Student Responsibilities</h2>
                  <p className="mb-2">As a student, you agree to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Attend live classes regularly and punctually</li>
                    <li>Complete assignments and assessments honestly</li>
                    <li>Not share course materials or recordings without permission</li>
                    <li>Maintain respectful communication with instructors and peers</li>
                    <li>Not engage in any activities that disrupt the learning environment</li>
                    <li>Provide accurate information during enrollment</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
                  <p>
                    All course materials, content, and resources provided by Gammaprep are protected by intellectual 
                    property laws. You may not reproduce, distribute, modify, or create derivative works without our 
                    express written permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">7. No Recording Policy</h2>
                  <p>
                    Our classes are live and interactive. Recording, screen capturing, or any form of unauthorized 
                    documentation of our live classes is strictly prohibited and may result in immediate termination 
                    of your enrollment without refund.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Job Placement Assistance</h2>
                  <p>
                    While we provide assured job referrals to our students, we cannot guarantee job placement or 
                    specific salary packages. Final hiring decisions are made by the employers.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
                  <p>
                    Gammaprep and Gamma Tech & Services LLP shall not be liable for any indirect, incidental, special, 
                    consequential, or punitive damages arising out of your use of our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Termination</h2>
                  <p>
                    We reserve the right to terminate or suspend your access to our services immediately, without prior 
                    notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, 
                    us, or third parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of any material changes. 
                    Your continued use of our services after such modifications constitutes acceptance of the updated terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes 
                    arising under these terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad, 
                    Telangana.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contact Information</h2>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="font-semibold">Gamma Tech & Services LLP</p>
                    <p>SY.35P&36 2, Mytri Square, 41/11, Gachibowli - Miyapur Rd, Kondapur</p>
                    <p>Hanuman Nagar, Prashanth Nagar Colony, Gachibowli, Kothaguda</p>
                    <p>Hyderabad, Telangana 500084</p>
                    <p className="mt-2">Email: <a href="mailto:info@gammaprep.com" className="text-primary hover:underline">info@gammaprep.com</a></p>
                    <p>Phone: <a href="tel:+918890240404" className="text-primary hover:underline">+91 8890240404</a></p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

