import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { motion } from 'framer-motion';
import FormField from '../components/forms/FormField';
import { LogIn } from 'lucide-react';
import { API_BASE } from '../lib/apiBase';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'done'>('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  // Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };
  const columnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'forgot' }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('OTP sent to your email.');
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError('Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset successful! You can now sign in.');
        setStep('done');
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError('Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl" variants={columnVariants} initial="hidden" animate="visible">
        <div className="flex flex-col items-center mb-6">
          <LogIn size={40} className="text-primary mb-2" />
          <h2 className="text-2xl font-bold text-primary text-center">Forgot Password</h2>
          <p className="text-gray-500 text-center mt-2">Enter your email to receive an OTP and reset your password.</p>
        </div>
        {step === 'email' && (
          <form className="space-y-6" onSubmit={handleSendOtp} noValidate>
            <FormField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-bold text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <div className="flex justify-between mt-4">
              <Link to="/signin" className="text-accent hover:underline text-sm">Back to Sign In</Link>
            </div>
          </form>
        )}
        {step === 'otp' && (
          <form className="space-y-6" onSubmit={handleVerifyOtpAndReset} noValidate>
            <FormField
              id="otp"
              label="OTP Code"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              placeholder="Enter the OTP sent to your email"
            />
            <FormField
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-bold text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="flex justify-between mt-4">
              <button type="button" className="text-accent hover:underline text-sm" onClick={() => setStep('email')}>Resend OTP</button>
              <Link to="/signin" className="text-accent hover:underline text-sm">Back to Sign In</Link>
            </div>
          </form>
        )}
        {step === 'done' && (
          <div className="text-center">
            <div className="text-green-600 font-bold mb-4">Password reset successful!</div>
            <Link to="/signin" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-accent transition-colors">Sign In</Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage; 