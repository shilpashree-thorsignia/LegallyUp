import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link} from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCircle, CheckCircle } from 'lucide-react';
import FormField from '../components/forms/FormField'; // Ensure this path is correct
import { useAuth } from '../contexts/AuthContext';

// Make sure mockAttorneys is accessible here.
// For a real app, import from a shared data file or fetch data.
const mockAttorneys = [
    { id: 'att1', name: 'Jane Doe, Esq.', slug: 'jane-doe-esq', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Real Estate Law', 'Contract Law'], location: 'New York, NY', experience: '10+ Years', bio: 'Specializing in complex real estate transactions and contract negotiations for businesses and individuals.' },
    { id: 'att2', name: 'John Smith, Esq.', slug: 'john-smith-esq', photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Intellectual Property', 'Business Law'], location: 'San Francisco, CA', experience: '8 Years', bio: 'Helping startups and established companies protect their IP and navigate corporate legalities.' },
    { id: 'att3', name: 'Emily Chen, Esq.', slug: 'emily-chen-esq', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Family Law', 'Estate Planning'], location: 'Austin, TX', experience: '12 Years', bio: 'Compassionate and experienced attorney dedicated to family law matters and estate planning services.' },
    { id: 'att4', name: 'Michael Brown, Esq.', slug: 'michael-brown-esq', photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Employment Law', 'Labor Relations'], location: 'Chicago, IL', experience: '15 Years', bio: 'Expert in employment disputes, workplace investigations, and labor law compliance for employers and employees.'},
    { id: 'att5', name: 'Jessica Garcia, Esq.', slug: 'jessica-garcia-esq', photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Immigration Law'], location: 'Miami, FL', experience: '7 Years', bio: 'Assisting individuals and families with visas, green cards, citizenship, and deportation defense.' },
    { id: 'att6', name: 'David Lee, Esq.', slug: 'david-lee-esq', photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Bankruptcy Law', 'Debt Relief'], location: 'Los Angeles, CA', experience: '9 Years', bio: 'Providing guidance and representation for individuals and businesses facing financial distress.' },
];


interface ConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  reasonForConsult: string;
  caseType?: string;
}

const initialConsultData: ConsultationFormData = {
  fullName: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: '',
  reasonForConsult: '',
  caseType: '',
};

const ScheduleConsultationPage: React.FC = () => {
  const { attorneySlug } = useParams<{ attorneySlug: string }>();
  const location = useLocation();
  // const navigate = useNavigate(); // Not strictly needed if only redirecting on success within this component
  const passedAttorneyInfo = location.state as { attorneyId: string; attorneyName: string } || {};
  const attorney = mockAttorneys.find(att => att.slug === attorneySlug);

  const [formData, setFormData] = useState<ConsultationFormData>(initialConsultData);
  const [errors, setErrors] = useState<Partial<ConsultationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const attorneyName = attorney?.name || passedAttorneyInfo.attorneyName || "Selected Attorney";

  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // const handleLogin = () => {
  //   window.location.href = '/signin';
  // };

  useEffect(() => {
    if (attorney && attorney.specialization.length > 0 && !formData.caseType) { // Only set if not already set
      setFormData(prev => ({ ...prev, caseType: attorney.specialization[0] }));
    }
  }, [attorney, formData.caseType]); // Add formData.caseType to dependencies


  const validateForm = (): boolean => {
    const newErrors: Partial<ConsultationFormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(formData.phone)) { // More lenient phone validation
        newErrors.phone = 'Invalid phone number format.';
    }
    if (!formData.reasonForConsult.trim()) newErrors.reasonForConsult = 'Please provide a brief reason for the consultation.';
    if (attorney && attorney.specialization.length > 0 && !formData.caseType) {
        newErrors.caseType = 'Please select an area of assistance.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ConsultationFormData]) {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name as keyof ConsultationFormData];
        return updatedErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Prepare payload with user and attorney details
    const payload = {
      userId: user?.id || null,
      userName: user?.name || formData.fullName,
      userEmail: user?.email || formData.email,
      attorneyId: attorney?.id || passedAttorneyInfo.attorneyId,
      attorneyName: attorneyName,
      ...formData,
    };

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmissionSuccess(true);
      } else {
        const data = await res.json();
        alert('Failed to schedule: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to schedule: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!attorney && !passedAttorneyInfo.attorneyName) {
    return ( /* ... (Not Found content remains the same) ... */
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Attorney Not Found</h1>
        <p className="text-textColor mb-8">Sorry, we couldn't find details for the selected attorney.</p>
        <Link to="/attorneys" className="text-accent hover:underline font-semibold inline-flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Back to Attorney Directory
        </Link>
      </div>
    );
  }

  if (submissionSuccess) {
    return ( /* ... (Success message content remains the same) ... */
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto py-20 px-4 text-center"
        >
            <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-primary mb-4">Consultation Requested!</h1>
            <p className="text-textColor mb-8 max-w-md mx-auto">
                Your request to consult with <span className="font-semibold">{attorneyName}</span> has been submitted.
                They (or our team) will contact you shortly at {formData.email} or {formData.phone} to confirm the details.
            </p>
            <Link to="/attorneys" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors shadow-md">
                Back to Attorney Directory
            </Link>
        </motion.div>
    );
  }

  // Only show modal and block form if not logged in
  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 md:py-16">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-primary mb-4">Please log in to continue</h3>
            <p className="mb-6 text-gray-600">You need to be logged in to schedule a consultation.</p>
            <button
              onClick={() => window.location.href = '/signin'}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-accent transition mb-2"
            >
              Log in
            </button>
            <button
              onClick={() => window.location.href = '/attorneys'}
              className="w-full py-2 text-gray-500 hover:text-primary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-100 min-h-screen py-12 md:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
            to="/attorneys"
            className="inline-flex items-center text-accent hover:text-primary font-semibold mb-8 group transition-colors text-sm"
        >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Attorney Directory
        </Link>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                {attorney?.photoUrl ? (
                    <img src={attorney.photoUrl} alt={attorneyName} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-accent shadow-md"/>
                ) : (
                    <UserCircle size={64} className="mx-auto text-primary mb-4" />
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    Schedule Consultation
                </h1>
                <p className="text-lg text-textColor">
                    with <span className="font-semibold text-accent">{attorneyName}</span>
                </p>
                 {attorney && <p className="text-sm text-gray-500 mt-1">{attorney.specialization.join(' | ')}</p>}
            </div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y:20 }}
                animate={{ opacity: 1, y:0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-6" // This adds vertical spacing between FormField components
            >
                <FormField
                    id="fullName" label="Your Full Name" type="text"
                    value={formData.fullName} onChange={handleChange}
                    error={errors.fullName} required
                />
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-6"> {/* Ensure gap-y for vertical spacing in grid */}
                    <FormField
                        id="email" label="Your Email Address" type="email"
                        value={formData.email} onChange={handleChange}
                        error={errors.email} required
                    />
                    <FormField
                        id="phone" label="Your Phone Number" type="tel"
                        value={formData.phone} onChange={handleChange}
                        error={errors.phone} required
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {attorney && attorney.specialization.length > 0 && (
                     <FormField
                        id="caseType"
                        label="Primary Area of Assistance"
                        type="select"
                        value={formData.caseType || ''}
                        onChange={handleChange}
                        options={attorney.specialization.map(spec => ({ value: spec, label: spec }))}
                        required
                        error={errors.caseType}
                    />
                )}

                <FormField
                    id="reasonForConsult" label="Briefly describe your legal matter"
                    type="textarea"
                    value={formData.reasonForConsult} onChange={handleChange} rows={5}
                    error={errors.reasonForConsult} required
                    placeholder="Please provide some context about your situation or questions."
                />

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                    <FormField
                        id="preferredDate" label="Preferred Date (Optional)" type="date"
                        value={formData.preferredDate || ''} onChange={handleChange}
                        required={false}
                    />
                    <FormField
                        id="preferredTime" label="Preferred Time (Optional)" type="time"
                        value={formData.preferredTime || ''} onChange={handleChange}
                        required={false}
                    />
                </div>
                <p className="text-xs text-gray-500 -mt-4"> {/* Negative margin to pull note closer */}
                    Note: Preferred date/time are subject to attorney availability. We will contact you to confirm.
                </p>


                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-accent-dark transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center justify-center disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <>
                            <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                            />
                            Submitting Request...
                        </>
                    ) : (
                        "Request Consultation"
                    )}
                </button>
            </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleConsultationPage;