// src/pages/TemplateLibraryPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, ShieldCheck, Settings2, RotateCcw, Users, Tv2, UserCheck,
  Layers, ChevronRight,
} from 'lucide-react';
import HeroBackground from '../components/ui/HeroBackground';


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const cardGridVariants = {
  visible: { transition: { staggerChildren: 0.07 } }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  hover: {
    y: -8,
    boxShadow: "0px 15px 30px -10px rgba(var(--color-primary-rgb, 29 78 216), 0.15)",
    transition: { type: "spring", stiffness: 300, damping: 10 }
  }
};

// Add the documentTypes array from DocumentGeneratorPage
const documentTypes = [
  { id: 'nda', name: 'Non-Disclosure Agreement (NDA)', description: 'Protect confidential information shared with others.', path: '/documents/generate/nda', icon: <FileText size={28} /> },
  { id: 'privacy-policy', name: 'Privacy Policy', description: 'Outline how your business collects, uses, and protects user personal data.', path: '/documents/generate/privacy-policy', icon: <ShieldCheck size={28} /> },
  { id: 'cookies-policy', name: 'Cookies Policy', description: 'Inform users about the cookies your website uses and how they can manage them.', path: '/documents/generate/cookies-policy', icon: <Settings2 size={28} /> },
  { id: 'refund-policy', name: 'Refund Policy', description: 'Define terms for product/service refunds and exchanges.', path: '/documents/generate/refund-policy', icon: <RotateCcw size={28} /> },
  { id: 'power-of-attorney', name: 'Power of Attorney (PoA)', description: 'Grant legal authority to another person to act on your behalf.', path: '/documents/generate/power-of-attorney', icon: <Users size={28} /> },
  { id: 'website-services-agreement', name: 'Website Services Agreement', description: 'Formalize terms for website design, development, or maintenance.', path: '/documents/generate/website-services-agreement', icon: <Tv2 size={28} /> },
  { id: 'eula', name: 'End User License Agreement (EULA)', description: 'Set terms for users to license and use your software product.', path: '/documents/generate/eula', icon: <UserCheck size={28} /> },
];

const TemplateLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    // Removed showTrash logic
  }, [user]);

  // Modal handler
  const handleGenerateClick = (path: string) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-gray-100 min-h-screen"
    >
      {/* Hero Section (matching homepage style) */}
      <motion.section
        className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white overflow-hidden rounded-b-[60px]"
        variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], delayChildren: 0.2, staggerChildren: 0.2 } } }}
        initial="hidden"
        animate="visible"
      >
        <HeroBackground />
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center">
              <Layers size={72} className="mx-auto opacity-90 text-white" strokeWidth={1.5} />
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-900"
            >
              Legal Document Templates
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Browse our comprehensive collection of professional legal templates. Find the perfect document for your needs.
            </motion.p>
          </div>
        </div>
      </motion.section>
      {/* Built-in Templates Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-primary mb-8">
          All Available Templates
        </h2>
        <motion.div
          variants={cardGridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8"
        >
          {documentTypes.map(docType => (
            <motion.div
              key={docType.id}
              variants={cardItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="group"
            >
              <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-[#4A90E2] to-[#2563eb] shadow-lg">
                  {React.cloneElement(docType.icon, { size: 28, strokeWidth: 2, className: 'text-white' })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{docType.name}</h3>
                <p className="text-gray-600 mb-4">{docType.description}</p>
                <div className="mt-auto">
                  <button
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors duration-200"
                    onClick={() => handleGenerateClick(docType.path)}
                  >
                    Generate Document <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-primary mb-4">Please log in to continue</h3>
            <p className="mb-6 text-gray-600">You need to be logged in to generate a template.</p>
            <button
              onClick={() => window.location.href = '/signin'}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-accent transition mb-2"
            >
              Log in
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="w-full py-2 text-gray-500 hover:text-primary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Template Grid Section */}
      {/* Removed user-generated templates section as requested */}
    </motion.div>
  );
};

export default TemplateLibraryPage;