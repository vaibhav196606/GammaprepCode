import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import axios from 'axios';
import { FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VerifyPayment() {
  const router = useRouter();
  const { order_id } = router.query;
  const { token, user: contextUser } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (order_id && token) {
      verifyPayment();
    }
  }, [order_id, token]);

  const verifyPayment = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/payment/verify`,
        { orderId: order_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        
        // Force page reload to refresh user data from AuthContext
        // This will update the enrollment status
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000); // Wait 3 seconds to show success message
      } else {
        setStatus('failed');
        setMessage(response.data.message);
      }

      // Fetch payment details
      const detailsResponse = await axios.get(
        `${API_URL}/api/payment/status/${order_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentDetails(detailsResponse.data);

    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Error verifying payment. Please contact support.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {status === 'verifying' && (
              <div className="text-center py-16">
                <FiLoader className="animate-spin text-6xl text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifying Payment...
                </h2>
                <p className="text-gray-600">Please wait while we confirm your payment</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-16 px-8">
                <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="text-6xl text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h2>
                <p className="text-lg text-gray-700 mb-8">{message}</p>

                {paymentDetails && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-gray-900">{paymentDetails.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-gray-900">
                          ₹{paymentDetails.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {paymentDetails.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-medium text-gray-900 text-sm">
                            {paymentDetails.transactionId}
                          </span>
                        </div>
                      )}
                      {paymentDetails.paymentMethod && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium text-gray-900">
                            {paymentDetails.paymentMethod}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Go to Dashboard
                  </Link>
                  <p className="text-sm text-gray-600">
                    Redirecting to dashboard in a moment...
                  </p>
                  <p className="text-sm text-gray-600">
                    You will receive class details via email shortly.
                  </p>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="text-center py-16 px-8">
                <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FiXCircle className="text-6xl text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
                <p className="text-lg text-gray-700 mb-8">{message}</p>

                {paymentDetails && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-gray-900">{paymentDetails.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-red-600">{paymentDetails.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    href="/payment"
                    className="block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 hover:text-primary"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-16 px-8">
                <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FiXCircle className="text-6xl text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Verification Error
                </h2>
                <p className="text-lg text-gray-700 mb-8">{message}</p>
                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Go to Dashboard
                  </Link>
                  <p className="text-sm text-gray-600">
                    Contact support at info@gammaprep.com if amount was deducted.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}




