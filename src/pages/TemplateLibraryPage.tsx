// src/pages/TemplateLibraryPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FileText, ShieldCheck, Settings2, RotateCcw, Users, Tv2, UserCheck, Search, Filter, ArrowDownUp } from 'lucide-react'; // Added more specific icons

// Updated mockTemplates based on your document list
const mockTemplates = [
    {
        id: 'nda',
        category: 'Business & Confidentiality',
        name: 'Non-Disclosure Agreement (NDA)',
        description: 'Protect confidential information when sharing sensitive details with another party.',
        tags: ['confidentiality', 'nda', 'business', 'legal contract'],
        icon: <FileText size={24} className="text-primary" />,
        path: '/documents/generate/nda' // Path to its dedicated generator (for internal use if user is logged in)
    },
    {
        id: 'privacy-policy',
        category: 'Website & Compliance',
        name: 'Privacy Policy',
        description: 'Outline how your business collects, uses, and protects user personal data for your website or app.',
        tags: ['privacy', 'compliance', 'gdpr', 'ccpa', 'website', 'legal'],
        icon: <ShieldCheck size={24} className="text-primary" />,
        path: '/documents/generate/privacy-policy'
    },
    {
        id: 'cookies-policy',
        category: 'Website & Compliance',
        name: 'Cookies Policy',
        description: 'Inform users about the cookies your website uses and how they can manage them.',
        tags: ['cookies', 'website', 'compliance', 'privacy', 'gdpr'],
        icon: <Settings2 size={24} className="text-primary" />,
        path: '/documents/generate/cookies-policy'
    },
    {
        id: 'refund-policy',
        category: 'E-commerce & Business',
        name: 'Refund Policy',
        description: 'Define the terms and conditions for product or service refunds and exchanges for your customers.',
        tags: ['refund', 'return', 'ecommerce', 'customer service', 'business terms'],
        icon: <RotateCcw size={24} className="text-primary" />,
        path: '/documents/generate/refund-policy'
    },
    {
        id: 'power-of-attorney',
        category: 'Personal & Legal',
        name: 'Power of Attorney (PoA)',
        description: 'Grant legal authority to another person (agent) to act on your behalf in specified matters.',
        tags: ['poa', 'legal representative', 'agent', 'personal affairs', 'financial'],
        icon: <Users size={24} className="text-primary" />,
        path: '/documents/generate/power-of-attorney'
    },
    {
        id: 'website-services-agreement',
        category: 'Business & Services',
        name: 'Website Services Agreement',
        description: 'Formalize terms for website design, development, or maintenance services between a provider and a client.',
        tags: ['services', 'contract', 'freelance', 'web development', 'agency'],
        icon: <Tv2 size={24} className="text-primary" />,
        path: '/documents/generate/website-services-agreement'
    },
    {
        id: 'eula',
        category: 'Software & Technology',
        name: 'End User License Agreement (EULA)',
        description: 'Set the terms under which users are granted a license to use your software product.',
        tags: ['eula', 'software', 'license', 'legal terms', 'technology'],
        icon: <UserCheck size={24} className="text-primary" />,
        path: '/documents/generate/eula'
    },
];

// Animation variants
const sectionVariants = { /* ... (same) ... */ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }};
const cardVariants = { /* ... (same) ... */  hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }};


const TemplateLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate(); // For programmatic navigation if needed

  const filteredAndSortedTemplates = mockTemplates
    .filter(template => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = template.name.toLowerCase().includes(lowerSearchTerm) ||
                            template.description.toLowerCase().includes(lowerSearchTerm) ||
                            template.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      // Add more sorting if needed (e.g., by a 'dateAdded' field if you add it)
      return 0;
    });

  // Get unique categories for the filter dropdown
  const categories = ['All', ...new Set(mockTemplates.map(t => t.category))].sort();

  // Handle "Use Now" click - now navigates to signup
  // We can pass the intended template as state or query param to signup page
  const handleUseTemplate = (templateId: string, templateName: string) => {
    // Example: Navigating to signup and passing template info via state
    // The signup page can then access this state via `useLocation()`
    navigate('/signup', { state: { intendedTemplateId: templateId, intendedTemplateName: templateName } });
  };


  return (
     <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}} // Adjusted stagger
      className="py-8"
    >
        <motion.section variants={sectionVariants} className="text-center py-12 md:py-16 bg-gradient-to-br from-primary/5 via-lightGray to-accent/5 rounded-b-3xl md:rounded-b-[50px] mb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Legal Template Library
            </h1>
            <p className="text-lg sm:text-xl text-textColor mb-0 max-w-3xl mx-auto leading-relaxed">
                Browse our extensive collection of professionally drafted legal templates. Find the right document for your needs and get started quickly.
            </p>
        </motion.section>

        <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 p-6 bg-white rounded-xl shadow-lg border border-lightGray">
            <div className="flex items-center mb-6">
                <Filter size={28} className="text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-primary">Find Your Template</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="template-search" className="block text-sm font-medium text-textColor mb-1">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            id="template-search" type="text" placeholder="Keywords, name..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor"
                        />
                    </div>
                </div>

                 <div>
                     <label htmlFor="template-category" className="block text-sm font-medium text-textColor mb-1">Category</label>
                     <select
                         id="template-category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                         className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor bg-white appearance-none" // Added appearance-none for custom arrow later if needed
                     >
                         {categories.map(category => (
                             <option key={category} value={category}>{category}</option>
                         ))}
                     </select>
                 </div>

                 <div>
                     <label htmlFor="template-sort" className="block text-sm font-medium text-textColor mb-1">Sort By</label>
                     <div className="relative">
                        <select
                            id="template-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor bg-white appearance-none"
                        >
                            <option value="name">Name (A-Z)</option>
                            <option value="category">Category</option>
                            {/* <option value="newest">Newest</option> */}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ArrowDownUp size={18} className="text-gray-400" />
                        </div>
                     </div>
                 </div>
            </div>
        </motion.section>


       <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-primary mb-8">
                Available Templates <span className="text-lg text-textColor font-normal">({filteredAndSortedTemplates.length} found)</span>
            </h2>
            {filteredAndSortedTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredAndSortedTemplates.map(template => (
                        <motion.div
                            key={template.id}
                            variants={cardVariants}
                            className="bg-white rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-gray-200 flex flex-col group transform hover:-translate-y-1"
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    {template.icon}
                                    <h3 className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{template.name}</h3>
                                </div>
                                <p className="text-textColor text-sm mb-4 leading-relaxed min-h-[60px]">{template.description}</p>
                                <div className="mt-auto pt-2">
                                    <span className="text-xs text-gray-500 bg-lightGray px-2 py-1 rounded-full">{template.category}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-5 border-t border-gray-200 rounded-b-xl">
                                {/* THIS IS THE CORRECTED BUTTON */}
                                <button
                                    onClick={() => handleUseTemplate(template.id, template.name)}
                                    className="w-full bg-accent text-white px-6 py-2.5 rounded-lg text-md font-semibold hover:bg-accent-dark transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                                >
                                    Use Template →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                // ... (No templates found message remains the same) ...
                <motion.div variants={cardVariants} className="text-center py-16 text-textColor/80 italic text-lg bg-lightGray rounded-xl">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    No templates match your criteria.
                    <br />
                    Please adjust your search or filters, or{' '}
                    <Link to="/contact" className="text-accent hover:underline font-semibold">
                        request a template
                    </Link>.
                </motion.div>
            )}
       </motion.section>
    </motion.div>
    

  );
};

export default TemplateLibraryPage;