// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Send, Mail, Phone, ExternalLink, MessageSquare, Facebook, Twitter, Linkedin, Instagram, HelpCircle } from 'lucide-react';
import FormField from '../components/forms/FormField'; // Assuming you have this reusable component

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0 }
};

const contentBlockVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Note: FormField component needs to accept and display an 'error' prop for validation messages to show.

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Your name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Your email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.subject.trim()) newErrors.subject = "A subject line helps us categorize your inquiry.";
        if (!formData.message.trim()) {
            newErrors.message = "Please enter your message.";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Your message should be at least 10 characters long to provide enough detail.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        // Simulate API call / Email sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Form Data Submitted:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        setTimeout(() => setSubmitSuccess(false), 6000); // Hide success message after 6s
    };

    // Define CSS variables in a style tag or your global CSS for gradients


  return (
     <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-gray-100 min-h-screen"
    >
        {/* Hero Section */}
        <motion.section
            variants={contentBlockVariants}
            className="relative text-center py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-white rounded-b-[30px] md:rounded-b-[60px] shadow-xl mb-16 px-4"
        >
            <div className="absolute inset-0 opacity-[0.03]"> {/* Subtle pattern */}
                <Mail size={500} className="absolute -bottom-20 -left-40 transform rotate-12" />
                <MessageSquare size={400} className="absolute -top-32 -right-32 transform -rotate-12" />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div variants={itemVariants} className="mb-8">
                    <MessageSquare size={72} className="mx-auto opacity-90" strokeWidth={1.5}/>
                </motion.div>
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter"
                    style={{ textShadow: '0 3px 12px rgba(0,0,0,0.25)'}}
                >
                    Get in Touch
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
                >
                    We're here to help! Whether you have questions, feedback, or need support, please don't hesitate to reach out to our dedicated team.
                </motion.p>
            </div>
        </motion.section>

      {/* Contact Form and Info Section - MODIFIED */}
<motion.section
    variants={contentBlockVariants} // Assuming contentBlockVariants is defined in your page
    className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 mb-16 md:mb-20"
>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-16 items-start">
        {/* Contact Form - Takes more space (lg:col-span-3) */}
        <motion.div
            variants={itemVariants} // Assuming itemVariants is defined
            className="lg:col-span-3 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 tracking-tight">Send Us a Message</h2>
            {submitSuccess && ( // Assuming submitSuccess state exists
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10}}
                    className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md text-center"
                    role="alert"
                >
                    <p className="font-medium">Thank you! Your message has been sent successfully.</p>
                    <p className="text-sm">We'll be in touch as soon as possible.</p>
                </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6"> {/* Assuming handleSubmit and formData state exist */}
                <FormField id="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} required />
                <FormField id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                <FormField id="subject" label="Subject" value={formData.subject} onChange={handleChange} error={errors.subject} required placeholder="e.g., Question about Pro Plan, Feedback"/>
                <FormField id="message" label="Your Message" type="textarea" value={formData.message} onChange={handleChange} rows={6} error={errors.message} required placeholder="Please describe your inquiry in detail..."/>
                <button
                    type="submit"
                    disabled={isSubmitting} // Assuming isSubmitting state exists
                    className="w-full flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-xl hover:bg-accent-dark transition-colors duration-300 font-semibold text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                        <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
                        Sending Message...
                        </>
                    ) : (
                        <> <Send size={20} className="mr-2" /> Send Message </>
                    )}
                </button>
            </form>
        </motion.div>

        {/* Contact Info - MODIFIED - Takes less space (lg:col-span-2) & Different Content */}
        <motion.div
            variants={itemVariants} // Assuming itemVariants is defined
            className="lg:col-span-2  p-8 md:p-10 rounded-2xl shadow-xl text-accent sticky top-28 space-y-10" // Gradient BG, sticky
        >
            {/* <div>
                <div className="flex items-center mb-4">
                    <Building2 size={36} className="mr-4 opacity-80" />
                    <h3 className="text-2xl md:text-3xl font-bold">Our Headquarters</h3>
                </div>
                <address className="not-italic text-textColor/80 leading-relaxed text-lg">
                    LegallyUp Inc.<br/>
                    123 Legal Innovation Drive<br/>
                    Suite 456, Tech Park<br/>
                    Lawsville, Juris 98765<br/>
                    United States
                </address>
                <Link 
                    to="/about#our-location" // Example: Link to a map section on about page
                    className="inline-flex items-center text-textColor hover:text-textColor/80 underline mt-3 text-sm font-medium"
                >
                    View on Map (Conceptual) <ExternalLink size={14} className="ml-1" />
                </Link>
            </div> */}

            <div className="border-t border-textColor/20 pt-8">
                <div className="flex items-center mb-4">
                    <Mail size={36} className="mr-4 opacity-80" />
                    <h3 className="text-2xl md:text-3xl font-bold">Connect via Email</h3>
                </div>
                <div className="space-y-2">
                    <p className="text-textColor/80">
                        <strong className="text-textColor">General Inquiries:</strong><br/>
                        <a href="mailto:info@legallyup.com" className="hover:underline font-medium">info@legallyup.com</a>
                    </p>
                    <p className="text-textColor/80">
                        <strong className="text-textColor">Support & Assistance:</strong><br/>
                        <a href="mailto:support@legallyup.com" className="hover:underline font-medium">support@legallyup.com</a>
                    </p>
                    <p className="text-textColor/80">
                        <strong className="text-textColor">Partnerships:</strong><br/>
                        <a href="mailto:partners@legallyup.com" className="hover:underline font-medium">partners@legallyup.com</a>
                    </p>
                </div>
            </div>

            <div className="border-t border-textColor/20 pt-8">
                <div className="flex items-center mb-4">
                    <Phone size={36} className="mr-4 opacity-80" />
                    <h3 className="text-2xl md:text-3xl font-bold">Speak to Our Team</h3>
                </div>
                <p className="text-textColor/80">
                    <a href="tel:+11234567890" className="hover:underline font-medium text-xl">(123) 456-7890</a>
                </p>
                <p className="text-xs text-textColor/70 mt-1">(Mon-Fri, 9:00 AM - 5:00 PM)</p>
                <p className="text-sm text-textColor/80 mt-3">
                    For urgent matters, phone support is recommended.
                </p>
            </div>
            
            {/* Optional: Social Links here if not in global footer */}
            <div className="border-t border-textColor/20 pt-8">
                <h4 className="text-xl font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                    {/* Replace # with actual links */}
                    <a href="#" aria-label="Facebook" className="text-textColor/70 hover:text-textColor transition-colors"><Facebook size={24}/></a>
                    <a href="#" aria-label="Twitter" className="text-textColor/70 hover:text-textColor transition-colors"><Twitter size={24}/></a>
                    <a href="#" aria-label="LinkedIn" className="text-textColor/70 hover:text-textColor transition-colors"><Linkedin size={24}/></a>
                    <a href="#" aria-label="Instagram" className="text-textColor/70 hover:text-textColor transition-colors"><Instagram size={24}/></a>
                </div>
            </div>
        </motion.div>
    </div>
</motion.section>
        {/* Secondary "Need Immediate Assistance" CTA - Styled like the AboutPage CTA */}
        <motion.div
            variants={contentBlockVariants}
            className="py-16 md:py-20 px-4 sm:px-6 lg:px-8"
        >
            <div
            className="bg-gradient-to-br from-primary to-accent text-white rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-10 sm:p-12 md:p-16 lg:p-20 shadow-2xl text-center max-w-4xl mx-auto"
            >
            <motion.div variants={itemVariants} className="mb-6">
                <HelpCircle size={56} className="mx-auto opacity-90" strokeWidth={1.5}/>
            </motion.div>
            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight"
            >
                Need Quicker Assistance?
            </motion.h2>
            <motion.p
                variants={itemVariants}
                className="text-md sm:text-lg text-white/90 mb-10 max-w-xl mx-auto leading-relaxed"
            >
                Explore our comprehensive <Link to="/resources" className="font-semibold underline hover:text-white/70 transition-colors">Legal Resources</Link> or check our <Link to="/faq" className="font-semibold underline hover:text-white/70 transition-colors">FAQ page</Link> for instant answers to common questions.
            </motion.p>
            <motion.div variants={itemVariants}>
                <Link
                to="/resources" // Or a specific support/chat page
                className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 sm:px-14 sm:py-5 rounded-2xl text-lg sm:text-xl font-semibold hover:bg-gray-200 transition-colors duration-300 shadow-xl transform hover:scale-105 active:scale-100"
                >
                Explore Resources <ExternalLink size={20} />
                </Link>
            </motion.div>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default ContactPage;