import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
// Import mockResources - in a real app, you'd fetch this or have it in a shared state/context
// For this example, we'll import it directly.
// If mockResources is in LegalResourcesPage.tsx, you might need to move it to a shared file
// or pass it down/fetch it. For simplicity, let's assume it's accessible or re-declared here.

// Re-declare or import mockResources. For a real app, manage this data centrally.
const mockResources = [
    { id: 'faq-nda', slug: 'what-is-an-nda', type: 'FAQ', category: 'Contracts & Agreements', title: 'What is an NDA?', summary: 'Explains the basics of a Non-Disclosure Agreement, its purpose, and key elements.', icon: <HelpCircle size={24} className="text-indigo-500" />, content: "A Non-Disclosure Agreement (NDA), also known as a confidentiality agreement, is a legal contract between at least two parties that outlines confidential material, knowledge, or information that the parties wish to share with one another for certain purposes, but wish to restrict access to or by third parties. Key elements usually include: definition of confidential information, obligations of the receiving party, exclusions from confidentiality, term of the agreement, and remedies for breach. NDAs are crucial for businesses protecting trade secrets, new product ideas, or sensitive client data before entering into deeper discussions or partnerships." },
    { id: 'guide-rental', slug: 'guide-to-rental-agreements', type: 'Guide', category: 'Real Estate', title: 'Guide to Creating a Rental Agreement', summary: 'Step-by-step instructions and considerations for landlords and tenants when drafting a lease.', icon: <GuideIconLucide size={24} className="text-green-500" />, content: "Creating a comprehensive rental agreement is crucial for both landlords and tenants. This guide covers essential clauses like:\n\n- **Parties Involved:** Clearly identify landlord and tenant(s).\n- **Property Description:** Accurate address and description of the rental unit.\n- **Lease Term:** Start and end dates, or month-to-month terms.\n- **Rent Amount & Due Date:** Specify rent, payment methods, and late fees.\n- **Security Deposit:** Amount, conditions for use, and return policy.\n- **Tenant Responsibilities:** Maintenance, utilities, rules of conduct.\n- **Landlord Responsibilities:** Repairs, entry rights, providing a habitable environment.\n- **Local Regulations:** Ensure compliance with state and local landlord-tenant laws.\n\nAlways consult local laws or a legal professional when drafting or signing a lease." },
    { id: 'glossary-arbitration', slug: 'arbitration-defined', type: 'Glossary', category: 'Legal Terms', title: 'Arbitration', summary: 'Definition of arbitration as an alternative dispute resolution method.', icon: <HashIcon size={24} className="text-purple-500" />, content: "Arbitration is a form of alternative dispute resolution (ADR) in which a dispute is submitted to one or more arbitrators who make a binding decision on the dispute. Unlike mediation, where a mediator helps parties reach their own agreement, an arbitrator acts more like a judge, though the process is typically less formal and faster than court litigation. It is often used for the resolution of commercial disputes and can be either voluntary (agreed to by the parties) or mandatory (required by law or a contract clause). The arbitrator's decision, known as an award, is legally binding and can be enforced by courts." },
    { id: 'faq-ip', slug: 'protecting-intellectual-property', type: 'FAQ', category: 'Intellectual Property', title: 'How to Protect Your Intellectual Property', summary: 'Overview of patents, trademarks, copyrights, and trade secrets.', icon: <HelpCircle size={24} className="text-indigo-500" />, content: "Protecting your intellectual property (IP) is vital for businesses and creators. The main types of IP protection include:\n\n- **Patents:** Protect new inventions and discoveries (e.g., machines, processes, chemical compositions). Requires application and approval from a patent office.\n- **Trademarks:** Protect brand names, logos, slogans, and other identifiers that distinguish goods or services. Registration provides stronger protection.\n- **Copyrights:** Protect original works of authorship, such as literary, dramatic, musical, and certain other artistic works (including software code). Copyright protection is automatic upon creation, but registration provides additional benefits.\n- **Trade Secrets:** Protect confidential business information that provides a competitive edge (e.g., formulas, practices, designs). Protection relies on maintaining secrecy." },
    { id: 'guide-employment-contract', slug: 'understanding-employment-contracts', type: 'Guide', category: 'Employment Law', title: 'Understanding Employment Contracts', summary: 'Key elements to look for in an employment agreement before signing.', icon: <GuideIconLucide size={24} className="text-green-500" />, content: "An employment contract outlines the terms and conditions of employment between an employer and an employee. Key elements to scrutinize include:\n\n- **Job Title and Responsibilities:** Clearly defined role.\n- **Compensation:** Salary, bonuses, commissions, and payment schedule.\n- **Benefits:** Health insurance, retirement plans, paid time off.\n- **Duration of Employment:** Fixed-term or at-will (if applicable by law).\n- **Confidentiality Clauses:** Obligations to protect company information.\n- **Non-Compete & Non-Solicitation Agreements:** Restrictions on future employment or client engagement (check local laws for enforceability).\n- **Intellectual Property:** Who owns work created during employment.\n- **Termination Conditions:** Grounds for termination by either party and notice periods.\n\nIt's advisable to have an employment lawyer review complex contracts." },
    { id: 'glossary-force-majeure', slug: 'force-majeure-clause', type: 'Glossary', category: 'Contracts & Agreements', title: 'Force Majeure', summary: 'Definition and implications of force majeure clauses in contracts.', icon: <HashIcon size={24} className="text-purple-500" />, content: "A force majeure clause is a contract provision that relieves one or both parties from performing their contractual obligations when certain circumstances beyond their control arise, making performance inadvisable, commercially impracticable, illegal, or impossible. These circumstances, often called 'acts of God,' typically include events like natural disasters (hurricanes, floods, earthquakes), war, terrorism, riots, strikes, epidemics, or government actions. The specific events covered are usually defined in the clause itself. For the clause to be invoked, the event must generally be unforeseeable and unavoidable, and directly prevent performance." },
];
// Temporary icons for detail page, ideally these would come from mockResources
import { HelpCircle, FileText as GuideIconLucide, Hash as HashIcon } from 'lucide-react';


const ResourceDetailPage: React.FC = () => {
  const { resourceSlug } = useParams<{ resourceSlug: string }>(); // Changed from resourceId to resourceSlug
  const resource = mockResources.find(r => r.slug === resourceSlug);

  if (!resource) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Resource Not Found</h1>
        <p className="text-textColor mb-8">Sorry, we couldn't find the resource you're looking for.</p>
        <Link to="/resources" className="text-accent hover:underline font-semibold">
          ← Back to All Resources
        </Link>
      </div>
    );
  }

  // Determine icon based on type for this page (since resource.icon is JSX)
  let TypeIconComponent;
  switch (resource.type) {
      case 'FAQ': TypeIconComponent = HelpCircle; break;
      case 'Guide': TypeIconComponent = GuideIconLucide; break;
      case 'Glossary': TypeIconComponent = HashIcon; break;
      default: TypeIconComponent = BookOpen;
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen"
    >
      {/* Hero section for the resource */}
      <div className="py-12 md:py-16 bg-gradient-to-r from-primary/80 to-accent/80 text-white shadow-lg rounded-b-[60px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-6">
            <TypeIconComponent size={40} className="text-white" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-2">{resource.type} / {resource.category}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">{resource.title}</h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">{resource.summary}</p>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/resources"
            className="inline-flex items-center text-accent hover:text-primary font-semibold mb-8 group transition-colors"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Resources
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            // Use Tailwind Typography for nice article styling
            className="prose prose-lg max-w-none bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200"
          >
            {/* Render the full content. For HTML content, use dangerouslySetInnerHTML (with caution)
                or a markdown parser if content is in markdown. For plain text with newlines: */}
            {typeof resource.content === 'string' ? (
                resource.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))
            ) : (
                <p>Content not available.</p> // Fallback
            )}
          </motion.article>

          {/* Optional: Related Resources or CTA */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold text-primary mb-6">Need More Help?</h3>
            <Link
              to="/documents/generate"
              className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg"
            >
              Generate a Document
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceDetailPage;