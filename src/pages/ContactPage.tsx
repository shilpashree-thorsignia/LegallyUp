// src/pages/ContactPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Using Link for mailto

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ContactPage: React.FC = () => {

    // Placeholder for form submission logic
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement form submission logic (e.g., collect data, send to backend API)
        alert("Placeholder: Form submitted! (Data not sent)");
        // Reset form fields here if successful
    };


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

        {/* NEW: Contact Page Hero Section */}
        <motion.section variants={sectionVariants} className="text-center py-16 bg-lightGray rounded-3xl mb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Get in Touch
            </h1>
            <p className="text-xl text-textColor mb-0 max-w-3xl mx-auto leading-relaxed">
                Have questions, feedback, or need support? We're here to help.
            </p>
        </motion.section>

        {/* Contact Form and Info */}
       <motion.section variants={sectionVariants} className="py-8 mb-16"> {/* Add padding, margin-bottom */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> {/* Grid for form and info side-by-side */}
                 {/* Contact Form */}
                 <div className="bg-white p-8 rounded-2xl shadow-md border border-lightGray"> {/* Card styling */}
                     <h2 className="text-3xl font-semibold text-primary mb-6">Send Us a Message</h2> {/* Heading */}
                     <form onSubmit={handleSubmit} className="space-y-6"> {/* Form structure with spacing */}
                         <div>
                             <label htmlFor="name" className="block text-primary font-semibold mb-2">Name</label> {/* Label with primary color */}
                             <input
                                 type="text"
                                 id="name"
                                 name="name"
                                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor" // Input styling
                                 required
                             />
                         </div>
                         <div>
                             <label htmlFor="email" className="block text-primary font-semibold mb-2">Email</label>
                             <input
                                 type="email"
                                 id="email"
                                  name="email"
                                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor"
                                 required
                             />
                         </div>
                         <div>
                             <label htmlFor="message" className="block text-primary font-semibold mb-2">Message</label>
                             <textarea
                                 id="message"
                                 name="message"
                                 rows={5}
                                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor"
                                 required
                             ></textarea>
                         </div>
                         <button
                             type="submit"
                             className="bg-primary text-white px-8 py-3 rounded-md hover:bg-accent transition-colors duration-200 font-semibold text-lg" // CTA button styling
                         >
                             Send Message
                         </button>
                     </form>
                 </div>

                  {/* Contact Info */}
                  <div className="p-8 rounded-2xl shadow-md bg-lightGray border border-white"> {/* Card styling, lightGray background */}
                       <h2 className="text-3xl font-semibold text-primary mb-6">Contact Information</h2> {/* Heading */}
                       <div className="space-y-6 text-textColor text-lg"> {/* Text content with spacing */}
                           <p><span className="font-semibold text-primary">Support Email:</span> <a href="mailto:support@legallyup.com" className="text-accent hover:underline transition-colors duration-200">support@legallyup.com</a></p>
                           <p><span className="font-semibold text-primary">Sales Email:</span> <a href="mailto:sales@legallyup.com" className="text-accent hover:underline transition-colors duration-200">sales@legallyup.com</a></p>
                            {/* Optional Phone */}
                           {/* <p><span className="font-semibold text-primary">Phone:</span> (123) 456-7890</p> */}
                            {/* Optional Address */}
                           {/* <p><span className="font-semibold text-primary">Address:</span> 123 Legal Lane, Suite 456, Law City, ST 98765</p> */}
                       </div>
                        {/* Optional Map Placeholder */}
                         {/*
                         <div className="mt-8 w-full h-60 bg-white rounded-lg border border-lightGray flex items-center justify-center text-textColor/60 italic">
                            Map Placeholder
                         </div>
                         */}
                  </div>
             </div>
       </motion.section>

        {/* Secondary Contact Method / CTA (Placeholder) */}
        <motion.section variants={sectionVariants} className="text-center py-16 bg-primary text-white rounded-3xl mb-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">Need Immediate Assistance?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                For urgent inquiries, consider using our live chat support (if available) or check our <Link to="/resources" className="text-accent hover:underline font-semibold">Legal Resources</Link> page.
            </p>
            {/* Placeholder for Live Chat Button or specific support CTA */}
            <button className="bg-accent text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 font-semibold text-lg">
                Start Live Chat (Placeholder)
            </button>
        </motion.section>


    </motion.div>
  );
};

export default ContactPage;