// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  FileText, ShieldCheck, Lock, Users, CheckSquare, ArrowRight, BookOpen, Layers, Briefcase, Home as HomeIcon, Zap, ThumbsUp, MousePointer, FileEdit
} from 'lucide-react';

// Animation Variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0 }
};

const contentBlockVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const floatingIconVariants = (
    delay: number,
    durationRange: [number, number] = [10, 15],
    yRange: [number, number] = [-15, 15],
    xRange: [number, number] = [-10, 10]
  ): Variants => {
  const duration = Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0];
  const yStart = Math.random() * (yRange[1] - yRange[0]) + yRange[0];
  const yEnd = Math.random() * (yRange[1] - yRange[0]) + yRange[0];
  const xStart = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
  const xEnd = Math.random() * (xRange[1] - xRange[0]) + xRange[0];

  return {
    initial: { opacity: 0, scale: 0.7, y: yStart / 2, x: xStart / 2 },
    animate: {
      opacity: [0, 0.5, 0.5, 0.5, 0], // Adjusted for longer visibility during float
      scale: [0.7, 1, 1, 1, 0.7],
      y: [yStart, yEnd, yStart, yEnd / 2, yStart],
      x: [xStart, xEnd, xStart / 2, xEnd, xStart],
      transition: {
        duration: duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: delay,
      },
    },
    appear: {
        opacity: 0.5, // Initial visible opacity
        scale: 1,
        y: 0,
        x: 0,
        transition: {duration: 0.8, delay: delay + 0.3, ease: "easeOut"} // Slightly shorter delay for appearance
    }
  };
};


const HomePage: React.FC = () => {
 

  const features = [
    { icon: <FileEdit size={36} />, title: "Smart Document Builder", desc: "Craft custom legal documents with our intuitive, step-by-step smart forms, powered by expert-vetted templates." },
    { icon: <Layers size={36} />, title: "Comprehensive Template Suite", desc: "Access an extensive and growing library of legal templates for diverse personal and business requirements." },
    { icon: <Users size={36} />, title: "Attorney Network Access", desc: "Seamlessly find, connect, and consult with qualified legal professionals for personalized advice when you need it most." },
    { icon: <ShieldCheck size={36} />, title: "Encrypted Document Vault", desc: "Securely store and manage your generated documents in your personal, encrypted dashboard for easy access anytime, anywhere." },
    { icon: <Zap size={36} />, title: "Instant Export Options", desc: "Download your finalized documents immediately in standard, professional formats like PDF or DOCX." },
    { icon: <MousePointer size={36} />, title: "User-Centric Dashboard", desc: "Manage your profile, view saved documents, track activity, and access support all in one streamlined place." },
  ];

  const howItWorksSteps = [
    { num: 1, icon: <BookOpen size={32}/>, title: "Select Your Template", desc: "Choose from our diverse library of professionally drafted legal documents tailored to your specific needs." },
    { num: 2, icon: <FileEdit size={32}/>, title: "Customize with Ease", desc: "Answer simple questions in our guided forms to input your details and customize the document precisely." },
    { num: 3, icon: <CheckSquare size={32}/>, title: "Generate & Download", desc: "Instantly create, review, and download your professional legal document in your preferred format." },
  ];

  const templateCategories = [
    { slug: 'nda', icon: <Lock size={36}/>, title: "NDAs", desc: "Protect sensitive information." },
    { slug: 'rental', icon: <HomeIcon size={36}/>, title: "Rental Agreements", desc: "For residential & commercial leases." },
    { slug: 'employment', icon: <Briefcase size={36}/>, title: "Employment Docs", desc: "Contracts, offer letters, & more." },
    { slug: 'business', icon: <Layers size={36}/>, title: "Business Contracts", desc: "Essential operational agreements." },
  ];

  const whyChooseUs = [
      { icon: <ThumbsUp size={32}/>, title: "Expert-Backed & Reliable", desc: "Our templates are meticulously developed with legal expertise, providing a solid foundation you can trust."},
      { icon: <Zap size={32}/>, title: "Fast & Intuitive", desc: "Generate complex documents in minutes with our user-friendly, step-by-step interface designed for clarity."},
      { icon: <ShieldCheck size={32}/>, title: "Secure & Private by Design", desc: "We prioritize your data security and privacy, employing robust measures to ensure your information is protected."},
      { icon: <Users size={32}/>, title: "Accessible Legal Support", desc: "Easily find and connect with qualified attorneys through our integrated network for personalized advice."}
  ];

  const testimonials = [
      { quote: "LegallyUp revolutionized how I handle NDAs. It's incredibly fast and the documents are top-notch. A huge time and money saver!", author: "Alex R., Tech Startup Founder", clientCompany: "Innovate Solutions" },
      { quote: "As a landlord, generating lease agreements used to be a hassle. LegallyUp made it a breeze. The templates are comprehensive and easy to customize.", author: "Sarah B., Property Manager", clientCompany: "Oakview Properties"},
  ];


  return (
    <motion.div
      initial="initial" // Corresponds to pageVariants.initial
      animate="animate" // Corresponds to pageVariants.animate
      exit="exit"       // Corresponds to pageVariants.exit
      variants={pageVariants}
      className="overflow-x-hidden bg-gray-50"
    >
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-primary to-accent w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden text-white"
        variants={contentBlockVariants} // This section itself will animate in
        // initial="hidden" // Already handled by pageVariants if this is a direct child
        // animate="visible"
      >
        {/* Darkening overlay for even better text contrast if needed - adjust opacity */}
        <div className="absolute inset-0 bg-black/30 z-0"></div> {/* Increased opacity for better contrast */}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"> {/* Increased gap for more space */}
            {/* Left Text Content */}
            <motion.div variants={{visible: {transition: {staggerChildren: 0.2}}}}>
              <motion.h1
                variants={titleContainer} initial="hidden" animate="visible" // Animate words
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter text-white"
                style={{ textShadow: '0 3px 12px rgba(0,0,0,0.4)'}}
              >
                {titleWords.map((word, i) => (
                  <motion.span key={i} variants={titleWord} className="inline-block mr-2.5 md:mr-3.5 text-white" style={{ textShadow: '0 3px 12px rgba(0,0,0,0.4)'}}>
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-gray-100 mb-10 lg:mb-12 max-w-xl leading-relaxed md:pr-6" // Brighter text (text-gray-100 or text-white/90), added right padding on md
              >
                Generate compliance-ready legal documentation such as NDAs and lease contracts. Browse a robust template library or get expert assistance—fast, secure, and scalable.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  to="/documents/generate"
                  className="
                    inline-flex items-center gap-2.5 
                    bg-white text-primary  
                    px-10 py-4 sm:px-12 sm:py-4 
                    rounded-xl text-md sm:text-lg font-bold 
                    hover:bg-gray-200 hover:text-primary-dark
                    transition-all duration-300 
                    shadow-xl hover:shadow-2xl 
                    transform hover:scale-105 active:scale-95
                  "
                >
                  Launch Document Builder <ArrowRight size={22} strokeWidth={2.5}/>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Animation Area - Floating Legal Icons */}
            <motion.div
                variants={itemVariants}
                className="hidden md:flex items-center justify-center relative w-full h-80 md:h-96 lg:h-[500px] pointer-events-none"
            >
                {/* Central, slightly more opaque element */}
                <FileText size={180} strokeWidth={0.7} className="text-white opacity-40 transform rotate-[-8deg]" />

                {/* Floating Icons - Brighter and slightly thicker stroke */}
                <motion.div className="absolute text-white" variants={floatingIconVariants(0.2)} initial="initial" animate={["appear", "animate"]} style={{ top: '10%', left: '15%' }}>
                    <ShieldCheck size={70} strokeWidth={0.9} className="opacity-60" />
                </motion.div>
                <motion.div className="absolute text-white" variants={floatingIconVariants(0.5, [12,18], [-20,20], [-15,15])} initial="initial" animate={["appear", "animate"]} style={{ top: '60%', left: '70%' }}>
                    <Lock size={55} strokeWidth={0.9} className="opacity-50" />
                </motion.div>
                <motion.div className="absolute text-white" variants={floatingIconVariants(0.8, [8,12], [-15,15], [-25,25])} initial="initial" animate={["appear", "animate"]} style={{ bottom: '15%', left: '25%' }}>
                    <Users size={65} strokeWidth={0.9} className="opacity-50" />
                </motion.div>
                <motion.div className="absolute text-white" variants={floatingIconVariants(1.1, [7,10], [-10,10], [-10,10])} initial="initial" animate={["appear", "animate"]} style={{ top: '20%', right: '10%' }}>
                    <CheckSquare size={50} strokeWidth={0.9} className="opacity-60" />
                </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>


      {/* Features Section */}
      <motion.section variants={sectionVariants} className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Features</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">Everything You Need, Simplified</h2>
            <p className="text-lg text-textColor mt-4 max-w-2xl mx-auto">LegallyUp offers a powerful suite of tools to streamline your legal document needs.</p>
          </motion.div>
          <motion.div variants={{visible: {transition: {staggerChildren: 0.1}}}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover="hover"
                className="bg-lightGray p-8 rounded-2xl shadow-lg group flex flex-col text-center items-center transform transition-all duration-300 hover:border-primary border-2 border-transparent"
              >
                <div className="p-5 bg-gradient-to-br from-primary to-accent text-white rounded-full mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                  {React.cloneElement(feature.icon, { strokeWidth: 2 })}
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">{feature.title}</h3>
                <p className="text-textColor text-sm leading-relaxed flex-grow">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section variants={sectionVariants} className="py-20 md:py-28 bg-lightGray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Easy Process</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">Get Your Documents in 3 Simple Steps</h2>
          </motion.div>
          <motion.div variants={{visible: {transition: {staggerChildren: 0.2}}}} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((step, index) => (
              <motion.div key={step.num} variants={itemVariants} className="text-center p-6 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-accent text-white rounded-full mx-auto mb-6 text-2xl font-bold shadow-md">
                  {step.num}
                </div>
                <div className="mb-4 text-primary">{React.cloneElement(step.icon, {size: 40, strokeWidth: 1.5})}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
                <p className="text-textColor text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Top Template Categories Section */}
      <motion.section variants={sectionVariants} className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Quick Access</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">Popular Template Categories</h2>
          </motion.div>
          <motion.div variants={{visible: {transition: {staggerChildren: 0.1}}}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {templateCategories.map(category => (
              <motion.div key={category.slug} variants={itemVariants} whileHover="hover" className="group">
                <Link to={`/templates?category=${category.slug}`} className="block bg-lightGray p-8 rounded-2xl shadow-lg text-center transform transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl">
                  <div className="mb-4 text-accent group-hover:text-white transition-colors duration-300">
                     {React.cloneElement(category.icon, { strokeWidth: 1.5 })}
                  </div>
                  <h3 className="text-xl font-semibold text-primary group-hover:text-white mb-2 transition-colors duration-300">{category.title}</h3>
                  <p className="text-textColor text-sm group-hover:text-white/80 transition-colors duration-300">{category.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <Link to="/templates" className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-accent-dark transition-colors duration-300 shadow-md transform hover:scale-105">
              View All Templates <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose LegallyUp Section */}
      <motion.section variants={sectionVariants} className="py-20 md:py-28 bg-lightGray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Advantage</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">Why Choose LegallyUp?</h2>
          </motion.div>
          <motion.div variants={{visible: {transition: {staggerChildren: 0.15}}}} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {whyChooseUs.map(item => (
              <motion.div key={item.title} variants={itemVariants} className="flex items-start gap-5 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex-shrink-0 p-3.5 bg-primary/10 text-primary rounded-xl">
                  {React.cloneElement(item.icon, { strokeWidth: 2, size: 28 })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-textColor text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section variants={sectionVariants} className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Social Proof</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">Trusted by Users Like You</h2>
          </motion.div>
          <motion.div variants={{visible: {transition: {staggerChildren: 0.2}}}} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-lightGray p-8 rounded-2xl shadow-xl relative border-l-4 border-accent"
              >
                <p className="text-lg text-textColor italic mb-6 relative z-10">"{testimonial.quote}"</p>
                <div className="text-right">
                    <p className="font-semibold text-primary not-italic">{testimonial.author}</p>
                    <p className="text-sm text-textColor/80 not-italic">{testimonial.clientCompany}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Final Call-to-Action Section */}
      <motion.div
        variants={contentBlockVariants}
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gray-100"
      >
        <div
          className="relative overflow-hidden bg-gradient-to-br from-primary to-accent text-white rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-10 sm:p-16 md:p-20 shadow-2xl text-center max-w-5xl mx-auto"
        >
            <Zap size={100} className="absolute -top-10 -left-10 text-white/5 transform rotate-[20deg] opacity-50 -z-0" />
            <FileText size={120} className="absolute -bottom-12 -right-12 text-white/5 transform -rotate-[10deg] opacity-50 -z-0" />
            <motion.div variants={{visible:{transition:{staggerChildren:0.15}}}} className="relative z-10">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                    Ready to Streamline Your Legal Needs?
                </motion.h2>
                <motion.p variants={itemVariants} className="text-md sm:text-lg text-white/90 mb-10 max-w-xl mx-auto leading-relaxed">
                    Eliminate legal bottlenecks. Begin automating your documents, explore our vast template library, or get expert legal support with LegallyUp.
                </motion.p>
                <motion.div variants={itemVariants}>
                    <Link
                    to="/documents/generate"
                    className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 sm:px-14 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold hover:bg-gray-200 transition-colors duration-300 shadow-xl transform hover:scale-105 active:scale-100"
                    >
                    Generate Your Document Now <ArrowRight size={22}/>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;