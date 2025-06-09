// src/pages/PricingPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Might need Link for CTA buttons

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const PricingPage: React.FC = () => {
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
      className="py-8 text-center" // Inherits container/padding from Layout, adds vertical padding, centers content
    >

        {/* NEW: Pricing Page Hero Section */}
        <motion.section variants={sectionVariants} className="py-16 bg-lightGray rounded-3xl mb-16 px-4 sm:px-6 lg:px-8"> {/* Generous padding, light gray background, rounded corners, margin-bottom */}
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Simple & Transparent Pricing
            </h1>
            <p className="text-xl text-textColor mb-0 max-w-3xl mx-auto leading-relaxed">
                Choose the plan that best suits your needs, whether you're an individual or a legal professional.
            </p>
        </motion.section>

        {/* Plan Cards */}
       <motion.section variants={sectionVariants} className="mb-16"> {/* Generous margin-bottom */}
            <h2 className="text-4xl font-bold text-primary mb-12">Our Plans</h2> {/* Large heading */}
             {/* Pricing Table Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Free Tier Card */}
               <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-lightGray flex flex-col"> {/* Card styling, border top */}
                   <h3 className="text-2xl font-bold text-primary mb-4">Free</h3>
                   <p className="text-5xl font-bold text-accent mb-4">$0<span className="text-lg text-textColor font-normal">/month</span></p>
                   <p className="text-textColor mb-6 flex-grow leading-relaxed">Basic access for individuals needing simple legal documents occasionally.</p>
                   <ul className="text-textColor text-left space-y-3 mb-8 list-disc list-inside"> {/* Feature list */}
                       <li>Limited document generations per month</li>
                       <li>Access to basic template categories</li>
                       <li>Standard support</li>
                       {/* Add more features */}
                   </ul>
                   {/* CTA Button */}
                   <Link
                        to="/signup" // Link to signup for free
                        className="mt-auto inline-block bg-lightGray text-primary border border-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-colors duration-200 font-semibold text-lg"
                    >
                       Get Started (Free)
                   </Link>
               </div>

                {/* Pro Tier Card (Highlighted) */}
               <div className="bg-primary text-white p-8 rounded-2xl shadow-xl border-t-8 border-accent flex flex-col transform scale-105"> {/* Highlighted styling: primary bg, accent border, scale up */}
                   <h3 className="text-2xl font-bold mb-4">Pro</h3>
                   <p className="text-5xl font-bold text-accent mb-4">$XX<span className="text-lg font-normal">/month</span></p> {/* Accent price */}
                   <p className="mb-6 flex-grow leading-relaxed">Ideal for frequent users and small businesses with diverse legal needs.</p>
                   <ul className="text-white text-left space-y-3 mb-8 list-disc list-inside"> {/* Feature list */}
                       <li>Unlimited document generations</li>
                       <li>Access to all premium templates</li>
                       <li>Priority support</li>
                       <li>Discounted attorney consults</li>
                       {/* Add more features */}
                   </ul>
                   {/* CTA Button */}
                   <Link
                        to="/signup?plan=pro" // Link to signup with Pro pre-selected
                        className="mt-auto inline-block bg-accent text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 font-semibold text-lg"
                    >
                       Choose Pro
                   </Link>
               </div>

                {/* Attorney Tier Card */}
               <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-lightGray flex flex-col"> {/* Card styling, border top */}
                   <h3 className="text-2xl font-bold text-primary mb-4">Attorney</h3>
                   <p className="text-5xl font-bold text-accent mb-4">$YY<span className="text-lg text-textColor font-normal">/month</span></p> {/* Accent price */}
                   <p className="text-textColor mb-6 flex-grow leading-relaxed">Designed for legal professionals joining our attorney directory.</p>
                   <ul className="text-textColor text-left space-y-3 mb-8 list-disc list-inside"> {/* Feature list */}
                       <li>Listing in Attorney Directory</li>
                       <li>Connect with LegallyUp users</li>
                       <li>Manage consultations via dashboard</li>
                       <li>... and more</li>
                       {/* Add more features */}
                   </ul>
                   {/* CTA Button */}
                   <Link
                        to="/signup?plan=attorney" // Link to signup with Attorney pre-selected
                        className="mt-auto inline-block bg-lightGray text-primary border border-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-colors duration-200 font-semibold text-lg"
                    >
                       Join as Attorney
                   </Link>
               </div>
           </div>
       </motion.section>

        {/* Feature Comparison Table (Placeholder) */}
       <motion.section variants={sectionVariants} className="py-16 bg-lightGray rounded-3xl mb-16 px-4 sm:px-6 lg:px-8">
             <h2 className="text-4xl font-bold text-primary mb-12">Feature Comparison</h2> {/* Large heading */}
             {/* TODO: Implement a detailed comparison table */}
             <div className="overflow-x-auto"> {/* Make table scrollable on small screens */}
                 <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden"> {/* Basic table styling */}
                     <thead>
                         <tr className="bg-primary text-white">
                             <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Feature</th>
                             <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Free</th>
                             <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Pro</th>
                              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Attorney</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-lightGray text-textColor">
                         {/* Example rows */}
                         <tr>
                             <td className="px-6 py-4 font-semibold">Document Generations</td>
                             <td className="px-6 py-4 text-center">5/month</td>
                             <td className="px-6 py-4 text-center">Unlimited</td>
                             <td className="px-6 py-4 text-center">N/A</td>
                         </tr>
                          <tr>
                             <td className="px-6 py-4 font-semibold">Template Access</td>
                             <td className="px-6 py-4 text-center">Basic</td>
                             <td className="px-6 py-4 text-center">All (including Premium)</td>
                             <td className="px-6 py-4 text-center">Basic Templates + Attorney Specific</td>
                         </tr>
                         <tr>
                             <td className="px-6 py-4 font-semibold">Attorney Directory Listing</td>
                             <td className="px-6 py-4 text-center">-</td>
                             <td className="px-6 py-4 text-center">-</td>
                             <td className="px-6 py-4 text-center"><span className="text-accent font-bold">✓</span></td>
                         </tr>
                          <tr>
                             <td className="px-6 py-4 font-semibold">Attorney Consults</td>
                             <td className="px-6 py-4 text-center">Standard Rate</td>
                             <td className="px-6 py-4 text-center">Discounted Rate</td>
                             <td className="px-6 py-4 text-center">Manage Consults</td>
                         </tr>
                          <tr>
                             <td className="px-6 py-4 font-semibold">Dashboard Access</td>
                             <td className="px-6 py-4 text-center">Limited</td>
                             <td className="px-6 py-4 text-center">Full</td>
                             <td className="px-6 py-4 text-center">Full (Attorney Specific)</td>
                         </tr>
                         {/* Add more feature rows */}
                     </tbody>
                 </table>
             </div>
       </motion.section>

        {/* FAQs Section (Placeholder) */}
       <motion.section variants={sectionVariants} className="py-8 mb-12"> {/* Add padding, margin-bottom */}
             <h2 className="text-4xl font-bold text-primary mb-12">Pricing FAQs</h2> {/* Large heading */}
             {/* TODO: Implement FAQ accordion or list */}
             <div className="max-w-3xl mx-auto space-y-6 text-left"> {/* Center content */}
                 <div className="bg-white p-6 rounded-lg shadow-md border border-lightGray">
                     <h3 className="text-xl font-semibold text-accent mb-3">How does the Free plan work?</h3>
                     <p className="text-textColor">The Free plan allows you to generate a limited number of documents per month using basic templates. It's a great way to try LegallyUp for simple needs.</p>
                 </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border border-lightGray">
                     <h3 className="text-xl font-semibold text-accent mb-3">What are premium templates?</h3>
                     <p className="text-textColor">Premium templates are more complex or specialized documents available exclusively to Pro subscribers, designed by legal experts.</p>
                 </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border border-lightGray">
                     <h3 className="text-xl font-semibold text-accent mb-3">Can I change my plan later?</h3>
                     <p className="text-textColor">Yes, you can upgrade or downgrade your plan from your dashboard settings at any time.</p>
                 </div>
                  {/* Add more FAQs */}
             </div>
       </motion.section>


    </motion.div>
  );
};

export default PricingPage;