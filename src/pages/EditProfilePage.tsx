import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import FormField from '../components/forms/FormField';
import { API_BASE } from '../lib/apiBase';

interface ProfileFormData {
  fullName: string;
  email: string;
  plan: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    plan: user?.plan || 'free',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    // Update form data when user data changes
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
      plan: user.plan || 'free'
    }));
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.confirmPassword) {
      newErrors.password = 'Please enter a password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare update data
      const updateData: any = {
        username: formData.fullName,
        email: formData.email
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_BASE}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        const updatedUser = {
          ...user,
          name: formData.fullName,
          email: formData.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));

        // Show success message and redirect to dashboard
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate('/dashboard');
        }, 2000);
      } else {
        console.error('Profile update failed:', response.status, data);
        setErrors({ general: data.error || data.message || 'Failed to update profile. Please try again.' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ general: 'Network error occurred. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const planOptions = [
    { value: 'free', label: 'Free Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'attorney', label: 'Attorney Plan' }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-50 py-8"
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary hover:text-accent mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your account information</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6"
          >
            Profile updated successfully!
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>

            <FormField
              id="fullName"
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              error={errors.fullName}
            />

            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              error={errors.email}
            />

                          <div className="mb-6">
                <label className="block text-primary font-semibold mb-2 text-sm">
                  Current Plan
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 text-sm cursor-not-allowed">
                  {planOptions.find(option => option.value === formData.plan)?.label || 'Free Plan'}
                </div>
              </div>
            <p className="text-xs text-gray-500 mt-1">
              To change your plan, please visit the <button 
                type="button"
                onClick={() => navigate('/pricing')} 
                className="text-primary hover:underline"
              >
                pricing page
              </button>
            </p>
          </div>

          {/* Security Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Security
            </h2>

            <div className="relative">
              <FormField
                id="password"
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password (min. 6 characters)"
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <FormField
                id="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Leave password fields empty if you don't want to change your password
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfilePage; 