// src/pages/AboutPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
// Import relevant Lucide icons
import {
  Users,        // For Accessibility (reaching people) or Community
  Sparkles,     // For Simplicity (making things clear, easy, shiny) or Innovation
  ShieldCheck,  // For Trust & Security
  KeyRound,     // For Security or Access
  Eye,          // For Vision
  Milestone,    // For Journey or Story
  Route,        // Alternative for Journey
  HeartHandshake, // For Trust or Empathy
  Lightbulb,    // For Innovation or Simplicity
  Handshake,     // For Trust or Partnership
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Updated Core Values with more relevant Lucide icons
  const coreValuesData = [
    {
      icon: Users, // Represents reaching and serving all users
      title: "Accessibility",
      desc: "Legal help should be within everyone's reach, regardless of their background or resources.",
    },
    {
      icon: Sparkles, // Represents clarity, ease, and a polished, simple experience
      title: "Simplicity",
      desc: "Our tools are intuitive and user-friendly, reducing complexity at every step of the legal process.",
    },
    {
      icon: Handshake, // Represents building trust and reliable partnerships
      title: "Trust",
      desc: "We are committed to delivering dependable, clear, and accurate solutions that our users can rely on.",
    },
    {
      icon: ShieldCheck, // Directly represents security and protection
      title: "Security",
      desc: "Protecting your data and privacy is foundational to our service and a responsibility we take seriously.",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="overflow-x-hidden"
    >
      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/10 via-accent/5 to-white text-primary px-6 pt-28 pb-16 md:pt-32 md:pb-20"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 md:mb-8 leading-tight tracking-tight">
          Empowering the Future of Legal Simplicity
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl leading-relaxed text-textColor/90">
          At LegallyUp, we believe that navigating legal challenges shouldn't be intimidating or expensive.
        </p>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        variants={sectionVariants}
        className="py-20 md:py-24 px-6 bg-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Mission</h2>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-textColor max-w-4xl mx-auto leading-relaxed"
        >
          We aim to <strong>democratize access to legal resources</strong>. Whether you're drafting your first NDA or managing property agreements, LegallyUp delivers easy-to-use, affordable, and legally sound solutions tailored to your needs.
        </motion.p>
      </motion.section>

      {/* Our Vision Section - Distinct Section */}
      <motion.section
        variants={sectionVariants}
        className="py-20 md:py-24 px-6 bg-lightGray text-center rounded-3xl md:rounded-[50px] mx-4 sm:mx-6 my-10 md:my-16" // Added horizontal and vertical margins for separation
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Vision</h2>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-textColor max-w-4xl mx-auto leading-relaxed"
        >
          To be the leading platform where individuals and businesses confidently manage their legal affairs with clarity and ease, fostering a world where legal understanding is accessible to all, supported by innovative technology and expert guidance.
        </motion.p>
       
      </motion.section>

      {/* Our Journey Section - Distinct Section */}
      <motion.section
        variants={sectionVariants}
        className="py-20 md:py-24 px-6 bg-white text-left" // Changed to bg-white for alternation
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            <Milestone size={36} className="inline-block mr-3 mb-1 text-primary" /> {/* Icon for Journey */}
            Our Journey
          </h2>
          <motion.div variants={itemVariants} className="space-y-6 text-lg md:text-xl text-textColor leading-relaxed">
            <p>
              The inception of LegallyUp stemmed from a shared challenge: navigating everyday legal tasks shouldn't require expensive legal counsel or hours of research. Our founders, passionate about simplifying complex processes, envisioned a platform where legal document creation could be intuitive and efficient.
            </p>
            <p>
              With that core belief, they launched LegallyUp, focusing initially on providing clear, customizable templates for common legal needs. As we've grown, our commitment has expanded. Today, LegallyUp is more than just a document generator; it's a growing ecosystem that connects users with qualified legal professionals, offering a comprehensive approach to legal empowerment.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values Grid */}
      <motion.section
        variants={sectionVariants}
        className="py-20 md:py-24 px-6 bg-lightGray text-center rounded-3xl md:rounded-[50px] mx-4 sm:mx-6 my-10 md:my-16" // bg-lightGray for alternation, added margins
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 md:mb-16">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {coreValuesData.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-primary/20 transition-shadow duration-300 flex flex-col items-center text-center" // Cards are white on lightGray bg
            >
              <div className="mb-5 text-accent">
                <value.icon size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">{value.title}</h3>
              <p className="text-textColor text-sm leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;