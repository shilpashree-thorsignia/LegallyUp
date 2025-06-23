// src/pages/DocumentGeneratorPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Settings2, RotateCcw, Users, Tv2, UserCheck, ChevronRight, Layers, Zap } from 'lucide-react'; // Added Zap for CTA


// Document types data (ensure paths are correct for your routing)
const documentTypes = [
  { id: 'nda', name: 'Non-Disclosure Agreement (NDA)', description: 'Protect confidential information shared with others.', path: '/documents/generate/nda', icon: <FileText size={28} /> },
  { id: 'privacy-policy', name: 'Privacy Policy', description: 'Outline how your business collects, uses, and protects user personal data.', path: '/documents/generate/privacy-policy', icon: <ShieldCheck size={28} /> },
  { id: 'cookies-policy', name: 'Cookies Policy', description: 'Inform users about the cookies your website uses and how they can manage them.', path: '/documents/generate/cookies-policy', icon: <Settings2 size={28} /> },
  { id: 'refund-policy', name: 'Refund Policy', description: 'Define terms for product/service refunds and exchanges.', path: '/documents/generate/refund-policy', icon: <RotateCcw size={28} /> },
  { id: 'power-of-attorney', name: 'Power of Attorney (PoA)', description: 'Grant legal authority to another person to act on your behalf.', path: '/documents/generate/power-of-attorney', icon: <Users size={28} /> },
  { id: 'website-services-agreement', name: 'Website Services Agreement', description: 'Formalize terms for website design, development, or maintenance.', path: '/documents/generate/website-services-agreement', icon: <Tv2 size={28} /> },
  { id: 'eula', name: 'End User License Agreement (EULA)', description: 'Set terms for users to license and use your software product.', path: '/documents/generate/eula', icon: <UserCheck size={28} /> },
];

// Simplified Animation Variants - No layout-affecting transforms
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0 }
};

const heroContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
};

const heroItemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const cardItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  hover: {
    // Use only transform that doesn't affect layout
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

const ctaSectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const DocumentGeneratorPage: React.FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-gray-100 min-h-screen"
    >
      {/* Full Screen Hero Section - No curves or padding */}
      <motion.section
        className="w-full h-screen bg-logoBlue text-white overflow-hidden relative flex items-center justify-center"
        variants={heroContentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="patt" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="50" cy="50" r="1.5" fill="currentColor"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#patt)"/>
            </svg>
        </div>
        <div className="w-full relative z-10 text-center">
          <motion.div variants={heroItemVariants} className="mb-8">
            <Layers size={72} className="mx-auto opacity-90" strokeWidth={1.2} />
          </motion.div>
          <motion.h1
            variants={heroItemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter text-gray-900"
            style={{ 
              textShadow: '0 3px 10px rgba(0,0,0,0.2)',
              fontOpticalSizing: 'auto' // Prevent font shifts
            }}
          >
            Document Builder
          </motion.h1>
          <motion.p
            variants={heroItemVariants}
            className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Select a professionally crafted legal template below. Our intuitive builder will guide you through customizing it to perfectly match your specific needs.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content Area with Template Grid */}
      <div className="relative z-20 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {documentTypes.map(docType => (
              <motion.div
                key={docType.id}
                variants={cardItemVariants}
                whileHover="hover"
                className="bg-white rounded-2xl shadow-xl hover:shadow-primary/20 border border-gray-200 flex flex-col overflow-hidden group cursor-pointer transition-shadow duration-300"
                style={{
                  // Prevent layout shifts from transform
                  transformOrigin: 'center',
                  willChange: 'transform'
                }}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3.5 bg-accent/10 text-accent rounded-xl mr-4 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                      {React.cloneElement(docType.icon, { size: 30, strokeWidth: 2 })}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-semibold text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                      {docType.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 h-[60px] group-hover:text-gray-700">
                    {docType.description}
                  </p>
                </div>
                <div className="mt-auto border-t border-gray-200">
                  <Link
                    to={docType.path}
                    className="flex items-center justify-between w-full bg-gray-50 group-hover:bg-accent px-6 py-4 text-md font-semibold text-accent group-hover:text-white transition-all duration-300 rounded-b-2xl"
                  >
                    <span>Generate Document</span>
                    <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Optimized Call to Action Section */}
      <motion.section
        variants={ctaSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-100"
      >
        <div className="container mx-auto">
          <div
            className="
              relative overflow-hidden
              bg-gradient-to-tr from-primary to-accent
              text-white
              rounded-3xl md:rounded-[40px]
              p-10 sm:p-16 md:p-20
              shadow-2xl
              text-center
              max-w-4xl
              mx-auto
            "
          >
            {/* Decorative elements with fixed positioning to prevent shifts */}
            <div className="absolute -top-8 -left-8 text-white/10 opacity-50 pointer-events-none">
              <Zap size={80} className="transform rotate-[25deg]" />
            </div>
            <div className="absolute -bottom-10 -right-10 text-white/10 opacity-50 pointer-events-none">
              <FileText size={100} className="transform -rotate-[15deg]" />
            </div>

            <motion.div variants={heroItemVariants} className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                    Can't Find What You Need?
                </h2>
                <p className="text-md sm:text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
                    Our template library is always growing. If you don't see the exact document you're looking for, or if you need specialized assistance, don't hesitate to reach out.
                </p>
                <Link
                to="/contact"
                className="
                    inline-block bg-white text-primary
                    px-12 py-4 sm:px-16 sm:py-5
                    rounded-xl
                    text-lg sm:text-xl font-bold
                    hover:bg-gray-200
                    transition-colors duration-300
                    shadow-xl
                    transform hover:scale-105 active:scale-100
                "
                >
                Contact Us
                </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default DocumentGeneratorPage;