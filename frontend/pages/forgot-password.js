import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email
      });

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FiMail className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-blue-100">
                    No worries! Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                {/* Form */}
                <div className="px-8 py-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition`}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center">
                      <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
                      >
                        <FiArrowLeft />
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
                    Check Your Email!
                  </h2>
                  <p className="text-green-100">
                    We&apos;ve sent a password reset link to your email address.
                  </p>
                </div>

                <div className="px-8 py-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">What&apos;s next?</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      <li>Check your email inbox</li>
                      <li>Click the password reset link</li>
                      <li>Create a new password</li>
                      <li>Login with your new password</li>
                    </ol>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Didn&apos;t receive the email?</strong>
                    <br />
                    Check your spam folder or{' '}
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setEmail('');
                      }}
                      className="text-primary hover:text-blue-700 font-medium"
                    >
                      try again
                    </button>
                  </p>

                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
                    >
                      <FiArrowLeft />
                      Back to Login
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Section */}
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
        </div>
      </div>
    </Layout>
  );
}

