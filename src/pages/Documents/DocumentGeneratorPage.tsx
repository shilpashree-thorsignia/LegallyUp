import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Shield, ShieldCheck, FileKey, Tv, UserCheck, RotateCcw, Settings, Users } from 'lucide-react'; // Example icons

// Define your document types with paths to their dedicated generator pages
const documentTypes = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Protect confidential information when sharing sensitive details with another party.',
    path: '/Documents/generate/nda', // Path to the dedicated NDA generation page
    icon: <FileKey size={32} className="text-accent group-hover:text-primary transition-colors" />,
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Outline how your business collects, uses, and protects user personal data.',
    path: '/Documents/generate/privacy-policy',
    icon: <ShieldCheck size={32} className="text-accent group-hover:text-primary transition-colors" />,
  },
  {
    id: 'cookies-policy',
    name: 'Cookies Policy',
    description: 'Inform users about the cookies your website uses and how they can manage them.',
    path: '/Documents/generate/cookies-policy',
    icon: <Settings size={32} className="text-accent group-hover:text-primary transition-colors" />, // Cookie icon might be better
  },
  {
    id: 'refund-policy',
    name: 'Refund Policy',
    description: 'Define the terms and conditions for product or service refunds and exchanges.',
    path: '/Documents/generate/refund-policy',
    icon: <RotateCcw size={32} className="text-accent group-hover:text-primary transition-colors" />,
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney (PoA)',
    description: 'Grant legal authority to another person to act on your behalf in specified matters.',
    path: '/Documents/generate/power-of-attorney',
    icon: <Users size={32} className="text-accent group-hover:text-primary transition-colors" />,
  },
  {
    id: 'website-services-agreement',
    name: 'Website Services Agreement',
    description: 'Formalize the terms for website design, development, or maintenance services.',
    path: '/Documents/generate/website-services-agreement',
    icon: <Tv size={32} className="text-accent group-hover:text-primary transition-colors" />,
  },
  {
    id: 'eula',
    name: 'End User License Agreement (EULA)',
    description: 'Set the terms under which users are granted a license to use your software product.',
    path: '/Documents/generate/eula',
    icon: <UserCheck size={32} className="text-accent group-hover:text-primary transition-colors" />,
  },
  // Add more document types as needed
];

// Animation variants for sections and elements
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const DocumentGeneratorPage: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1, // Stagger the intro text and the grid
          },
        },
      }}
      className="container mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8"
    >
      <motion.h1
        variants={sectionVariants}
        className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center"
      >
        Document Generator
      </motion.h1>

      <motion.p
        variants={sectionVariants}
        className="text-lg md:text-xl text-textColor leading-relaxed mb-10 md:mb-16 text-center max-w-3xl mx-auto"
      >
        Choose from our library of professionally crafted legal templates. Select a document type below to start customizing it to your specific needs.
      </motion.p>

      <motion.div
        variants={{
          visible: { transition: { staggerChildren: 0.07 } } // Stagger individual cards
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {documentTypes.map(docType => (
          <motion.div
            key={docType.id}
            variants={cardVariants}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-lightGray overflow-hidden flex flex-col"
          >
            <div className="p-6 md:p-8 flex-grow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-semibold text-primary">{docType.name}</h3>
                {docType.icon}
              </div>
              <p className="text-textColor text-sm leading-relaxed mb-6">{docType.description}</p>
            </div>
            <div className="bg-lightGray/50 p-5 border-t border-lightGray">
              <Link
                to={docType.path}
                className="inline-flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-lg text-md font-semibold hover:bg-accent transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100"
              >
                Generate {docType.name.split('(')[0].trim()}
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-16 text-center">
        <p className="text-textColor">
          Can't find what you're looking for?{' '}
          <Link to="/contact" className="text-accent hover:underline font-semibold">
            Contact Us
          </Link>{' '}
          for assistance or custom document requests.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DocumentGeneratorPage;