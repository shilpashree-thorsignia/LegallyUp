// src/pages/PricingPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, CheckCircle, XCircle, HelpCircle, ChevronDown, Star, Zap, Users } from 'lucide-react';

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0 }
};

const contentBlockVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.1 } },
};

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const planCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } },
  hover: {
    y: -10,
    boxShadow: "0px 20px 45px -10px rgba(var(--color-primary-rgb, 29 78 216), 0.2)", // Define --color-primary-rgb in global CSS
    transition: { type: "spring", stiffness: 200, damping: 10 }
  }
};

// FAQ Data - Expanded as requested
const faqsData = [
  { id: 'faq1', q: 'How does the Free plan work?', a: 'Our Free plan provides access to a selection of basic templates and allows for a limited number of document generations per month (currently 3). It’s perfect for individuals with occasional legal document needs or for those wanting to try our platform before committing to a paid plan. You can save your generated documents and access standard email support.' },
  { id: 'faq2', q: 'What are "premium templates" in the Pro plan?', a: 'Premium templates are more complex, specialized, or industry-specific documents drafted by legal experts. They often include more customization options, cover a wider range of legal scenarios, and are designed for more robust needs. These are available exclusively to our Pro subscribers.' },
  { id: 'faq3', q: 'Can I upgrade or downgrade my plan at any time?', a: 'Absolutely! You can easily change your plan (upgrade or downgrade) directly from your account dashboard. Upgrades are typically pro-rated, and downgrades will take effect at the start of your next billing cycle.' },
  { id: 'faq4', q: 'What payment methods do you accept for paid plans?', a: 'We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. We also support payments through PayPal for added convenience. All payments are processed securely through our PCI-compliant payment gateway.' },
  { id: 'faq5', q: 'Is there a long-term contract for the Pro or Attorney plans?', a: 'Our monthly plans are billed month-to-month and can be canceled at any time without long-term commitment. If you opt for an annual plan, you are billed once per year (often at a discounted rate compared to monthly) and can manage your auto-renewal settings from your dashboard.' },
  { id: 'faq6', q: 'What kind of customer support is offered for each plan?', a: 'Free plan users have access to our comprehensive online knowledge base and community forums. Pro plan subscribers receive priority email and chat support during business hours. Attorney plan members get dedicated account management and expedited support channels.' },
  { id: 'faq7', q: 'How does the "Attorney" plan specifically benefit legal professionals?', a: 'The Attorney plan is tailored for lawyers and law firms. It includes a prominent listing in our attorney directory, tools to connect with potential clients seeking legal help through LegallyUp, a dashboard to manage consultations and client interactions, and access to secure communication features.' },
  { id: 'faq8', q: 'What happens if I exceed my document generation limit on the Free plan?', a: 'If you reach your monthly limit on the Free plan, you will be prompted to upgrade to our Pro plan to continue generating unlimited documents. Alternatively, you can wait until your limit resets at the start of the next month.' },
  { id: 'faq9', q: 'Are the documents generated legally binding?', a: 'LegallyUp provides templates drafted with legal considerations in mind. However, the legal validity of a document can depend on various factors, including the specific details you input, the jurisdiction, and proper execution (e.g., signatures, notarization where required). While our templates provide a strong foundation, for critical legal matters, we always recommend consulting with a qualified attorney to ensure the document perfectly suits your specific situation and is fully compliant with local laws.' },
  { id: 'faq10', q: 'Can I collaborate with others on documents?', a: 'Collaboration features, such as sharing documents with colleagues or clients for review and e-signature capabilities, are typically part of our Pro plan and enhanced for Attorney plan users. The Free plan has limited sharing options.' },
];


// FAQ Item Component for Accordion
const FaqItem: React.FC<{ faq: typeof faqsData[0]; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => {
  return (
    <motion.div
      className="border-b border-gray-200 overflow-hidden"
      // itemVariants can be applied here if the parent <motion.div> staggers its children
    >
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-5 px-1 text-left text-lg font-medium text-primary hover:text-accent focus:outline-none transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${faq.id}`}
      >
        <span className="flex-1">{faq.q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-4 flex-shrink-0">
          <ChevronDown size={24} className={`transition-colors ${isOpen ? 'text-accent' : 'text-gray-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${faq.id}`}
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] } },
              collapsed: { opacity: 0, height: 0, y: -10, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } }
            }}
            className="overflow-hidden"
          >
            <p className="pt-1 pb-6 px-1 text-gray-600 leading-relaxed text-base">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(faqsData[0]?.id || null); // Open first FAQ by default

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };


  return (
     <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-gray-100 min-h-screen"
    >
        <motion.section // Hero Section
            variants={contentBlockVariants}
            className="text-center py-20 md:py-28 bg-gradient-to-br from-primary to-accent text-white rounded-b-[30px] md:rounded-b-[60px] shadow-xl mb-16 px-4"
        >
            <motion.div variants={{visible: {transition: {staggerChildren: 0.1}}}}>
                <motion.div variants={itemVariants} className="mb-6">
                    <DollarSign size={72} className="mx-auto opacity-90" strokeWidth={1.5} />
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tighter" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>
                    Simple, Transparent Pricing
                </motion.h1>
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                    Choose the perfect plan to unlock the full power of LegallyUp. No hidden fees, just straightforward value for your legal needs.
                </motion.p>
            </motion.div>
        </motion.section>

        {/* Plan Cards Section */}
       <motion.section
            variants={contentBlockVariants}
            className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28"
        >
            <motion.h2 variants={sectionHeaderVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-16 text-center tracking-tight">
                Our Plans
            </motion.h2>
           <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 }}}}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
               {/* Free Tier Card */}
               <motion.div
                    variants={planCardVariants} whileHover="hover"
                    className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 flex flex-col transform transition-all duration-300"
                >
                   <div className="flex items-center gap-3 mb-5">
                        <Users size={32} className="text-primary" />
                        <h3 className="text-2xl font-bold text-primary">Free</h3>
                   </div>
                   <p className="text-5xl font-extrabold text-primary mb-2">$0<span className="text-xl text-gray-500 font-semibold">/month</span></p>
                   <p className="text-gray-600 text-sm mb-8 flex-grow leading-relaxed">Basic access for individuals needing simple legal documents occasionally.</p>
                   <ul className="text-gray-700 text-left space-y-3 mb-10 text-sm">
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> 3 Document generations/month</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> Access to basic templates</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> Standard email support</li>
                       <li className="flex items-center"><XCircle size={18} className="text-gray-400 mr-2 flex-shrink-0" /> Premium Template Access</li>
                   </ul>
                   <Link
                        to="/signup?plan=free"
                        className="mt-auto w-full text-center bg-gray-100 text-primary border border-gray-300 px-8 py-3.5 rounded-xl hover:bg-gray-200 hover:border-primary transition-all duration-300 font-semibold text-md"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = '/signup?plan=free';
                        }}
                    >
                       Get Started Free
                   </Link>
               </motion.div>

                {/* Pro Tier Card (Highlighted) */}
               <motion.div
                    variants={planCardVariants} whileHover="hover"
                    className="bg-gradient-to-br from-primary to-accent text-white p-8 rounded-3xl shadow-2xl flex flex-col ring-4 ring-accent/50 transform lg:scale-105"
                >
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-3">
                            <Star size={32} className="text-yellow-400" />
                            <h3 className="text-3xl font-bold">Pro</h3>
                        </div>
                        <span className="bg-yellow-400 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                    </div>
                   <p className="text-5xl font-extrabold mb-2">$29<span className="text-xl font-semibold">/month</span></p>
                   <p className="text-white/90 text-sm mb-8 flex-grow leading-relaxed">Ideal for frequent users, small businesses, and startups with diverse and ongoing legal needs.</p>
                   <ul className="text-left space-y-3 mb-10 text-sm">
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2 flex-shrink-0" /> Unlimited document generations</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2 flex-shrink-0" /> Access to ALL premium templates</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2 flex-shrink-0" /> Secure cloud storage</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2 flex-shrink-0" /> Priority email & chat support</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2 flex-shrink-0" /> Discounted attorney consults</li>
                   </ul>
                   <Link
                        to="/signup?plan=pro"
                        className="mt-auto w-full text-center bg-white text-primary px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-md shadow-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = '/signup?plan=pro';
                        }}
                    >
                       Choose Pro Plan
                   </Link>
               </motion.div>

                {/* Attorney Tier Card */}
               <motion.div
                    variants={planCardVariants} whileHover="hover"
                    className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 flex flex-col transform transition-all duration-300"
                >
                   <div className="flex items-center gap-3 mb-5">
                        <Zap size={32} className="text-primary" />
                        <h3 className="text-2xl font-bold text-primary">Attorney</h3>
                   </div>
                   <p className="text-5xl font-extrabold text-primary mb-2">$79<span className="text-xl text-gray-500 font-semibold">/month</span></p>
                   <p className="text-gray-600 text-sm mb-8 flex-grow leading-relaxed">Designed for legal professionals to join our directory and connect with clients.</p>
                   <ul className="text-gray-700 text-left space-y-3 mb-10 text-sm">
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> Prominent Directory Listing</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> Connect with LegallyUp Users</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> Consultation Management Dashboard</li>
                       <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" /> Secure Client Communication Tools</li>
                   </ul>
                   <Link
                        to="/signup?plan=attorney"
                        className="mt-auto w-full text-center bg-gray-100 text-primary border border-gray-300 px-8 py-3.5 rounded-xl hover:bg-gray-200 hover:border-primary transition-all duration-300 font-semibold text-md"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = '/signup?plan=attorney';
                        }}
                    >
                       Join as Attorney
                   </Link>
               </motion.div>
           </motion.div>
       </motion.section>

        {/* Enhanced FAQs Section */}
       <motion.section
            variants={contentBlockVariants}
            className="py-20 md:py-28 bg-lightGray rounded-t-[30px] md:rounded-t-[50px] px-4 sm:px-6 lg:px-8"
        >
            <div className="container mx-auto max-w-4xl">
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <HelpCircle size={60} className="text-accent mx-auto mb-6" strokeWidth={1.5}/>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-textColor mt-4 max-w-2xl mx-auto">
                        Find answers to common questions about our plans and services.
                    </p>
                </motion.div>

                <motion.div
                    variants={{visible: {transition: {staggerChildren: 0.05}}}}
                    className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200"
                >
                    {faqsData.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openFaq === faq.id}
                            onClick={() => toggleFaq(faq.id)}
                        />
                    ))}
                </motion.div>
            </div>
       </motion.section>
    </motion.div>
  );
};

export default PricingPage;