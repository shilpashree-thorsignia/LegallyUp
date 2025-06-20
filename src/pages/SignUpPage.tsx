import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import FormField from '../components/forms/FormField'; // Adjust path if needed
import { UserPlus } from 'lucide-react';
import { API_BASE } from '../lib/apiBase';

// Interface (if you defined one previously, keep it)
// interface SignUpFormData { ... }

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'password' | 'confirmPassword' | 'general', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const intendedTemplateInfo = location.state as { intendedTemplateId?: string; intendedTemplateName?: string } || {};

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Animation Variants
  const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } }};
  const columnVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1, staggerChildren: 0.2 } }};
  const formColumnVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1, staggerChildren: 0.2 } }};
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }};

  const validateAndSetErrors = (): boolean => {
    const newErrors: Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>> = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim()) {
        newErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
        newErrors.password = "Password is required.";
    } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long.";
    }
    if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!validateAndSetErrors()) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'register' }),
      });
      if (res.ok) {
        setStep('otp');
        setOtpMessage('OTP sent to your email. Please enter it below to complete registration.');
      } else {
        const data = await res.json();
        setErrors({ general: data.error || 'Failed to send OTP. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    }
    setIsLoading(false);
  };

  const handleRegisterWithOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/dashboard', { replace: true });
      } else {
        setOtpError(data.error || 'Invalid OTP or registration failed.');
      }
    } catch (err) {
      setOtpError('Failed to register. Please try again.');
    }
    setIsLoading(false);
  };

  // Single relevant image for the right column
 const heroImageUrl = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8b2ZmaWNlJTIwZGVzayUyMGRvY3VtZW50c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=80";
 const heroImageAlt = "Modern desk with legal documents and technology";


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen flex items-stretch bg-gray-100 text-textColor"
    >
      {/* Left Column - Sign Up Form */}
      <motion.div
        variants={formColumnVariants}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1"
      >
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200">
          <div>
            <motion.h2 variants={itemVariants} className="mt-2 text-center text-3xl font-bold text-primary">
              Create Your Account
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-accent hover:underline transition-colors duration-200">
                Sign in here
              </Link>
            </motion.p>
            {intendedTemplateInfo?.intendedTemplateName && (
                <motion.p variants={itemVariants} className="mt-3 text-center text-xs text-green-600 bg-green-50 p-2 rounded-md">
                    Signing up to use: <span className="font-semibold">{intendedTemplateInfo.intendedTemplateName}</span>
                </motion.p>
            )}
          </div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"
            >
              <p className="font-medium">Account Creation Error</p>
              <p className="text-sm">{errors.general}</p>
            </motion.div>
          )}

          {step === 'register' && (
            <motion.form className="space-y-6" onSubmit={handleRequestOtp} noValidate >
              <motion.div variants={itemVariants}>
                <FormField id="name" label="Full Name" type="text" value={name} onChange={(e)=>{setName(e.target.value); if(errors.name)setErrors(p=>({...p,name:undefined}));}} required placeholder="John Doe" error={errors.name}/>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormField id="email" label="Email address" type="email" value={email} onChange={(e)=>{setEmail(e.target.value); if(errors.email)setErrors(p=>({...p,email:undefined}));}} required placeholder="you@example.com" error={errors.email}/>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormField id="password" label="Password (min. 6 characters)" type="password" value={password} onChange={(e)=>{setPassword(e.target.value); if(errors.password)setErrors(p=>({...p,password:undefined}));}} required placeholder="••••••••" error={errors.password}/>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormField id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value); if(errors.confirmPassword)setErrors(p=>({...p,confirmPassword:undefined}));}} required placeholder="••••••••" error={errors.confirmPassword}/>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:opacity-70">
                  {isLoading ? <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <UserPlus size={22} className="transition-transform duration-200 group-hover:scale-110" />}
                  <span className="ml-2">{isLoading ? 'Sending OTP...' : 'Request OTP'}</span>
                </button>
              </motion.div>
            </motion.form>
          )}
          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleRegisterWithOtp} noValidate>
              {otpMessage && <div className="text-green-600 text-sm">{otpMessage}</div>}
              <FormField
                id="otp"
                label="OTP Code"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                placeholder="Enter the OTP sent to your email"
              />
              {otpError && <div className="text-red-600 text-sm">{otpError}</div>}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-bold text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}

          <motion.p variants={itemVariants} className="text-center text-xs text-gray-500 mt-8">
            By creating an account, you agree to LegallyUp's{' '}
            <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Column - Branding & Single Image */}
      <motion.div
        variants={columnVariants}
        className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-primary to-accent items-center justify-center p-12 text-white relative overflow-hidden order-1 lg:order-2" // Added flex-col
      >
        <div className="absolute inset-0 bg-black/30 opacity-60 z-0"></div> {/* Overlay for contrast */}
        <div className="relative z-10 text-center max-w-lg flex flex-col items-center bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200"> {/* Centering content */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link to="/">
              <h1 className="text-5xl font-extrabold tracking-tight">
                Legally<span className="text-accent">Up</span>
              </h1>
            </Link>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl font-semibold mb-6 leading-tight">
            Your Partner in Legal Simplicity.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-accent leading-relaxed mb-10">
            Join LegallyUp and transform how you handle legal paperwork. Access intuitive tools, expert templates, and a supportive network.
          </motion.p>

          {/* Single Prominent Image */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden my-8 transform transition-all hover:scale-105"
            style={{ minHeight: '300px' }} // Reserve space to prevent CLS
          >
            <img
              src={heroImageUrl}
              alt={heroImageAlt}
              className="w-full h-auto object-cover"
              width="400"
              height="300"
              loading="lazy"
              style={{ aspectRatio: '4/3' }}
            />
          </motion.div>

           <motion.p variants={itemVariants} className="text-sm text-gray-500 mt-10">
            Empowering you with the confidence to manage legal matters effectively.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;