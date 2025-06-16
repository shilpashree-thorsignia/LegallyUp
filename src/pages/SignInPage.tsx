import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import FormField from '../components/forms/FormField'; // Adjust path if needed
import { LogIn, ShieldCheck, Zap, FileText } from 'lucide-react';

// Define the structure of your form data if needed for more complex validation,
// but for email/password, direct state is often fine.
// interface SignInFormData {
//   email: string;
//   password: string;
// }

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // errors state is now an object to hold field-specific or general errors
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password' | 'general', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth(); // Assuming login is async and might throw or return user/null
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const columnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1, staggerChildren: 0.2 } },
  };
  const formColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const validateAndSetErrors = (): boolean => {
    const newErrors: Partial<Record<'email' | 'password', string>> = {};
    if (!email.trim()) {
        newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
        newErrors.password = 'Password is required.';
    }
    // Example: Add password length validation if desired
    // else if (password.length < 6) {
    //     newErrors.password = 'Password must be at least 6 characters.';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    
    if (!validateAndSetErrors()) { // Perform basic client-side validation first
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    try {
      const loginResult = await login(email, password); // `login` from useAuth
      if (loginResult) { // Check if login was successful (e.g., returns user object)
        navigate('/dashboard');
      } else {
        // This case might be hit if `login` returns null/undefined on failure
        // without throwing an error that has a `code`.
        setErrors({ general: 'Sign-in failed. Please check your credentials.' });
      }
    } catch (err: any) {
      console.error("Sign-in error details:", err);
      let generalErrorMessage = 'Failed to sign in. Please try again later.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': // More recent Firebase error code
            setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
            // Optionally, you could try to highlight both fields, but Firebase doesn't specify which one.
            // setErrors(prev => ({...prev, email: " ", password: " "})); // Empty string to trigger error style
            break;
          case 'auth/invalid-email':
            setErrors({ email: 'The email address format is not valid.' });
            break;
          case 'auth/user-disabled':
            setErrors({ general: 'This user account has been disabled by an administrator.' });
            break;
          case 'auth/too-many-requests':
            setErrors({ general: 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.' });
            break;
          default:
            setErrors({ general: generalErrorMessage });
        }
      } else {
        // Non-Firebase error or error without a code
        setErrors({ general: err.message || generalErrorMessage });
      }
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen flex items-stretch bg-gray-100 text-textColor"
    >
      {/* Left Column - Branding & Info */}
      <motion.div
        variants={columnVariants}
        className="hidden lg:flex lg:w-1/2 items-center bg-gradient-to-br from-primary to-accent justify-center p-12 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20 opacity-50 z-0"></div>
        <div className="relative z-10 text-center max-w-md bg-white/20 backdrop-blur-sm p-12">
          <motion.div variants={itemVariants} className="mb-8">
            <Link to="/">
              <h1 className="text-5xl font-extrabold tracking-tight">
                Legally<span className="text-accent">Up</span>
              </h1>
            </Link>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl font-semibold mb-6 leading-snug">
            Welcome Back!
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-white/80 leading-relaxed mb-8">
            Access your dashboard, manage your documents, and continue simplifying your legal needs with LegallyUp.
          </motion.p>
          <motion.div variants={itemVariants} className="space-y-4 text-left">
            <div className="flex items-start gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileText size={24} className="text-accent mt-1 flex-shrink-0" />
              <p><strong className="font-semibold">Quick Document Access:</strong> Instantly find and manage all your generated legal documents.</p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <ShieldCheck size={24} className="text-accent mt-1 flex-shrink-0" />
              <p><strong className="font-semibold">Secure & Reliable:</strong> Your information is protected with industry-leading security.</p>
            </div>
             <div className="flex items-start gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Zap size={24} className="text-accent mt-1 flex-shrink-0" />
              <p><strong className="font-semibold">Streamlined Workflow:</strong> Continue where you left off and save valuable time.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Sign In Form */}
      <motion.div
        variants={formColumnVariants}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
      >
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200">
          <div>
            <motion.h2 variants={itemVariants} className="mt-2 text-center text-3xl font-bold text-primary">
              Sign in to your account
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-accent hover:underline transition-colors duration-200">
                Create one now
              </Link>
            </motion.p>
          </div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"
            >
              <p className="font-medium">Sign-in Error</p>
              <p className="text-sm">{errors.general}</p>
            </motion.div>
          )}

          <motion.form
            // variants={itemVariants} // Apply to form as a whole if not staggering individual fields
            className="space-y-6" onSubmit={handleSubmit} noValidate>
            <motion.div variants={itemVariants}> {/* Stagger individual fields */}
              <FormField
                id="email" // Use "email" to match error key
                label="Email address" type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({...prev, email: undefined}));
                }}
                required placeholder="you@example.com"
                error={errors.email}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                id="password" // Use "password" to match error key
                label="Password" type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({...prev, password: undefined}));
                }}
                required placeholder="••••••••"
                error={errors.password}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-end text-sm"> {/* Moved Forgot Password to be staggered */}
              <Link to="/forgot-password" className="font-medium text-accent hover:underline transition-colors duration-200">
                Forgot your password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}> {/* Stagger button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:opacity-70"
              >
                {isLoading ? (
                    <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                ) : (
                    <LogIn size={22} className="transition-transform duration-200 group-hover:translate-x-[-4px]" /> // Icon before text
                )}
                <span className="ml-2">{isLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </motion.div>
          </motion.form>

          <motion.p variants={itemVariants} className="text-center text-xs text-gray-500 mt-8">
            By signing in, you agree to LegallyUp's{' '}
            <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignInPage;