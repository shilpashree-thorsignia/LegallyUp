// src/pages/CaseStudiesPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Using Link for "Read More" buttons

// Placeholder data for case studies
const mockCaseStudies = [
    { id: 'cs1', title: 'Startup Secures IP with Quick NDAs', client: 'Tech Startup', industry: 'Software', imageUrl: 'https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Case+Study+1', summary: 'How a new tech company streamlined contracting by using LegallyUp for Non-Disclosure Agreements.' },
    { id: 'cs2', title: 'Landlord Manages Properties Efficiently', client: 'Individual Landlord', industry: 'Real Estate', imageUrl: 'https://via.placeholder.com/400x250/1F3B4D/FFFFFF?text=Case+Study+2', summary: 'Discover how one landlord simplified lease generation and tenant agreements.' },
    { id: 'cs3', title: 'Consultant Agreement Success Story', client: 'Freelance Consultant', industry: 'Consulting', imageUrl: 'https://via.placeholder.com/400x250/F5F7FA/2C2C2C?text=Case+Study+3', summary: 'Learn how a freelance consultant standardized contracts and protected their work.' },
     { id: 'cs4', title: 'Small Business Contracts Made Easy', client: 'E-commerce Store', industry: 'Retail', imageUrl: 'https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Case+Study+4', summary: 'See how an online store owner quickly generated vendor and partnership agreements.' },
    // Add more case studies
];

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const CaseStudiesPage: React.FC = () => {
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

        {/* NEW: Case Studies Hero Section */}
        <motion.section variants={sectionVariants} className="text-center py-16 bg-lightGray rounded-3xl mb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Real Success Stories
            </h1>
            <p className="text-xl text-textColor mb-0 max-w-3xl mx-auto leading-relaxed">
                See how LegallyUp has helped individuals and businesses like yours simplify legal processes and achieve their goals.
            </p>
        </motion.section>

        {/* Intro Section - Why Case Studies Matter */}
        <motion.section variants={sectionVariants} className="mb-16 text-center max-w-4xl mx-auto"> {/* Margin bottom, centered text, max-width */}
            <h2 className="text-4xl font-bold text-primary mb-8">Why Read Our Case Studies?</h2> {/* Large heading */}
            <p className="text-lg text-textColor leading-relaxed">
                Our case studies showcase real-world examples of how LegallyUp's document generation, template library, and attorney access features can provide practical solutions to common legal challenges. Learn from others' experiences and see the potential benefits for yourself.
            </p>
        </motion.section>


        {/* Grid of Use Cases (Case Study Cards) */}
        <motion.section variants={sectionVariants} className="py-8 mb-16"> {/* Add padding, margin-bottom */}
             <h2 className="text-4xl font-bold text-primary mb-12 text-center">Explore Use Cases</h2> {/* Large heading, centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Responsive grid */}
                {mockCaseStudies.map(study => (
                    <div
                        key={study.id}
                        className="bg-white p-6 rounded-xl shadow-md border border-lightGray flex flex-col" // Card styling, flex column
                    >
                         {/* Image Placeholder */}
                        <img
                            src={study.imageUrl}
                            alt={study.title}
                            className="w-full h-40 object-cover rounded-t-xl mb-4" // Full width, fixed height, object-cover, rounded top
                        />
                        <div className="flex-grow"> {/* Content area takes remaining space */}
                            <p className="text-sm font-semibold text-accent mb-1">{study.client} ({study.industry})</p> {/* Client/Industry */}
                            <h3 className="text-xl font-semibold text-primary mb-3">{study.title}</h3> {/* Title */}
                            <p className="text-textColor text-sm leading-relaxed mb-4">{study.summary}</p> {/* Summary */}
                        </div>
                        {/* Placeholder Link to Full Case Study (If applicable) */}
                        {/* In a real app, this would link to a dynamic route like /case-studies/:id */}
                         <button
                            onClick={() => alert(`Placeholder: Navigating to full case study for "${study.title}"`)}
                            className="self-start text-accent hover:underline font-semibold mt-auto" // Align to bottom, accent color
                        >
                            Read More →
                        </button>
                    </div>
                ))}
            </div>
             {/* Optional: Add a CTA to view all case studies or share your story */}
             {/*
              <div className="mt-12 text-center">
                 <Link to="#" className="inline-block text-accent hover:underline text-lg font-semibold">
                     View More Case Studies →
                 </Link>
             </div>
             */}
        </motion.section>

         {/* Impact Metrics Section (Placeholder) */}
        <motion.section variants={sectionVariants} className="py-16 bg-lightGray rounded-3xl mb-16 px-4 sm:px-6 lg:px-8">
             <h2 className="text-4xl font-bold text-primary mb-12 text-center">Measurable Impact</h2>
             {/* TODO: Implement visual representation of metrics (charts, stats cards) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center"> {/* Grid for metric cards */}
                 <div className="bg-white p-8 rounded-2xl shadow-md border border-lightGray">
                     <p className="text-5xl font-bold text-accent mb-3">80%</p>
                     <h3 className="text-xl font-semibold text-primary">Time Saved</h3>
                     <p className="text-textColor text-sm mt-2">Average time reduction in document creation.</p>
                 </div>
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-lightGray">
                     <p className="text-5xl font-bold text-accent mb-3">65%</p>
                     <h3 className="text-xl font-semibold text-primary">Cost Reduction</h3>
                     <p className="text-textColor text-sm mt-2">Typical savings compared to traditional methods.</p>
                 </div>
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-lightGray">
                     <p className="text-5xl font-bold text-accent mb-3">95%+</p>
                     <h3 className="text-xl font-semibold text-primary">User Satisfaction</h3>
                     <p className="text-textColor text-sm mt-2">High satisfaction reported by LegallyUp users.</p>
                 </div>
             </div>
        </motion.section>

        {/* Client Quotes Section (Placeholder) */}
        <motion.section variants={sectionVariants} className="py-8 mb-12">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">Client Testimonials</h2>
            {/* TODO: Implement a list or grid of quotes, perhaps linked to case studies */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Example Quote Card */}
                 <div className="bg-lightGray p-8 rounded-2xl shadow-md border border-white italic text-textColor relative"> {/* Using lightGray background here */}
                     <span className="absolute top-0 left-0 text-5xl text-accent opacity-50 translate-x-4 -translate-y-4">"</span>
                     <p className="mb-4">"Using LegallyUp's templates was a game-changer for our small business. Simple, fast, and professional."</p>
                     <p className="font-semibold text-primary not-italic">- Alex J., Satisfied Client</p>
                      <span className="absolute bottom-0 right-0 text-5xl text-accent opacity-50 -translate-x-4 translate-y-4">"</span>
                 </div>
                  <div className="bg-lightGray p-8 rounded-2xl shadow-md border border-white italic text-textColor relative"> {/* Using lightGray background here */}
                     <span className="absolute top-0 left-0 text-5xl text-accent opacity-50 translate-x-4 -translate-y-4">"</span>
                     <p className="mb-4">"The platform saved me hours on legal documents. Highly efficient and trustworthy."</p>
                     <p className="font-semibold text-primary not-italic">- Maria P., Happy User</p>
                     <span className="absolute bottom-0 right-0 text-5xl text-accent opacity-50 -translate-x-4 translate-y-4">"</span>
                 </div>
                 {/* Add more quotes */}
             </div>
        </motion.section>

    </motion.div>
  );
};

export default CaseStudiesPage;