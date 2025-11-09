import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;
  const recaptchaRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate CAPTCHA
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    const result = await login(email, password, captchaToken);
    if (result.success) {
      // Redirect to specified page or dashboard
      router.push(redirect || '/dashboard');
    } else {
      setError(result.message);
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setCaptchaToken('');
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-center text-sm text-gray-600 mb-8">
                Sign in to continue your journey
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end mb-4">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center mb-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                  onChange={handleCaptchaChange}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!captchaToken}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href={redirect ? `/register?redirect=${redirect}` : '/register'} 
                  className="font-bold text-primary hover:text-blue-700"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

