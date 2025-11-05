import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { FiLock, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for router to be ready
    if (router.isReady) {
      setIsReady(true);
      if (!token) {
        setError('Invalid or missing reset token. Please use the link from your email.');
      }
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        newPassword: password
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while router initializes
  if (!isReady) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            {!success ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FiLock className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Reset Password
                  </h2>
                  <p className="text-blue-100">
                    Enter your new password below
                  </p>
                </div>

                {/* Form */}
                <div className="px-8 py-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
                        <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 6 characters
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !token}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white ${
                        loading || !token
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition`}
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    <div className="text-center">
                      <Link 
                        href="/login" 
                        className="text-primary hover:text-blue-700 font-medium text-sm"
                      >
                        Back to Login
                      </Link>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-10 text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Password Reset Successful!
                  </h2>
                  <p className="text-green-100">
                    Your password has been changed successfully.
                  </p>
                </div>

                <div className="px-8 py-8 text-center">
                  <p className="text-gray-700 mb-6">
                    You can now login with your new password.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Redirecting to login page in 3 seconds...
                  </p>
                  <Link
                    href="/login"
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    Go to Login
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Help Section */}
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <a 
                  href="mailto:info@gammaprep.com" 
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

