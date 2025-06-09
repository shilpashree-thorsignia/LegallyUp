// src/pages/SignInPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Animation variants for the form container
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
    
    setIsLoading(false);
  };

    // Placeholder for Social Sign-in logic
    const handleGoogleSignIn = () => {
        // TODO: Implement Google Sign-in logic (Firebase Auth)
        alert("Placeholder: Attempting Google Sign In");
        // Example: Call Firebase auth method like signInWithPopup(auth, googleProvider)
        // On success: navigate('/dashboard');
        // On error: show error message to user
    };


  return (
    <motion.div
      initial="hidden" // Apply container animation variants
      animate="visible"
      variants={formVariants}
      className="min-h-screen flex items-center justify-center bg-lightGray text-textColor py-12 px-4 sm:px-6 lg:px-8" // Full height, center content, themed background/text/padding
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-lightGray"> {/* Form container styling */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-primary"> {/* Heading styling */}
            Sign in to your account
          </h2>
           {/* Link to Sign Up page */}
          <p className="mt-2 text-center text-sm text-textColor/80">
            Or <Link to="/signup" className="font-medium text-accent hover:underline transition-colors duration-200">create a new account</Link>
          </p>
        </div>

        {/* Email/Password Sign In Form */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}> {/* Form structure with spacing */}
          <div className="rounded-md shadow-sm -space-y-px"> {/* Group fields, remove space */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label> {/* Hidden label for accessibility */}
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2.5 border border-lightGray placeholder-textColor/60 text-textColor focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2.5 border border-lightGray placeholder-textColor/60 text-textColor focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Remember me checkbox placeholder */}
            </div>
            <div className="text-sm">
              <Link to="#" className="font-medium text-accent hover:underline transition-colors duration-200">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" // Themed button styling
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

           {/* Social Sign-in Options */}
           <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button 
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center py-2.5 px-4 border border-lightGray rounded-md shadow-sm text-sm font-medium text-textColor bg-white hover:bg-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightGray transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
           </div>

           {/* Legal Terms */}
           <div className="text-center text-xs text-textColor/60 mt-6">
               By signing in, you agree to LegallyUp's <Link to="/terms" className="text-accent hover:underline transition-colors duration-200">Terms of Service</Link> and <Link to="/privacy" className="text-accent hover:underline transition-colors duration-200">Privacy Policy</Link>.
           </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SignInPage;