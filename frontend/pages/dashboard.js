import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import axios from 'axios';
import EditProfileModal from '@/components/EditProfileModal';
import { FiUser, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiEdit } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [pendingPayment, setPendingPayment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setLocalUser(user);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && token && !user.isEnrolled) {
      checkPendingPayment();
      fetchPaymentHistory();
    } else {
      setCheckingPayment(false);
    }
  }, [user, token]);

  const checkPendingPayment = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment/check-pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Only show pending payment if status is PENDING, not FAILED
      if (response.data.hasPending && response.data.payment.paymentStatus === 'PENDING') {
        setPendingPayment(response.data.payment);
      }
    } catch (error) {
      console.error('Error checking pending payment:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentHistory(response.data.slice(0, 3)); // Show last 3 payments
    } catch (error) {
      console.error('Error fetching payment history:', error);
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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
              <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user.name}!</p>
            </div>

            {/* Enrollment Status */}
            <div className="px-8 py-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Enrollment Status</h2>
                {user.isEnrolled ? (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    <FiCheckCircle />
                    <span className="font-semibold">Enrolled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
                    <FiXCircle />
                    <span className="font-semibold">Not Enrolled</span>
                  </div>
                )}
              </div>
              {user.isEnrolled ? (
                <div className="mt-6 p-6 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    🎉 Congratulations! You are enrolled in the bootcamp.
                  </h3>
                  <p className="text-green-700">
                    Enrolled on: {formatDate(user.enrolledDate)}
                  </p>
                  <p className="mt-4 text-green-700">
                    You will receive class details and meeting links via email before the course starts.
                    Make sure to check your inbox regularly.
                  </p>
                </div>
              ) : checkingPayment ? (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg text-center">
                  <FiClock className="animate-spin text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Checking payment status...</p>
                </div>
              ) : pendingPayment ? (
                <div className="mt-6 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-400">
                  <div className="flex items-start gap-3 mb-4">
                    <FiClock className="text-3xl text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2 text-xl">
                        Payment Pending
                      </h3>
                      <p className="text-yellow-700 mb-3">
                        You have a pending payment. Please complete it to get enrolled.
                      </p>
                      <div className="bg-white p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">Order ID: <span className="font-mono text-xs">{pendingPayment.orderId}</span></p>
                        <p className="text-sm text-gray-600">Amount: <span className="font-semibold">₹{pendingPayment.amount.toLocaleString('en-IN')}</span></p>
                        <p className="text-sm text-gray-600">Status: <span className="font-semibold capitalize">{pendingPayment.status}</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/payment/verify?order_id=${pendingPayment.orderId}`}
                      className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold text-center"
                    >
                      Complete Payment
                    </a>
                    <Link
                      href="/payment"
                      className="inline-block bg-white text-yellow-700 border-2 border-yellow-600 px-6 py-3 rounded-lg hover:bg-yellow-50 transition font-semibold text-center"
                    >
                      Start New Payment
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-primary">
                  <h3 className="font-semibold text-gray-900 mb-2 text-xl">
                    Complete Your Enrollment
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Start your journey to crack interviews at top tech companies. 
                    Complete the payment to enroll in the bootcamp.
                  </p>
                  <Link
                    href="/payment"
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-center shadow-lg"
                  >
                    Proceed to Payment
                  </Link>
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="px-8 py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiEdit />
                  Edit Profile
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <FiUser className="text-2xl text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-900">{localUser?.name || user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <FiMail className="text-2xl text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-900">{localUser?.email || user.email}</p>
                  </div>
                </div>
                {(localUser?.phone || user.phone) && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <FiPhone className="text-2xl text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-900">{localUser?.phone || user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="px-8 py-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• All classes are conducted live online</li>
                <li>• Class recordings are not available, so attendance is important</li>
                <li>• You will receive class schedules via email</li>
                <li>• For any queries, contact info@gammaprep.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={localUser || user}
          token={token}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedUser) => {
            setLocalUser(updatedUser);
            setShowEditModal(false);
          }}
        />
      )}
    </Layout>
  );
}

