// src/pages/TemplateLibraryPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, ShieldCheck, Settings2, RotateCcw, Users, Tv2, UserCheck,
  Search, Filter as FilterIcon, ArrowDownUp, Layers, ChevronRight, Inbox
} from 'lucide-react';

// mockTemplates (assuming it's defined as in your previous LegalResourcesPage version, with slug, icon, content etc.)
const mockTemplates = [
    { id: 'nda', category: 'Business & Confidentiality', name: 'Non-Disclosure Agreement (NDA)', description: 'Protect confidential information when sharing sensitive details with another party.', tags: ['confidentiality', 'nda', 'business', 'legal contract'], icon: <FileText size={28} className="text-blue-600" />, path: '/documents/generate/nda' },
    { id: 'privacy-policy', category: 'Website & Compliance', name: 'Privacy Policy', description: 'Outline how your business collects, uses, and protects user personal data for your website or app.', tags: ['privacy', 'compliance', 'gdpr', 'ccpa', 'website', 'legal'], icon: <ShieldCheck size={28} className="text-green-600" />, path: '/documents/generate/privacy-policy' },
    { id: 'cookies-policy', category: 'Website & Compliance', name: 'Cookies Policy', description: 'Inform users about the cookies your website uses and how they can manage them.', tags: ['cookies', 'website', 'compliance', 'privacy', 'gdpr'], icon: <Settings2 size={28} className="text-purple-600" />, path: '/documents/generate/cookies-policy' },
    { id: 'refund-policy', category: 'E-commerce & Business', name: 'Refund Policy', description: 'Define the terms and conditions for product or service refunds and exchanges for your customers.', tags: ['refund', 'return', 'ecommerce', 'customer service', 'business terms'], icon: <RotateCcw size={28} className="text-orange-600" />, path: '/documents/generate/refund-policy' },
    { id: 'power-of-attorney', category: 'Personal & Legal', name: 'Power of Attorney (PoA)', description: 'Grant legal authority to another person (agent) to act on your behalf in specified matters.', tags: ['poa', 'legal representative', 'agent', 'personal affairs', 'financial'], icon: <Users size={28} className="text-teal-600" />, path: '/documents/generate/power-of-attorney' },
    { id: 'website-services-agreement', category: 'Business & Services', name: 'Website Services Agreement', description: 'Formalize terms for website design, development, or maintenance services between a provider and a client.', tags: ['services', 'contract', 'freelance', 'web development', 'agency'], icon: <Tv2 size={28} className="text-indigo-600" />, path: '/documents/generate/website-services-agreement' },
    { id: 'eula', category: 'Software & Technology', name: 'End User License Agreement (EULA)', description: 'Set the terms under which users are granted a license to use your software product.', tags: ['eula', 'software', 'license', 'legal terms', 'technology'], icon: <UserCheck size={28} className="text-pink-600" />, path: '/documents/generate/eula' },
];


// Animation Variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }, // Stagger direct children: Hero, Filter, Main Content Section
  exit: { opacity: 0 }
};

// Variants for main content blocks like Hero, Filter Section, Template Grid Section
const contentBlockVariants = { // <<< DEFINED HERE
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const itemVariants = { // For items within a content block, like text in hero, or individual filter elements
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardGridVariants = { // To stagger the cards within their container
  hidden: { opacity: 0 }, // Grid container itself can be simple
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } // Stagger cards after grid is visible
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.5 } },
  hover: {
    y: -10,
    boxShadow: "0px 20px 40px -15px rgba(var(--color-primary-rgb, 29 78 216), 0.2)",
    transition: { type: "spring", stiffness: 250, damping: 10 }
  }
};


const TemplateLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  // ... (filteredAndSortedTemplates logic remains the same)
  const filteredAndSortedTemplates = mockTemplates
    .filter(template => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = template.name.toLowerCase().includes(lowerSearchTerm) ||
                            template.description.toLowerCase().includes(lowerSearchTerm) ||
                            template.category.toLowerCase().includes(lowerSearchTerm) ||
                            template.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });


  const categories = ['All', ...new Set(mockTemplates.map(t => t.category))].sort();

  const handleUseTemplate = (templateId: string, templateName: string) => {
    navigate('/signup', { state: { intendedTemplateId: templateId, intendedTemplateName: templateName } });
  };


  return (
     <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants} // Overall page animation
      className="bg-gray-100 min-h-screen"
    >
        {/* Hero Section */}
        <motion.section
            className="relative min-h-[50vh] md:min-h-[60vh] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white px-6 py-16 md:py-24 overflow-hidden rounded-b-[30px] md:rounded-b-[50px] shadow-xl mb-12"
            variants={contentBlockVariants} // Animate this whole block
        >
            {/* ... (Hero content remains the same) ... */}
            <div className="absolute inset-0 opacity-[0.03]">
                <Layers size={500} className="absolute -bottom-20 -left-40 transform rotate-12" />
                <FileText size={400} className="absolute -top-32 -right-32 transform -rotate-12" />
            </div>
            <motion.div
                // Removed variants from here, parent section handles entry
                // Stagger children directly if needed, or use simpler itemVariants
                variants={{ visible: {transition: {staggerChildren: 0.15}}}} // Stagger hero items
                className="relative z-10 text-center max-w-4xl mx-auto"
            >
                <motion.div variants={itemVariants} className="mb-8">
                    <Layers size={72} className="mx-auto opacity-90" strokeWidth={1.5}/>
                </motion.div>
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter"
                    style={{ textShadow: '0 3px 12px rgba(0,0,0,0.25)'}}
                >
                    Legal Template Library
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed text-white/90"
                >
                    Browse our extensive collection of professionally drafted legal templates. Find the right document for your needs and get started quickly.
                </motion.p>
            </motion.div>
        </motion.section>

        {/* Filter & Search Bar Section */}
        <motion.div
            variants={contentBlockVariants} // Animate this whole block
            className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16"
        >
            {/* ... (Filter bar content remains the same, can use itemVariants for individual filter elements if desired) ... */}
             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                        <FilterIcon size={28} className="text-primary mr-3" />
                        <h2 className="text-2xl font-semibold text-primary">Find Your Template</h2>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {filteredAndSortedTemplates.length} of {mockTemplates.length} templates
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                    {/* Search */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <label htmlFor="template-search" className="block text-sm font-medium text-gray-700 mb-1.5">Search Templates</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
                            <input id="template-search" type="text" placeholder="e.g., NDA, Lease, Privacy..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3.5 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-gray-700 shadow-sm transition-shadow hover:shadow-md"/>
                        </div>
                    </motion.div>
                    {/* Category */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="template-category" className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                        <select id="template-category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none transition-shadow hover:shadow-md">
                            {categories.map(category => (<option key={category} value={category}>{category}</option>))}
                        </select>
                    </motion.div>
                    {/* Sort By */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="template-sort" className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
                        <div className="relative">
                        <select id="template-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none transition-shadow hover:shadow-md">
                            <option value="name">Name (A-Z)</option>
                            <option value="category">Category</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none"><ArrowDownUp size={18} className="text-gray-400" /></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>

        {/* Template Grid Section */}
       <motion.section
            variants={contentBlockVariants} // Animate this whole block
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-primary mb-8"> {/* Animate title */}
                Available Templates <span className="text-lg text-textColor font-normal">({filteredAndSortedTemplates.length} found)</span>
            </motion.h2>
            {filteredAndSortedTemplates.length > 0 ? (
                <motion.div
                    variants={cardGridVariants} // This will stagger children with 'cardItemVariants'
                    initial="hidden" // Explicitly set initial/animate for the grid container
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                >
                    {filteredAndSortedTemplates.map(template => (
                        <motion.div
                            key={template.id}
                            variants={cardItemVariants} // Individual card animation + hover
                            // whileHover="hover" // This is now part of cardItemVariants
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col group overflow-hidden transform transition-all duration-300 hover:border-accent hover:-translate-y-2 hover:shadow-primary/20" // Combined hover effects
                        >
                            {/* ... (Card content remains the same) ... */}
                            <div className="p-6 md:p-8 flex-grow">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-primary/10 to-accent/10 text-primary rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                                        {React.cloneElement(template.icon, { size: 32, strokeWidth: 1.5 })}
                                    </div>
                                    <div>
                                        <h3 className="text-xl lg:text-2xl font-semibold text-primary group-hover:text-accent transition-colors duration-300 leading-tight mb-1">
                                            {template.name}
                                        </h3>
                                        <span className="text-xs text-gray-500 font-medium bg-gray-100 group-hover:bg-gray-200 px-2.5 py-1 rounded-full transition-colors duration-300">
                                            {template.category}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[70px] line-clamp-3">
                                    {template.description}
                                </p>
                            </div>
                            <div className="mt-auto border-t border-gray-200">
                                <button
                                    onClick={() => handleUseTemplate(template.id, template.name)}
                                    className="flex items-center justify-between w-full bg-gray-50 group-hover:bg-accent px-6 py-4 text-md font-semibold text-accent group-hover:text-white transition-all duration-300 rounded-b-2xl"
                                >
                                    <span>Use This Template</span>
                                    <ChevronRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    variants={itemVariants} // Animate the "no results" message
                    className="text-center py-20 px-6 text-gray-600 italic text-lg bg-white rounded-2xl shadow-md border border-gray-200"
                >
                    {/* ... (No templates found message remains the same) ... */}
                    <Inbox size={64} className="mx-auto mb-6 text-gray-400" strokeWidth={1.5}/>
                    <p className="text-xl font-semibold text-gray-700 mb-2">No Templates Found</p>
                    <p>We couldn't find any templates matching your current search and filter criteria.
                    <br />
                    Try adjusting your terms or{' '}
                    <Link to="/contact" className="text-accent hover:underline font-semibold">
                        request a specific template
                    </Link>.
                    </p>
                </motion.div>
            )}
       </motion.section>
    </motion.div>
  );
};

export default TemplateLibraryPage;