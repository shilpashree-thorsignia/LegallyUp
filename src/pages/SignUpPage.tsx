// src/pages/SignUpPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, register } = useAuth();
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(name, email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Failed to create an account. Email may already be in use.');
      }
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    }
    
    setIsLoading(false);
  };

    // Placeholder for Social Sign-up logic
    const handleGoogleSignUp = () => {
        // TODO: Implement Google Sign-up logic (Firebase Auth)
        alert("Placeholder: Attempting Google Sign Up");
         // Example: Call Firebase auth method like signInWithPopup(auth, googleProvider)
         // On success: navigate('/dashboard'); // Or redirect
         // On error: show error message to user
    };

     const handleFacebookSignUp = () => {
        // TODO: Implement Facebook Sign-up logic (Firebase Auth)
        alert("Placeholder: Attempting Facebook Sign Up");
         // Example: Call Firebase auth method for Facebook
         // On success: navigate('/dashboard'); // Or redirect
         // On error: show error message to user
    };

    const SignupPage = () => {
      const location = useLocation();
      const intendedTemplateId = location.state?.intendedTemplateId;
      const intendedTemplateName = location.state?.intendedTemplateName;
    
      if (intendedTemplateId) {
        console.log(`User was interested in template: ${intendedTemplateName} (ID: ${intendedTemplateId})`);
        // You could store this info, or use it to redirect after signup/login.
      }
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
            Create your account
          </h2>
           {/* Link to Sign In page */}
          <p className="mt-2 text-center text-sm text-textColor/80">
            Or <Link to="/signin" className="font-medium text-accent hover:underline transition-colors duration-200">sign in to your existing account</Link>
          </p>
        </div>

        {/* Email/Password Sign Up Form */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}> {/* Form structure with spacing */}
             <div className="rounded-md shadow-sm -space-y-px"> {/* Group fields, remove space */}
                 {/* Optional Name Field */}
                 <div>
                     <label htmlFor="full-name" className="sr-only">Full Name</label>
                     <input 
                       id="full-name" 
                       name="full-name" 
                       type="text" 
                       autoComplete="name" 
                       required
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="appearance-none rounded-t-md relative block w-full px-3 py-2.5 border border-lightGray placeholder-textColor/60 text-textColor focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 sm:text-sm"
                       placeholder="Full Name"/>
                  </div>
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label> {/* Hidden label for accessibility */}
                  <input
                    id="email-address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-lightGray placeholder-textColor/60 text-textColor focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-lightGray placeholder-textColor/60 text-textColor focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                 {/* Confirm Password Field */}
                 <div>
                   <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                     <input
                     id="confirm-password"
                     name="confirm-password"
                     type="password"
                     autoComplete="new-password"
                     required
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="appearance-none rounded-b-md relative block w-full px-3 py-2.5 border border-lightGray placeholder-textColor/60 text-textColor focus:outline-none focus:ring-2 focus:ring-accent focus:z-10 sm:text-sm"
                     placeholder="Confirm Password"
                   />
                 </div>
          </div>

          {/* Sign Up Button */}
          <div>
            <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" // Themed button styling
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>

           {/* Social Sign-up Options */}
           <div className="mt-6">
               <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                       <div className="w-full border-t border-lightGray"></div>
                   </div>
                   <div className="relative flex justify-center text-sm">
                       <span className="px-2 bg-white text-textColor/80">
                           Or continue with
                       </span>
                   </div>
               </div>
               <div className="mt-6 space-y-3"> {/* Space out social buttons */}
                   <button type="button"
                           onClick={handleGoogleSignUp}
                           className="w-full flex items-center justify-center py-2.5 px-4 border border-lightGray rounded-md shadow-sm text-sm font-medium text-textColor bg-white hover:bg-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightGray transition-colors duration-200">
                       {/* Google Icon Placeholder (replace with actual SVG if needed) */}
                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"> <path d="M12.0003 4.75C13.9993 4.75 15.6253 5.446 16.9233 6.634C18.2213 7.822 19.0003 9.411 19.0003 11.25C19.0003 11.903 18.9003 12.465 18.6993 12.935C18.4983 13.405 18.2343 13.829 17.9073 14.208C17.5803 14.587 17.2183 14.933 16.8203 15.245C16.4223 15.557 16.0183 15.847 15.6073 16.116C15.1963 16.385 14.7823 16.632 14.3653 16.856C13.9483 17.08 13.5283 17.281 13.1063 17.46C12.6843 17.639 12.2573 17.795 11.8273 17.929C11.3973 18.063 10.9643 18.175 10.5273 18.265C10.0903 18.355 9.65033 18.423 9.20833 18.469C8.76633 18.515 8.32333 18.54 7.87733 18.54V20.54C8.32333 20.54 8.76633 20.514 9.20833 20.468C9.65033 20.422 10.0903 20.354 10.5273 20.264C10.9643 20.174 11.3973 20.062 11.8273 19.928C12.2573 19.794 12.6843 19.593 13.1063 19.349C13.5283 19.105 13.9483 18.839 14.3653 18.551C14.7823 18.263 15.1963 17.953 15.6073 17.621C16.0183 17.289 16.4223 16.935 16.8203 16.56C17.2183 16.185 17.5803 15.797 17.9073 15.408C18.2343 15.019 18.4983 14.637 18.6993 14.261C18.9003 13.885 19.0003 13.517 19.0003 13.158V12.25C19.8713 11.589 20.4633 10.855 20.7773 10.05C21.0913 9.245 21.2533 8.438 21.2643 7.629C21.2753 6.82 21.1363 6.036 20.8483 5.275C20.5603 4.514 20.1433 3.808 19.5993 3.156C19.0553 2.504 18.3863 1.915 17.6093 1.387C16.8323 0.859 15.9613 0.415 15.0003 0.05C14.0393 -0.315 13.0003 -0.5 11.9843 -0.5C10.5003 -0.5 9.05933 -0.269 7.66033 0.2C6.26133 0.669 4.98333 1.339 3.82633 2.211C2.66933 3.083 1.64433 4.127 0.751333 5.342C-0.141667 6.557 -0.599667 7.866 -0.623667 9.269C-0.647667 10.672 -0.303667 12.023 0.489333 13.322C1.28233 14.621 2.38033 15.778 3.78233 16.794C5.18433 17.81 6.86733 18.617 8.83233 19.215C9.79333 19.569 10.7893 19.841 11.8223 20.031C12.8553 20.221 13.9183 20.336 15.0113 20.378C16.1043 20.42 17.1943 20.421 18.2813 20.381V18.377C17.8013 18.397 17.3223 18.412 16.8453 18.424C16.3683 18.436 15.8923 18.443 15.4193 18.444C14.9463 18.445 14.4753 18.441 14.0043 18.431C13.5333 18.421 13.0633 18.407 12.5963 18.388C12.1293 18.369 11.6663 18.345 11.2083 18.315C10.7503 18.285 10.2973 18.25 9.85033 18.21C9.40333 18.17 8.96233 18.125 8.52833 18.074C8.09433 18.023 7.66733 17.968 7.24833 17.908C6.82933 17.848 6.41733 17.784 6.01333 17.715C5.60933 17.646 5.21233 17.573 4.82333 17.496C4.43433 17.419 4.05333 17.339 3.68133 17.255C3.30933 17.171 2.94633 17.083 2.59433 16.992C2.24233 16.901 1.89933 16.806 1.56733 16.708C1.23533 16.61 0.913333 16.51 0.602333 16.408C0.291333 16.306 0.000333 16.203 -0.107667 16.099L1.37733 14.622C1.46433 14.702 1.57033 14.782 1.69533 14.861C1.82033 14.94 1.96433 15.018 2.12633 15.096C2.28833 15.174 2.46933 15.25 2.66933 15.326C2.86933 15.402 3.08833 15.476 3.32633 15.548C3.56433 15.62 3.82133 15.689 4.09833 15.756C4.37533 15.823 4.67133 15.886 4.98733 15.946C5.30333 16.006 5.63933 16.062 5.99533 16.115C6.35133 16.168 6.72733 16.217 7.12333 16.262C7.51933 16.307 7.93433 16.349 8.36833 16.388C8.80233 16.427 9.25533 16.462 9.72833 16.492C10.2013 16.522 10.6933 16.547 11.2043 16.568C11.7153 16.589 12.2453 16.605 12.7953 16.617C13.3453 16.629 13.9143 16.637 14.5023 16.641C15.0903 16.645 15.6983 16.645 16.3263 16.641C16.9543 16.637 17.5993 16.629 18.2633 16.617C18.9273 16.605 19.5993 16.589 20.2793 16.568C20.9593 16.547 21.6353 16.522 22.3073 16.492C22.9793 16.462 23.6423 16.427 24.3043 16.388V14.388C23.2913 14.503 22.2953 14.587 21.3163 14.641C20.3373 14.695 19.3663 14.717 18.4013 14.708C17.4363 14.699 16.4873 14.66 15.5543 14.591C14.6213 14.522 13.7043 14.424 12.8033 14.297C11.9023 14.17 11.0193 14.015 10.1533 13.833C9.28733 13.651 8.44033 13.443 7.61333 13.207C6.78633 12.971 5.98133 12.707 5.20033 12.416C4.41933 12.125 3.66433 11.806 2.93633 11.46C2.20833 11.114 1.50933 10.74 0.839333 10.339L2.05133 8.948C2.66733 9.255 3.30933 9.521 3.97633 9.747C4.64333 9.973 5.33733 10.159 6.05833 10.306C6.77933 10.453 7.52733 10.561 8.30233 10.63C9.07733 10.699 9.87833 10.725 10.7073 10.708C11.5363 10.691 12.3883 10.632 13.2623 10.53C14.1363 10.428 15.0313 10.284 15.9483 10.099C16.8653 9.914 17.7993 9.687 18.7503 9.419C19.7013 9.151 20.6643 8.842 21.6393 8.494C22.6143 8.146 23.5933 7.759 24.5743 7.332C23.5713 7.309 22.5873 7.285 21.6223 7.26C20.6573 7.235 19.7113 7.209 18.7853 7.182C17.8593 7.155 16.9523 7.127 16.0663 7.099C15.1803 7.071 14.3143 7.042 13.4673 7.012C12.6203 6.982 11.7923 6.952 10.9833 6.921C10.1743 6.89 9.38533 6.859 8.61733 6.828C7.84933 6.797 7.10333 6.765 6.38033 6.733C5.65733 6.701 4.95833 6.669 4.28333 6.637C3.60833 6.605 2.96033 6.573 2.34033 6.541C1.72033 6.509 1.12933 6.478 0.567333 6.448V4.448C1.00633 4.471 1.44933 4.492 1.89733 4.512C2.34533 4.532 2.79833 4.551 3.25633 4.569C3.71433 4.587 4.17733 4.604 4.64533 4.62C5.11333 5.11333 5.58733 4.651 6.06733 4.665C6.54733 4.679 7.03433 4.692 7.52833 4.704C8.02233 4.716 8.52233 4.727 9.02933 4.737C9.53633 4.747 10.0493 4.757 10.5693 4.766C11.0893 4.775 11.6163 4.78 12.1523 4.782V4.75H12.0003Z" fill="currentColor"/></svg>
                       Sign up with Google
                   </button>
                   {/* Optional Facebook Sign-up Button */}
                   {/* <button type="button"
                           onClick={handleFacebookSignUp}
                           className="w-full flex items-center justify-center py-2.5 px-4 border border-lightGray rounded-md shadow-sm text-sm font-medium text-textColor bg-white hover:bg-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightGray transition-colors duration-200">
                       {/* Facebook Icon Placeholder }
                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">...</svg>
                       Sign up with Facebook
                   </button> */}
               </div>
           </div>

           {/* Legal Terms */}
           <div className="text-center text-xs text-textColor/60 mt-6">
               By creating an account, you agree to LegallyUp's <Link to="/terms" className="text-accent hover:underline transition-colors duration-200">Terms of Service</Link> and <Link to="/privacy" className="text-accent hover:underline transition-colors duration-200">Privacy Policy</Link>.
           </div>

        </form>
      </div>
    </motion.div>
  );
};
}

export default SignUpPage;