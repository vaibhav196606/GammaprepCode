import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead 
        title="Privacy Policy - Gammaprep"
        description="Privacy Policy for Gammaprep - Gamma Tech & Services LLP placement bootcamp"
      />
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                  <p>
                    Welcome to Gammaprep, operated by Gamma Tech & Services LLP ("we", "us", or "our"). 
                    We are committed to protecting your personal information and your right to privacy. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                    when you visit our website and use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                  <p className="mb-2">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Account credentials</li>
                    <li>Payment information</li>
                    <li>Educational background and career information</li>
                    <li>Communication preferences</li>
                    <li>Any other information you choose to provide</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                  <p className="mb-2">We use the information we collect to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your enrollment and payments</li>
                    <li>Send you course materials and updates</li>
                    <li>Communicate with you about our services</li>
                    <li>Provide customer support</li>
                    <li>Send marketing and promotional communications (with your consent)</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Information Sharing</h2>
                  <p>
                    We do not sell or rent your personal information to third parties. We may share your 
                    information with:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Service providers who assist us in operating our business</li>
                    <li>Payment processors for transaction processing</li>
                    <li>Legal authorities when required by law</li>
                    <li>Potential employers (only with your explicit consent for job referrals)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational security measures to protect your 
                    personal information. However, no method of transmission over the Internet or electronic 
                    storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
                  <p className="mb-2">You have the right to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Object to processing of your information</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Cookies and Tracking</h2>
                  <p>
                    We use cookies and similar tracking technologies to track activity on our website and 
                    hold certain information. You can instruct your browser to refuse all cookies or to 
                    indicate when a cookie is being sent.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
                  <p className="mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
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

