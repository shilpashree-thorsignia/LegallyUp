// src/pages/LegalResourcesPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Placeholder data for resources (e.g., articles, FAQs, glossary terms)
const mockResources = [
    { id: 'faq-nda', type: 'FAQ', category: 'Contracts', title: 'What is an NDA?', summary: 'Explains the basics of a Non-Disclosure Agreement.' },
    { id: 'guide-rental', type: 'Guide', category: 'Real Estate', title: 'Guide to Creating a Rental Agreement', summary: 'Step-by-step instructions for landlords and tenants.' },
    { id: 'glossary-arbitration', type: 'Glossary', category: 'General', title: 'Arbitration', summary: 'Definition of arbitration in legal contexts.' },
    { id: 'faq-ip', type: 'FAQ', category: 'Intellectual Property', title: 'How to Protect Your Intellectual Property', summary: 'Overview of patents, trademarks, and copyrights.' },
     { id: 'guide-employment-contract', type: 'Guide', category: 'Employment', title: 'Understanding Employment Contracts', summary: 'What to look for in an employment agreement.' },
    { id: 'glossary-force-majeure', type: 'Glossary', category: 'Contracts', title: 'Force Majeure', summary: 'Definition and implications of force majeure clauses.' },
    // Add more mock resources
];

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const LegalResourcesPage: React.FC = () => {
   // Placeholder state for filtering resources
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // e.g., 'FAQ', 'Guide', 'Glossary'


   // --- Placeholder Filtering Logic (Frontend Only) ---
  const filteredResources = mockResources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            resource.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesType = selectedType === 'All' || resource.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });

  // --- End Placeholder Filtering Logic ---

   // Get unique categories and types for filter dropdowns
   const uniqueCategories = [...new Set(mockResources.map(res => res.category))].sort();
   const uniqueTypes = [...new Set(mockResources.map(res => res.type))].sort();


  return (
     <motion.div
      initial="hidden" // Apply container animation variants
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.2, // Add slight delay between sections
          },
        },
      }}
      className="py-8" // Inherits container/padding from Layout, adds vertical padding
    >

        {/* NEW: Legal Resources Hero Section */}
        <motion.section variants={sectionVariants} className="text-center py-16 bg-lightGray rounded-3xl mb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Legal Resources Hub
            </h1>
            <p className="text-xl text-textColor mb-0 max-w-3xl mx-auto leading-relaxed">
                Find answers to common legal questions, understand legal terms, and explore helpful guides.
            </p>
        </motion.section>

         {/* Search and Filter Bar */}
        <motion.section variants={sectionVariants} className="mb-12 p-6 bg-white rounded-xl shadow-sm border border-lightGray">
            <h2 className="text-2xl font-semibold text-primary mb-6">Find Resources</h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
                {/* Search Input */}
                <div className="flex-grow">
                    <label htmlFor="resource-search" className="sr-only">Search resources</label>
                    <input
                        id="resource-search"
                        type="text"
                        placeholder="Search FAQs, guides, or terms..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor"
                    />
                </div>

                 {/* Category Filter */}
                 <div>
                     <label htmlFor="resource-category" className="sr-only">Filter by category</label>
                     <select
                         id="resource-category"
                         value={selectedCategory}
                         onChange={(e) => setSelectedCategory(e.target.value)}
                         className="w-full md:w-auto p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor bg-white"
                     >
                         <option value="All">All Categories</option>
                         {uniqueCategories.map(category => (
                             <option key={category} value={category}>{category}</option>
                         ))}
                     </select>
                 </div>

                 {/* Type Filter */}
                 <div>
                     <label htmlFor="resource-type" className="sr-only">Filter by type</label>
                     <select
                          id="resource-type"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full md:w-auto p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor bg-white"
                      >
                         <option value="All">All Types</option>
                         {uniqueTypes.map(type => (
                             <option key={type} value={type}>{type}</option>
                         ))}
                     </select>
                 </div>
            </div>
            {/* Optional: Add Category Navigation links/buttons here if preferred over dropdown */}
             {/*
             <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors">All</button>
                <button className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors">Contracts</button>
                <button className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors">Real Estate</button>
                 {/* Add more category buttons }
             </div>
             */}
        </motion.section>


        {/* Resource List/Grid */}
        <motion.section variants={sectionVariants} className="py-8"> {/* Add padding, no background */}
            <h2 className="text-3xl font-bold text-primary mb-8">Matching Resources ({filteredResources.length})</h2>
            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid for resources */}
                    {filteredResources.map(resource => (
                        <div
                            key={resource.id}
                            className="bg-white p-6 rounded-xl shadow-md border border-lightGray flex flex-col justify-between"
                        >
                            <div> {/* Container for title/description */}
                                {/* Display resource type and title */}
                                <p className="text-sm font-semibold text-accent mb-2">{resource.type} / {resource.category}</p>
                                <h3 className="text-xl font-semibold text-primary mb-2">{resource.title}</h3>
                                <p className="text-textColor text-sm mb-4 leading-relaxed">{resource.summary}</p>
                            </div>
                             {/* Placeholder Link to Resource Detail Page */}
                            <button
                                onClick={() => alert(`Placeholder: Navigating to detail page for resource: ${resource.title}`)}
                                className="self-start text-accent hover:underline font-semibold mt-4"
                            >
                                Read More →
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-textColor/80 italic text-lg">
                    No resources match your criteria. Please adjust your search or filters.
                </div>
            )}
       </motion.section>

       {/* Optional: Featured Articles Section */}
        {/*
       <motion.section variants={sectionVariants} className="py-16 bg-lightGray rounded-3xl mt-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">Featured Articles</h2>
             {/* Placeholder for featured article cards }
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-2xl shadow-md border border-lightGray">
                     <h3 className="text-2xl font-semibold text-primary mb-4">Title of Featured Article 1</h3>
                      <p className="text-accent text-sm mb-3">Category / Reading Time</p>
                     <p className="text-textColor leading-relaxed mb-4">A brief snippet or summary of the featured article content...</p>
                      <button
                            onClick={() => alert("Placeholder: Reading featured article 1")}
                            className="text-accent hover:underline font-semibold"
                        >
                            Read Article →
                        </button>
                 </div>
                  {/* Add more featured article cards }
             </div>
       </motion.section>
       */}


    </motion.div>
  );
};

export default LegalResourcesPage;