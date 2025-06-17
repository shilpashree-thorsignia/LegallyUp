// src/pages/TemplateLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, ShieldCheck, Settings2, RotateCcw, Users, Tv2, UserCheck,
  Layers, ChevronRight, Trash2, Undo2
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
    // setLoading(true);
    const fetchTemplates = async () => {
      const url = showTrash ? `/api/templates/trash?user_id=${user.id}` : `/api/templates?user_id=${user.id}`;
      const res = await fetch(url);
      const data = await res.json();
      // if (showTrash) setTrashedTemplates(data.templates || []);
      // else setTemplates(data.templates || []);
      // setLoading(false);
    };
    fetchTemplates();
  }, [user, showTrash]);

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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter"
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
                className="bg-white rounded-2xl shadow-xl hover:shadow-primary/20 border border-gray-200 flex flex-col overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3.5 bg-accent/10 text-accent rounded-xl mr-4 group-hover:bg-accent group-hover:text-white transition-colors duration-300 transform group-hover:scale-105">
                      {React.cloneElement(docType.icon, { size: 30, strokeWidth: 2 })}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-semibold text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                      {docType.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px] line-clamp-3 group-hover:text-gray-700">
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
        </section>
        {/* Trash Toggle */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex justify-end">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showTrash ? 'bg-red-100 text-red-600' : 'bg-white text-primary'} shadow-sm hover:bg-red-50`}
            onClick={() => setShowTrash(t => !t)}
          >
            {showTrash ? <Undo2 size={18}/> : <Trash2 size={18}/>} {showTrash ? 'Restore from Trash' : 'View Trash'}
          </button>
        </div>
        {/* Template Grid Section */}
        {/* Removed user-generated templates section as requested */}
    </motion.div>
  );
};

export default TemplateLibraryPage;