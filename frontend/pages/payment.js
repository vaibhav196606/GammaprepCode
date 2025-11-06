import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Layout from '@/components/Layout';
import axios from 'axios';
import { FiLoader, FiCheckCircle, FiTag, FiX } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Payment() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [courseInfo, setCourseInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/payment');
    } else if (user && user.isEnrolled) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch course info
    axios.get(`${API_URL}/api/course`)
      .then(res => setCourseInfo(res.data))
      .catch(err => console.error('Error fetching course info:', err));
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setValidatingPromo(true);
    setPromoError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/promo/validate`,
        { code: promoCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppliedPromo(response.data);
      setPromoError('');
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Invalid promo code');
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const calculatePricing = () => {
    if (!courseInfo) return null;

    const basePrice = courseInfo.price;
    const gst = Math.round(basePrice * 0.18);
    const subtotal = basePrice + gst;
    
    let discount = 0;
    let total = subtotal;

    if (appliedPromo) {
      discount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
      total = subtotal - discount;
    }

    return { basePrice, gst, subtotal, discount, total };
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Create payment order
      const response = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { promoCode: appliedPromo?.code || null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { paymentSessionId, orderId } = response.data;

      // Load Cashfree Checkout
      // Use production or sandbox mode based on environment
      const cashfreeMode = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
      const cashfree = window.Cashfree({
        mode: cashfreeMode
      });

      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: '_self'
      };

      cashfree.checkout(checkoutOptions).then(() => {
        console.log('Payment initiated');
      });

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Complete Your Enrollment</h1>
              <p className="text-blue-100">Live Classes Bootcamp with Assured Job Referrals</p>
            </div>

            {/* Course Summary */}
            <div className="px-8 py-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Details</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Live Classes Bootcamp for SDE/ML Engineers
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span><strong>Live Interactive Classes</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span>Data Structures & Algorithms (8 weeks)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span>System Design - HLD/LLD (4 weeks)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span>Data Science & Machine Learning (4 weeks)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span>Expert Mentorship by Vaibhav Goyal (SDE2 @ Microsoft)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span><strong>Assured Job Referrals</strong> at Amazon, Microsoft, Google, Oracle & more</span>
                  </li>
                  {courseInfo && (
                    <li className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-200">
                      <FiCheckCircle className="text-primary" />
                      <span>
                        <strong>Batch Starts:</strong>{' '}
                        <span className="text-primary font-bold">
                          {new Date(courseInfo.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Promo Code */}
            <div className="px-8 py-6 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiTag className="text-primary" />
                Have a Promo Code?
              </h3>
              
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                    disabled={validatingPromo}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={validatingPromo || !promoCode.trim()}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validatingPromo ? 'Checking...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-600" />
                      <span className="font-bold text-green-800">{appliedPromo.code}</span>
                      <span className="text-green-700">- {appliedPromo.discountPercent}% OFF</span>
                    </div>
                    {appliedPromo.description && (
                      <p className="text-sm text-green-600 mt-1">{appliedPromo.description}</p>
                    )}
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-red-600 hover:text-red-800"
                    title="Remove promo code"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-red-600 text-sm mt-2">{promoError}</p>
              )}
            </div>

            {/* Pricing */}
            {courseInfo && (() => {
              const pricing = calculatePricing();
              if (!pricing) return null;

              return (
                <div className="px-8 py-6 border-b">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-700">Course Fee</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{pricing.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-700">GST (18%)</span>
                    <span className="text-xl font-semibold text-gray-900">
                      ₹{pricing.gst.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between items-center mb-4 text-green-600">
                      <span className="text-lg font-medium">Discount ({appliedPromo.discountPercent}%)</span>
                      <span className="text-xl font-semibold">
                        - ₹{pricing.discount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <div className="text-right">
                      {appliedPromo && (
                        <div className="text-lg text-gray-500 line-through">
                          ₹{pricing.subtotal.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div className="text-3xl font-bold text-primary">
                        ₹{pricing.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* User Details */}
            <div className="px-8 py-6 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Billing Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Payment Button */}
            <div className="px-8 py-8">
              <button
                onClick={handlePayment}
                disabled={processing || !courseInfo}
                className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                  processing || !courseInfo
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${courseInfo ? calculatePricing()?.total.toLocaleString('en-IN') : '...'}`
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                🔒 Secure payment via Cashfree Payment Gateway
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Load Cashfree SDK */}
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
    </Layout>
  );
}


