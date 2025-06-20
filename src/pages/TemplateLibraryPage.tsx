// src/pages/TemplateLibraryPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, ShieldCheck, Settings2, RotateCcw, Users,  UserCheck,
  Layers, ChevronRight, Star, Lock, Crown
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

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactElement;
  features: string[];
  isPremium: boolean;
  layoutType?: 'large' | 'medium' | 'small';
}

// All document templates in a single, mixed array
const documentTemplates: DocumentTemplate[] = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Basic NDA template with standard confidentiality terms',
    path: '/documents/generate/nda',
    icon: <FileText size={28} />,
    features: [
      'Standard confidentiality terms',
      'Basic customization options',
      'Simple formatting',
      'PDF download',
      'Email delivery'
    ],
    isPremium: false,
    layoutType: 'medium'
  },
  {
    id: 'premium-privacy-policy',
    name: 'Privacy Policy',
    description: 'Comprehensive privacy policy with international compliance',
    path: '/documents/generate/privacy-policy',
    icon: <ShieldCheck size={28} />,
    features: [
      'Full GDPR compliance',
      'CCPA compliance',
      'International regulations',
      'Premium formatting',
      'Multiple export formats',
      'Priority support'
    ],
    isPremium: true,
    layoutType: 'large'
  },
  {
    id: 'cookies-policy',
    name: 'Cookies Policy',
    description: 'Basic cookies policy template',
    path: '/documents/generate/cookies-policy',
    icon: <Settings2 size={28} />,
    features: [
      'Essential cookies information',
      'Basic cookie categories',
      'Simple customization',
      'PDF download',
      'Easy integration'
    ],
    isPremium: false,
    layoutType: 'small'
  },
  {
    id: 'premium-nda',
    name: 'NDA',
    description: 'Advanced NDA with comprehensive legal protection',
    path: '/documents/generate/nda',
    icon: <FileText size={28} />,
    features: [
      'Advanced confidentiality terms',
      'Industry-specific clauses',
      'Attorney-reviewed template',
      'Premium formatting',
      'Multiple export formats',
      'Priority support'
    ],
    isPremium: true,
    layoutType: 'medium'
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    description: 'Basic power of attorney template',
    path: '/documents/generate/power-of-attorney',
    icon: <Users size={28} />,
    features: [
      'Standard POA clauses',
      'Basic customization',
      'Simple formatting',
      'PDF download',
      'Legal compliance'
    ],
    isPremium: false,
    layoutType: 'small'
  },
  {
    id: 'premium-eula',
    name: 'EULA',
    description: 'Advanced EULA with comprehensive protection',
    path: '/documents/generate/eula',
    icon: <UserCheck size={28} />,
    features: [
      'Advanced license terms',
      'Industry-specific clauses',
      'International compliance',
      'Premium formatting',
      'Multiple export formats',
      'Priority support'
    ],
    isPremium: true,
    layoutType: 'large'
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Basic privacy policy template',
    path: '/documents/generate/privacy-policy',
    icon: <ShieldCheck size={28} />,
    features: [
      'GDPR basics',
      'Cookie policy',
      'Data collection disclosure',
      'Basic formatting',
      'Easy customization'
    ],
    isPremium: false,
    layoutType: 'medium'
  },
  {
    id: 'premium-refund-policy',
    name: 'Refund Policy',
    description: 'Comprehensive refund policy with advanced terms',
    path: '/documents/generate/refund-policy',
    icon: <RotateCcw size={28} />,
    features: [
      'Advanced refund terms',
      'Industry-specific clauses',
      'International compliance',
      'Premium formatting',
      'Multiple export formats'
    ],
    isPremium: true,
    layoutType: 'small'
  },
];

const TemplateLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const [shuffledTemplates, setShuffledTemplates] = useState<DocumentTemplate[]>([]);

  useEffect(() => {
    const shuffled = [...documentTemplates].sort(() => Math.random() - 0.5);
    setShuffledTemplates(shuffled);
  }, []);

  useEffect(() => {
    if (!user) return;
    // Removed showTrash logic
  }, [user]);

  const handleGenerateClick = (path: string) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate(path);
    }
  };

  const FeatureItem: React.FC<{ text: string, isPremium?: boolean }> = ({ text, isPremium }) => (
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      {isPremium ? (
        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
      ) : (
        <Star className="w-4 h-4 text-gray-400 flex-shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );

  const getCardClasses = (layoutType: string, isPremium: boolean) => {
    const baseClasses = `rounded-3xl h-full ${isPremium ? 'bg-yellow-50 border-2 border-yellow-100' : 'bg-white border border-gray-100'}`;
    
    switch (layoutType) {
      case 'large':
        return `${baseClasses} p-8`;
      case 'small':
        return `${baseClasses} p-4`;
      default:
        return `${baseClasses} p-6`;
    }
  };

  const getGridClasses = () => {
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch";
  };

  const DocumentCard: React.FC<{ document: DocumentTemplate }> = ({ document }) => (
    <motion.div
      variants={cardItemVariants}
      className={getCardClasses(document.layoutType || 'medium', document.isPremium)}
      whileHover="hover"
    >
      <div className="flex flex-col h-full relative">
        {/* Premium Crown Badge - Top Right Corner */}
        {document.isPremium && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10">
            <div className="bg-yellow-400 rounded-full p-2 shadow-lg">
              <Crown className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
        )}
        
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
          document.isPremium ? 'bg-yellow-400' : 'bg-primary'
        } ${document.layoutType === 'small' ? 'w-8 h-8 mb-3' : ''}`}>
          {React.cloneElement(document.icon, { 
            size: document.layoutType === 'small' ? 18 : 24, 
            className: 'text-white' 
          })}
        </div>
        
        <h3 className={`font-semibold mb-2 ${
          document.layoutType === 'large' ? 'text-xl' : 
          document.layoutType === 'small' ? 'text-lg' : 'text-lg'
        }`}>
          {document.name}
        </h3>
        
        <p className={`text-gray-600 mb-4 ${
          document.layoutType === 'small' ? 'text-sm' : 'text-sm'
        }`}>
          {document.description}
        </p>
        
        <div className={`space-y-2 mb-6 flex-grow ${
          document.layoutType === 'large' ? 'space-y-3' : 'space-y-2'
        }`}>
          {document.features.slice(0, 5).map((feature, index) => (
            <FeatureItem key={index} text={feature} isPremium={document.isPremium} />
          ))}
        </div>

        <button
          onClick={() => handleGenerateClick(document.path)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all text-sm mt-auto ${
            document.isPremium 
              ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
              : 'bg-primary hover:bg-primary/90 text-white'
          } ${document.layoutType === 'small' ? 'py-2 text-xs' : ''}`}
        >
          {document.isPremium && <Lock className="w-3 h-3" />}
          Use Template
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

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

      {/* Mixed Layout Templates Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-primary mb-8">
          All Available Templates
        </h2>
        <motion.div 
          className={getGridClasses()}
          variants={cardGridVariants}
          initial="hidden"
          animate="visible"
        >
          {shuffledTemplates.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
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
    </motion.div>
  );
};

export default TemplateLibraryPage;