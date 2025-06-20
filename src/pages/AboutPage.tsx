// src/pages/AboutPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Sparkles, Handshake, ShieldCheck, Lightbulb,  Shield
} from 'lucide-react';
import HeroBackground from '../components/ui/HeroBackground';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

const AboutPage: React.FC = () => {
  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  };

  const contentBlockVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const valueCardHover = {
    hover: {
      y: -8,
      boxShadow: "0px 15px 35px -10px rgba(var(--color-primary-rgb), 0.2)", // Use your primary color
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };


  const coreValuesData = [
    { icon: Users, title: "Accessibility", desc: "Legal help should be within everyone's reach, regardless of their background or resources, made simple and understandable." },
    { icon: Sparkles, title: "Simplicity", desc: "Our tools are intuitive and user-friendly, designed to reduce complexity and streamline every step of the legal process." },
    { icon: Handshake, title: "Trust", desc: "We are committed to delivering dependable, clear, and accurate solutions that our users can rely on with confidence." },
    { icon: ShieldCheck, title: "Security", desc: "Protecting your data and privacy is foundational to our service, employing robust measures to ensure your information is safe." },
  ];

  // Define CSS variables in a style tag or your global CSS for gradients
  // This is a common pattern if your Tailwind theme doesn't directly support complex gradients in 'style'
 

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="overflow-x-hidden bg-white"
    >
      {/* Hero Section - Full Screen */}
      <motion.section
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white overflow-hidden"
        variants={contentBlockVariants}
      >
        <HeroBackground />
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center">
              <Shield size={72} className="mx-auto opacity-90 text-white" strokeWidth={1.5} />
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-900"
            >
              About LegallyUp
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Empowering individuals and businesses with accessible, reliable legal solutions through innovative technology.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Our Journey Section - Clean and Focused */}
      

<motion.section
  id="our-journey"
  variants={sectionVariants}
  className="py-28 px-6 bg-white text-gray-900"
>
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <motion.div variants={sectionVariants} className="order-1 flex justify-center relative">
      {/* Sprinkles Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <span className="sprinkle sprinkle-1"></span>
        <span className="sprinkle sprinkle-2"></span>
        <span className="sprinkle sprinkle-3"></span>
        <span className="sprinkle sprinkle-4"></span>
        <span className="sprinkle sprinkle-5"></span>
      </div>
      <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl relative z-10">
        <Lightbulb size={100} className="text-white" strokeWidth={1.5} />
      </div>
    </motion.div>
    <motion.div variants={sectionVariants} className="order-2">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Journey From Idea to Impact</h2>
      <p className="text-lg md:text-xl leading-relaxed">
        LegallyUp was founded to make legal empowerment accessible to everyone. What began as a mission to simplify and streamline legal documents has grown into a platform that offers intuitive templates, educational resources, and connections to trusted legal professionals. Our journey is driven by innovation and a commitment to making the law work for all.
      </p>
    </motion.div>
  </div>
</motion.section>


      {/* Vision & Mission - Two-Column Layout on lightGray */}
      <motion.section
        variants={contentBlockVariants}
        className="py-20 md:py-28 px-6 bg-white rounded-t-[30px] md:rounded-t-[50px] rounded-b-[30px] md:rounded-b-[50px] my-12 md:my-16 mx-auto max-w-7xl lg:px-8" // Constrain width and center
      >
        <div className="container mx-auto">
            {/* Our Vision */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-16 md:mb-24">
  <motion.div variants={itemVariants} className="text-center md:text-left order-2 md:order-1">
    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">Our Vision for the Future</h2>
    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
      To be the globally trusted and indispensable platform where individuals and businesses confidently navigate their legal landscapes with unparalleled clarity, efficiency, and ease, fostering a future where expert legal support and understanding are accessible to all through innovative technology.
    </p>
  </motion.div>
  <motion.div variants={itemVariants} className="flex justify-center md:justify-end order-1 md:order-2 relative">
    {/* Sprinkles Animation */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <span className="sprinkle sprinkle-1"></span>
      <span className="sprinkle sprinkle-2"></span>
      <span className="sprinkle sprinkle-3"></span>
      <span className="sprinkle sprinkle-4"></span>
      <span className="sprinkle sprinkle-5"></span>
    </div>
    <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl relative z-10">
      <Sparkles size={100} className="text-white" strokeWidth={1.5} />
    </div>
  </motion.div>
</div>

            {/* Our Mission */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <motion.div variants={itemVariants} className="flex justify-center md:justify-start order-1 md:order-1 relative">
                  {/* Sprinkles Animation */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <span className="sprinkle sprinkle-1"></span>
                    <span className="sprinkle sprinkle-2"></span>
                    <span className="sprinkle sprinkle-3"></span>
                    <span className="sprinkle sprinkle-4"></span>
                    <span className="sprinkle sprinkle-5"></span>
                  </div>
                  <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl relative z-10">
                    <Handshake size={100} className="text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center md:text-left order-2 md:order-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">Our Core Mission</h2>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                        Our mission is to <strong className="text-accent font-semibold">democratize access to legal resources and support</strong>. We achieve this by providing exceptionally intuitive, highly affordable, and consistently reliable solutions designed to empower you at every turn—from drafting essential documents to connecting with seasoned legal professionals.
                    </p>
                </motion.div>
            </div>
        </div>
      </motion.section>

      {/* Core Values Grid - Enhanced Cards */}
      <motion.section
        variants={contentBlockVariants}
        className="py-20 md:py-28 px-6 bg-white text-center"
      >
        <motion.h2 variants={sectionHeaderVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-16 md:mb-20 tracking-tight">
            Our Guiding Principles
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {coreValuesData.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants} // Stagger individual cards
              whileHover="hover"
              custom // ensure custom prop for stagger is passed if needed by variants
              className="bg-lightGray p-8 rounded-3xl shadow-lg group flex flex-col items-center text-center transform transition-all duration-300 hover:!shadow-2xl hover:border-accent border-2 border-transparent"
            >
              <motion.div
                variants={valueCardHover} // Apply hover to the icon container
                className="p-6 bg-gradient-to-br from-primary to-accent text-white rounded-full mb-8 transform group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <value.icon size={44} strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">{value.title}</h3>
              <p className="text-gray-600 text-md leading-relaxed flex-grow">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Section - Using the new requested style */}
      <motion.div
        variants={contentBlockVariants}
        className="py-16 md:py-20 px-4 sm:px-6 lg:px-8" // Outer spacing
      >
        <div
          className="bg-gradient-to-br from-primary  to-accent text-white rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-10 sm:p-12 md:p-16 lg:p-20 shadow-2xl text-center max-w-4xl mx-auto"
          style={{backgroundImage: "" }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight"
          >
            Ready to Streamline Your Legal Needs?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-md sm:text-lg text-white/90 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Eliminate legal bottlenecks. Begin automating your documents or explore templates and legal support tools with LegallyUp.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/documents/generate"
              className="inline-block bg-white text-primary px-10 py-4 sm:px-14 sm:py-5 rounded-2xl text-lg sm:text-xl font-semibold hover:bg-gray-200 transition-colors duration-300 shadow-xl transform hover:scale-105 active:scale-100"
            >
              Generate Your Document
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;