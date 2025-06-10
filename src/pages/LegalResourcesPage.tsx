// src/pages/LegalResourcesPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, HelpCircle, FileText as GuideIcon, ListChecks, Hash, ChevronRight } from 'lucide-react'; // Using more specific icons

// Expanded placeholder data with a 'slug' for URL and more content for detail page
const mockResources = [
    { id: 'faq-nda', slug: 'what-is-an-nda', type: 'FAQ', category: 'Contracts & Agreements', title: 'What is an NDA?', summary: 'Explains the basics of a Non-Disclosure Agreement, its purpose, and key elements.', icon: <HelpCircle size={24} className="text-indigo-500" />, content: "A Non-Disclosure Agreement (NDA), also known as a confidentiality agreement, is a legal contract between at least two parties that outlines confidential material, knowledge, or information that the parties wish to share with one another for certain purposes, but wish to restrict access to or by third parties..." },
    { id: 'guide-rental', slug: 'guide-to-rental-agreements', type: 'Guide', category: 'Real Estate', title: 'Guide to Creating a Rental Agreement', summary: 'Step-by-step instructions and considerations for landlords and tenants when drafting a lease.', icon: <GuideIcon size={24} className="text-green-500" />, content: "Creating a comprehensive rental agreement is crucial for both landlords and tenants. This guide covers essential clauses like rent, security deposit, lease term, tenant responsibilities, landlord responsibilities, and local regulations..." },
    { id: 'glossary-arbitration', slug: 'arbitration-defined', type: 'Glossary', category: 'Legal Terms', title: 'Arbitration', summary: 'Definition of arbitration as an alternative dispute resolution method.', icon: <Hash size={24} className="text-purple-500" />, content: "Arbitration is a form of alternative dispute resolution (ADR) in which a dispute is submitted to one or more arbitrators who make a binding decision on the dispute. It is often used for the resolution of commercial disputes and can be either voluntary or mandatory..." },
    { id: 'faq-ip', slug: 'protecting-intellectual-property', type: 'FAQ', category: 'Intellectual Property', title: 'How to Protect Your Intellectual Property', summary: 'Overview of patents, trademarks, copyrights, and trade secrets.', icon: <HelpCircle size={24} className="text-indigo-500" />, content: "Protecting your intellectual property (IP) is vital for businesses and creators. This involves understanding patents (for inventions), trademarks (for brands), copyrights (for original creative works), and trade secrets (for confidential business information)..." },
    { id: 'guide-employment-contract', slug: 'understanding-employment-contracts', type: 'Guide', category: 'Employment Law', title: 'Understanding Employment Contracts', summary: 'Key elements to look for in an employment agreement before signing.', icon: <GuideIcon size={24} className="text-green-500" />, content: "An employment contract outlines the terms and conditions of employment between an employer and an employee. Key elements include job title and responsibilities, compensation, benefits, duration of employment (if not at-will), confidentiality clauses, non-compete agreements (where lawful), and termination conditions..." },
    { id: 'glossary-force-majeure', slug: 'force-majeure-clause', type: 'Glossary', category: 'Contracts & Agreements', title: 'Force Majeure', summary: 'Definition and implications of force majeure clauses in contracts.', icon: <Hash size={24} className="text-purple-500" />, content: "A force majeure clause is a contract provision that relieves the parties from performing their contractual obligations when certain circumstances beyond their control arise, making performance inadvisable, commercially impracticable, illegal, or impossible. Such circumstances typically include acts of God, war, riots, or natural disasters..." },
];


const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 50 } } };
const cardVariants = { hidden: { opacity: 0, y: 30, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }};

const LegalResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredResources = mockResources
    .filter(resource => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = resource.title.toLowerCase().includes(lowerSearchTerm) ||
                            resource.summary.toLowerCase().includes(lowerSearchTerm);
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesType = selectedType === 'All' || resource.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });

  const uniqueCategories = ['All', ...new Set(mockResources.map(res => res.category))].sort();
  const uniqueTypes = ['All', ...new Set(mockResources.map(res => res.type))].sort();

  return (
     <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
      className="bg-gray-50 min-h-screen" // Overall page background
    >
        <motion.section
            variants={sectionVariants}
            className="text-center py-16 md:py-20 bg-gradient-to-br from-primary to-accent text-white rounded-b-3xl md:rounded-b-[60px] shadow-xl mb-12 px-4"
        >
            <BookOpen size={64} className="mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
                Legal Resources Hub
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-0 max-w-3xl mx-auto leading-relaxed">
                Empowering you with knowledge. Find answers, understand legal terms, and explore helpful guides.
            </p>
        </motion.section>

        {/* <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-6">
                    <Filter size={28} className="text-primary mr-3" />
                    <h2 className="text-2xl font-semibold text-primary">Explore Our Resources</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label htmlFor="resource-search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
                            <input id="resource-search" type="text" placeholder="Keywords, title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 shadow-sm"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="resource-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="resource-category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none">
                            {uniqueCategories.map(category => (<option key={category} value={category}>{category}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="resource-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select id="resource-type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none">
                            <option value="All">All Types</option>
                            {uniqueTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        </motion.section> */}

        <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* <h2 className="text-3xl font-bold text-primary mb-8">
                Found <span className="text-accent">{filteredResources.length}</span> Resources
            </h2> */}
            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map(resource => (
                        <motion.div
                            key={resource.id}
                            variants={cardVariants}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col group transform hover:-translate-y-2"
                        >
                            <div className="p-6 md:p-8 flex-grow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-lightGray rounded-full">
                                        {resource.icon || <BookOpen size={24} className="text-primary" />}
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{resource.type}</span>
                                        <h3 className="text-lg md:text-xl font-semibold text-primary group-hover:text-accent transition-colors mt-1">{resource.title}</h3>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 leading-relaxed min-h-[80px]">{resource.summary}</p>
                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{resource.category}</span>
                            </div>
                             <div className="px-6 md:px-8 pb-6 pt-2">
                                <Link
                                    to={`/resources/${resource.slug}`} // Use slug for cleaner URL
                                    className="inline-flex items-center text-accent hover:text-primary font-semibold group transition-colors duration-200"
                                >
                                    Read More
                                    <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div variants={cardVariants} className="text-center py-20 px-6 text-gray-500 italic text-lg bg-white rounded-xl shadow-md border">
                    <ListChecks size={64} className="mx-auto mb-6 text-gray-400" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">No resources match your criteria.</p>
                    <p>Try adjusting your search terms or broadening your filters.</p>
                </motion.div>
            )}
       </motion.section>
    </motion.div>
  );
};

export default LegalResourcesPage;