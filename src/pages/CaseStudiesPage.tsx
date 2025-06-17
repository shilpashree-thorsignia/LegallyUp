// src/pages/CaseStudiesPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Target, ChevronRight, Award, BookText } from 'lucide-react';

// Updated mockCaseStudies with slug and more detailed content
const mockCaseStudies = [
    {
        id: 'cs1',
        slug: 'startup-secures-ip-with-ndas',
        title: 'Startup Secures IP with Quick NDAs',
        client: 'Innovatech Solutions',
        industry: 'Software & AI',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RhcnR1cCUyMHRlY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', // Replace with relevant image
        summary: 'How a new tech company streamlined contracting and protected vital intellectual property by using LegallyUp for Non-Disclosure Agreements during early-stage discussions.',
        challenge: "Innovatech Solutions, an AI startup, needed to engage with multiple potential partners and investors. They faced the challenge of quickly and reliably protecting their proprietary algorithms and business plans without incurring high legal fees or lengthy delays.",
        solution: "LegallyUp's platform provided Innovatech with a customizable NDA template. They could generate tailored NDAs in minutes, ensuring all critical information was covered. The ease of use allowed their small team to manage these agreements efficiently.",
        results: "Innovatech successfully secured several key partnerships and an initial funding round, attributing their ability to move quickly and securely to the readily available and professional NDAs generated through LegallyUp. They reported an 85% reduction in time spent on NDA drafting and a significant cost saving.",
        tags: ['startup', 'ip protection', 'nda', 'fundraising', 'software']
    },
    {
        id: 'cs2',
        slug: 'landlord-manages-properties-efficiently',
        title: 'Landlord Manages Properties Efficiently with Standardized Leases',
        client: 'Oak Property Management',
        industry: 'Real Estate',
        imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        summary: 'Discover how a property manager simplified lease generation, ensured compliance, and improved tenant onboarding using LegallyUp's residential lease templates.',
        challenge: "Managing multiple rental properties with varying tenant needs, Oak Property Management struggled with inconsistent lease agreements and time-consuming manual drafting. This led to occasional disputes and inefficiencies.",
        solution: "By adopting LegallyUp's residential lease agreement templates, Oak Property Management standardized their leasing process. They could easily customize clauses for specific properties while ensuring all agreements were comprehensive and legally sound.",
        results: "The company reduced lease preparation time by over 70%, minimized legal ambiguities, and experienced smoother tenant relations. Tenant onboarding became more professional and efficient.",
        tags: ['real estate', 'landlord', 'lease agreement', 'property management']
    },
    {
        id: 'cs3',
        slug: 'consultant-agreement-success',
        title: 'Freelance Consultant Standardizes Client Engagements',
        client: 'Maria Rodriguez, Marketing Consultant',
        industry: 'Consulting & Marketing',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbnN1bHRhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        summary: 'Learn how a freelance marketing consultant used LegallyUp to create professional consultant agreements, clearly defining scope, payment, and IP rights.',
        challenge: "As a solo consultant, Maria found drafting individual contracts for each client time-consuming and was concerned about potential misunderstandings regarding project scope and deliverables.",
        solution: "Maria utilized LegallyUp's consultant agreement template to create a master agreement that she could quickly customize for each new client. This ensured consistency and clarity in all her engagements.",
        results: "She reported increased client confidence, fewer disputes over project scope, and faster onboarding of new projects. Having a professional agreement template saved her an estimated 5-10 hours per month.",
        tags: ['freelance', 'consulting', 'contract', 'client management', 'marketing']
    },
    {
        id: 'cs4',
        slug: 'ecommerce-store-streamlines-contracts',
        title: 'E-commerce Store Streamlines Vendor & Partnership Agreements',
        client: 'The Cozy Corner Store',
        industry: 'Retail & E-commerce',
        imageUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        summary: 'See how an online store owner quickly generated clear vendor contracts and partnership agreements, fostering better business relationships.',
        challenge: "The Cozy Corner Store was expanding its product line and needed to formalize agreements with new suppliers and collaborators, but lacked in-house legal resources.",
        solution: "LegallyUp provided accessible templates for service agreements and partnership agreements, which the store owner could adapt to their specific needs for vendor onboarding and collaborations.",
        results: "The store successfully onboarded new vendors with clear terms, leading to more reliable supply chains. Partnership collaborations were also formalized effectively, protecting the store's interests.",
        tags: ['ecommerce', 'small business', 'vendor agreement', 'partnership', 'retail']
    },
];

const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 50 } } };
const cardVariants = { hidden: { opacity: 0, y: 30, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }};


const CaseStudiesPage: React.FC = () => {
  return (
     <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
      className="bg-gray-100 min-h-screen" // Overall page background
    >
        <motion.section
            variants={sectionVariants}
            className="text-center py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white rounded-b-3xl md:rounded-b-[60px] shadow-2xl mb-16 px-4"
        >
            <Award size={64} className="mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
                Real Success Stories
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-0 max-w-3xl mx-auto leading-relaxed">
                Discover how LegallyUp empowers businesses and individuals to navigate legal complexities with confidence and ease.
            </p>
        </motion.section>

        <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
            <div className="max-w-3xl mx-auto">
                <Target size={48} className="mx-auto mb-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Why Our Case Studies Matter</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Explore tangible examples of how LegallyUp's intuitive platform and comprehensive templates deliver practical solutions to everyday legal challenges. Learn from the experiences of others and envision the benefits for your own needs.
                </p>
            </div>
        </motion.section>

        <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                Featured Use Cases
             </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {mockCaseStudies.map(study => (
                    <motion.div
                        key={study.id}
                        variants={cardVariants}
                        className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-2"
                    >
                        <div className="relative">
                            <img
                                src={study.imageUrl}
                                alt={study.title}
                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <span className="text-xs font-semibold text-white bg-accent/80 px-3 py-1 rounded-full uppercase tracking-wider">{study.industry}</span>
                                <h3 className="text-xl lg:text-2xl font-bold text-white mt-2 leading-tight">{study.title}</h3>
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{study.summary}</p>
                            <div className="mt-auto">
                                <Link
                                    to={`/case-studies/${study.slug}`}
                                    className="inline-flex items-center text-accent hover:text-primary font-semibold group transition-colors duration-200"
                                >
                                    Read Full Study
                                    <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>

        <motion.section variants={sectionVariants} className="py-16 bg-lightGray rounded-t-3xl md:rounded-t-[60px] mb-0 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="flex items-center justify-center mb-12">
                    <BarChart3 size={40} className="text-primary mr-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">Measurable Impact</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { value: "80%", title: "Time Saved", desc: "Average reduction in document creation time." },
                        { value: "65%", title: "Cost Reduction", desc: "Typical savings vs. traditional legal routes." },
                        { value: "95%+", title: "User Satisfaction", desc: "Reported by LegallyUp users." },
                    ].map(metric => (
                        <motion.div key={metric.title} variants={cardVariants} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
                            <p className="text-5xl font-bold text-accent mb-3">{metric.value}</p>
                            <h3 className="text-xl font-semibold text-primary">{metric.title}</h3>
                            <p className="text-gray-600 text-sm mt-2">{metric.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>

        {/* Client Quotes Section can remain similar or be integrated into individual case studies */}
        <motion.section variants={sectionVariants} className="py-16 bg-lightGray px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="flex items-center justify-center mb-12">
                        <BookText size={40} className="text-primary mr-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">What Our Clients Say</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div variants={cardVariants} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 italic text-gray-700 relative">
                        <span className="absolute top-4 left-4 text-6xl text-accent opacity-20 font-serif">“</span>
                        <p className="mb-4 text-lg relative z-10">"Using LegallyUp's templates was a game-changer for our small business. Simple, fast, and professional documents every time."</p>
                        <p className="font-semibold text-primary not-italic text-right">- Alex J., Innovatech Solutions</p>
                    </motion.div>
                    <motion.div variants={cardVariants} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 italic text-gray-700 relative">
                        <span className="absolute top-4 left-4 text-6xl text-accent opacity-20 font-serif">“</span>
                        <p className="mb-4 text-lg relative z-10">"The platform saved me hours on drafting lease agreements. Highly efficient and trustworthy for property management."</p>
                        <p className="font-semibold text-primary not-italic text-right">- Sarah B., Oak Property Management</p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    </motion.div>
  );
};

export default CaseStudiesPage;