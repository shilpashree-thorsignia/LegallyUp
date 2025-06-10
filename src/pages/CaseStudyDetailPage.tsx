import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Zap, Target as TargetIcon, Award } from 'lucide-react'; // Zap for results, Target for challenge

// Re-declare or import mockCaseStudies. For a real app, manage this data centrally.
// For this example, copy the mockCaseStudies array from CaseStudiesPage.tsx here
// (or better, move it to a shared data file and import in both)
const mockCaseStudies = [
    { id: 'cs1', slug: 'startup-secures-ip-with-ndas', title: 'Startup Secures IP with Quick NDAs', client: 'Innovatech Solutions', industry: 'Software & AI', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RhcnR1cCUyMHRlY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', summary: 'How a new tech company streamlined contracting and protected vital intellectual property...', challenge: "Innovatech Solutions, an AI startup, needed to engage with multiple potential partners and investors. They faced the challenge of quickly and reliably protecting their proprietary algorithms and business plans without incurring high legal fees or lengthy delays.", solution: "LegallyUp's platform provided Innovatech with a customizable NDA template. They could generate tailored NDAs in minutes, ensuring all critical information was covered. The ease of use allowed their small team to manage these agreements efficiently.", results: "Innovatech successfully secured several key partnerships and an initial funding round, attributing their ability to move quickly and securely to the readily available and professional NDAs generated through LegallyUp. They reported an 85% reduction in time spent on NDA drafting and a significant cost saving.", tags: ['startup', 'ip protection', 'nda', 'fundraising', 'software']},
    { id: 'cs2', slug: 'landlord-manages-properties-efficiently', title: 'Landlord Manages Properties Efficiently with Standardized Leases', client: 'Oak Property Management', industry: 'Real Estate', imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', summary: 'Discover how a property manager simplified lease generation...', challenge: "Managing multiple rental properties with varying tenant needs, Oak Property Management struggled with inconsistent lease agreements and time-consuming manual drafting. This led to occasional disputes and inefficiencies.", solution: "By adopting LegallyUp's residential lease agreement templates, Oak Property Management standardized their leasing process. They could easily customize clauses for specific properties while ensuring all agreements were comprehensive and legally sound.", results: "The company reduced lease preparation time by over 70%, minimized legal ambiguities, and experienced smoother tenant relations. Tenant onboarding became more professional and efficient.", tags: ['real estate', 'landlord', 'lease agreement', 'property management']},
    { id: 'cs3', slug: 'consultant-agreement-success', title: 'Freelance Consultant Standardizes Client Engagements', client: 'Maria Rodriguez, Marketing Consultant', industry: 'Consulting & Marketing', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbnN1bHRhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', summary: 'Learn how a freelance marketing consultant used LegallyUp to create professional consultant agreements...', challenge: "As a solo consultant, Maria found drafting individual contracts for each client time-consuming and was concerned about potential misunderstandings regarding project scope and deliverables.", solution: "Maria utilized LegallyUp's consultant agreement template to create a master agreement that she could quickly customize for each new client. This ensured consistency and clarity in all her engagements.", results: "She reported increased client confidence, fewer disputes over project scope, and faster onboarding of new projects. Having a professional agreement template saved her an estimated 5-10 hours per month.", tags: ['freelance', 'consulting', 'contract', 'client management', 'marketing']},
    { id: 'cs4', slug: 'ecommerce-store-streamlines-contracts', title: 'E-commerce Store Streamlines Vendor & Partnership Agreements', client: 'The Cozy Corner Store', industry: 'Retail & E-commerce', imageUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', summary: 'See how an online store owner quickly generated clear vendor contracts...', challenge: "The Cozy Corner Store was expanding its product line and needed to formalize agreements with new suppliers and collaborators, but lacked in-house legal resources.", solution: "LegallyUp provided accessible templates for service agreements and partnership agreements, which the store owner could adapt to their specific needs for vendor onboarding and collaborations.", results: "The store successfully onboarded new vendors with clear terms, leading to more reliable supply chains. Partnership collaborations were also formalized effectively, protecting the store's interests.", tags: ['ecommerce', 'small business', 'vendor agreement', 'partnership', 'retail']},
];


const CaseStudyDetailPage: React.FC = () => {
  const { caseStudySlug } = useParams<{ caseStudySlug: string }>();
  const study = mockCaseStudies.find(s => s.slug === caseStudySlug);

  if (!study) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Case Study Not Found</h1>
        <p className="text-textColor mb-8">Sorry, we couldn't find the case study you're looking for.</p>
        <Link to="/case-studies" className="text-accent hover:underline font-semibold inline-flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Back to All Case Studies
        </Link>
      </div>
    );
  }

  const renderSection = (title: string, content: string | undefined, icon?: React.ReactNode) => {
    if (!content) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 md:mb-10"
        >
            <div className="flex items-center mb-3">
                {icon || <CheckCircle size={24} className="text-accent mr-3" />}
                <h2 className="text-2xl md:text-3xl font-semibold text-primary">{title}</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 min-h-screen"
    >
      {/* Hero Image and Title */}
      <div className="relative h-72 md:h-96">
        <img src={study.imageUrl} alt={study.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-10 container mx-auto">
            <span className="text-xs font-semibold text-white bg-primary/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">{study.industry}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">{study.title}</h1>
            <p className="text-lg text-gray-200 mt-2">Client: {study.client}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/case-studies"
            className="inline-flex items-center text-accent hover:text-primary font-semibold mb-10 group transition-colors"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Case Studies
          </Link>

          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200"
          >
            {renderSection("The Challenge", study.challenge, <TargetIcon size={24} className="text-red-500 mr-3" />)}
            {renderSection("Our Solution with LegallyUp", study.solution, <Zap size={24} className="text-green-500 mr-3" />)}
            {renderSection("The Results & Impact", study.results, <Award size={24} className="text-blue-500 mr-3" />)}

            {study.tags && study.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-primary mb-3">Keywords:</h3>
                    <div className="flex flex-wrap gap-2">
                        {study.tags.map(tag => (
                            <span key={tag} className="text-xs bg-lightGray text-textColor px-3 py-1.5 rounded-full font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </motion.article>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-primary mb-6">Inspired by this story?</h3>
            <Link
              to="/documents/generate"
              className="bg-accent text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-accent-dark transition-colors shadow-lg transform hover:scale-105"
            >
              Start Generating Your Documents
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyDetailPage;