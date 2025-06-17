// src/pages/TemplateLibraryPage.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, ShieldCheck, Settings2, RotateCcw, Users, Tv2, UserCheck,
  Layers, ChevronRight
} from 'lucide-react';

// Animation Variants
// const pageVariants = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }, // Stagger direct children: Hero, Filter, Main Content Section
//   exit: { opacity: 0 }
// };

// Variants for main content blocks like Hero, Filter Section, Template Grid Section
// const contentBlockVariants = { // <<< DEFINED HERE
//   hidden: { opacity: 0, y: 50 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] } },
// };

// const itemVariants = { // For items within a content block, like text in hero, or individual filter elements
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

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
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortBy, setSortBy] = useState('name');
//   const [templates, setTemplates] = useState<any[]>([]);
//   const [trashedTemplates, setTrashedTemplates] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    // Removed showTrash logic
  }, [user]);

//   const handleTrash = async (templateId: number) => {
//     await fetch(`/api/templates/${templateId}/trash`, { method: 'POST' });
//     setTemplates(templates.filter(t => t.id !== templateId));
//   };

//   const handleRestore = async (templateId: number) => {
//     await fetch(`/api/templates/${templateId}/restore`, { method: 'POST' });
//     setTrashedTemplates(trashedTemplates.filter(t => t.id !== templateId));
//   };

//   const filteredAndSortedTemplates = (showTrash ? trashedTemplates : templates)
//     .filter(template => {
//       const lowerSearchTerm = searchTerm.toLowerCase();
//       const matchesSearch = template.title.toLowerCase().includes(lowerSearchTerm) ||
//                             template.content.toLowerCase().includes(lowerSearchTerm);
//       // You can add category logic if you store categories
//       return matchesSearch;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'name') return a.title.localeCompare(b.title);
//       return 0;
//     });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="text-primary text-2xl font-bold mb-4">Please sign in to view your templates.</div>
        <Link to="/signin" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-accent transition-colors">Sign In</Link>
      </div>
    );
  }

  return (
     <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-gray-100 min-h-screen"
    >
        {/* Hero Section (matching /generate, but with template library content) */}
        <motion.section
          className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-white text-center overflow-hidden relative"
          variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], delayChildren: 0.2, staggerChildren: 0.2 } } }}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="patt" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="50" cy="50" r="1.5" fill="currentColor"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#patt)"/>
            </svg>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }} className="mb-8">
              <Layers size={72} className="mx-auto opacity-90" strokeWidth={1.2} />
            </motion.div>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter text-gray-900"
              style={{ textShadow: '0 3px 10px rgba(0,0,0,0.2)' }}
            >
              Template Library
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Browse all available legal templates and manage your saved documents. Instantly generate, edit, or restore templates as needed.
            </motion.p>
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
                    <Link
                      to={docType.path}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors duration-200"
                    >
                      Generate Document <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        {/* Template Grid Section */}
        {/* Removed user-generated templates section as requested */}
    </motion.div>
  );
};

export default TemplateLibraryPage;