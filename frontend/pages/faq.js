import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SEOHead from '@/components/SEOHead';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/faq`);
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEOHead 
        title="Frequently Asked Questions - Gammaprep"
        description="Find answers to common questions about Gammaprep's live placement bootcamp, course structure, fees, and enrollment process."
        url="https://gammaprep.com/faq"
      />
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600">
                Got questions? We&apos;ve got answers. Find everything you need to know about Gammaprep.
              </p>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading FAQs...</p>
                </div>
              ) : faqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No FAQs available at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={faq._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <button
                        className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800 hover:text-primary focus:outline-none py-4 transition"
                        onClick={() => toggleFAQ(index)}
                      >
                        <span className="pr-4">{faq.question}</span>
                        <span className="flex-shrink-0">
                          {openIndex === index ? (
                            <FiChevronUp className="text-primary" size={24} />
                          ) : (
                            <FiChevronDown className="text-gray-500" size={24} />
                          )}
                        </span>
                      </button>
                      {openIndex === index && (
                        <div className="mt-3 text-gray-600 pb-4 pl-2 animate-fadeIn">
                          <p className="whitespace-pre-wrap">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="mb-6 text-blue-100">
                Can&apos;t find the answer you&apos;re looking for? Feel free to reach out to us directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@gammaprep.com"
                  className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Email Us
                </a>
                <a
                  href="https://wa.me/918890240404?text=Hi,%20I%20have%20a%20question%20about%20Gammaprep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

