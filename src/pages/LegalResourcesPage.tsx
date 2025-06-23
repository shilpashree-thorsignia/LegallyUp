// src/pages/LegalResourcesPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, HelpCircle, FileText as GuideIcon, Hash } from 'lucide-react';


// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 }}
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' }}
};

const ResourceCard: React.FC<{
  type: string;
  category: string;
  title: string;
  summary: string;
  slug: string;
}> = ({ type, category, title, summary, slug }) => {
  const getIcon = () => {
    switch (type) {
      case 'FAQ':
        return <HelpCircle size={24} className="text-primary" />;
      case 'Guide':
        return <GuideIcon size={24} className="text-primary" />;
      case 'Glossary':
        return <Hash size={24} className="text-primary" />;
      default:
        return <BookOpen size={24} className="text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <Link to={`/resources/${slug}`} className="block h-full">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
              {getIcon()}
            </div>
            <div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {type}
              </span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6 line-clamp-2 text-base">
            {summary}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-500">
              {category}
            </span>
            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform duration-300">
              <span className="mr-2 font-medium">Read More</span>
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const LegalResourcesPage: React.FC = () => {
  // Example resources - replace with your actual data source
  const resources = [
    {
      type: 'FAQ',
      category: 'Contracts & Agreements',
      title: 'What is an NDA?',
      summary: 'Explains the basics of a Non-Disclosure Agreement, its purpose, and key elements.',
      slug: 'what-is-an-nda'
    },
    {
      type: 'Guide',
      category: 'Real Estate',
      title: 'Guide to Creating a Rental Agreement',
      summary: 'Step-by-step instructions and considerations for landlords and tenants when drafting a lease.',
      slug: 'guide-to-rental-agreements'
    },
    {
      type: 'Glossary',
      category: 'Legal Terms',
      title: 'Arbitration',
      summary: 'Definition of arbitration as an alternative dispute resolution method.',
      slug: 'arbitration-defined'
    },
    {
      type: 'FAQ',
      category: 'Intellectual Property',
      title: 'How to Protect Your Intellectual Property',
      summary: 'Overview of patents, trademarks, copyrights, and trade secrets.',
      slug: 'protecting-intellectual-property'
    },
    {
      type: 'Guide',
      category: 'Employment Law',
      title: 'Understanding Employment Contracts',
      summary: 'Key elements to look for in an employment agreement before signing.',
      slug: 'understanding-employment-contracts'
    },
    {
      type: 'Glossary',
      category: 'Contracts & Agreements',
      title: 'Force Majeure',
      summary: 'Definition and implications of force majeure clauses in contracts.',
      slug: 'force-majeure-clause'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
      className="bg-gray-50 min-h-screen"
    >
      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        className="relative h-screen flex items-center justify-center bg-logoBlue text-white overflow-hidden"
      >
        <div className="w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center">
              <BookOpen 
                size={72} 
                className="mx-auto text-white transition-transform duration-300 hover:scale-110" 
                strokeWidth={1.5} 
              />
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              <span className="text-logoGreen">Legal</span> Resources Hub
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Empowering you with knowledge. Find answers, understand legal terms, and explore helpful guides.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Resources Grid */}
      <motion.section 
        variants={sectionVariants} 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default LegalResourcesPage;