// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  FileText, ShieldCheck, Lock, Users, ArrowRight, Layers, 
  Briefcase, Home as HomeIcon, Zap, MousePointer, Clock, DollarSign
} from 'lucide-react';
import img1 from '../assets/img1.webp';  
import img2 from '../assets/img2.webp';
import img3 from '../assets/img3.webp';
import ExpertBacked from '../assets/Expert-Backed.webp';
import Fast from '../assets/Fast.webp';
import Secure from '../assets/Secure.webp';
import Accessible from '../assets/Accessible.jpg';
import HeroBackground from '../components/ui/HeroBackground';

// Animation Variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

const contentBlockVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

const heroTitleText = "Transform Your Legal Documentation Process";
const titleWords: string[] = heroTitleText.split(" ");
const titleContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
const titleWord: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const HomePage: React.FC = () => {
  const features = [
    { 
      icon: <FileText size={36} className="text-primary" />, 
      title: "Smart Document Builder", 
      desc: "Craft custom legal documents with our intuitive, step-by-step smart forms, powered by expert-vetted templates." 
    },
    { 
      icon: <Layers size={36} className="text-primary" />, 
      title: "Comprehensive Template Suite", 
      desc: "Access an extensive and growing library of legal templates for diverse personal and business requirements." 
    },
    { 
      icon: <Users size={36} className="text-primary" />, 
      title: "Attorney Network Access", 
      desc: "Seamlessly find, connect, and consult with qualified legal professionals for personalized advice when you need it most." 
    },
    { 
      icon: <ShieldCheck size={36} className="text-primary" />, 
      title: "Encrypted Document Vault", 
      desc: "Securely store and manage your generated documents in your personal, encrypted dashboard for easy access anytime, anywhere." 
    },
    { 
      icon: <Zap size={36} className="text-primary" />, 
      title: "Instant Export Options", 
      desc: "Download your finalized documents immediately in standard, professional formats like PDF or DOCX." 
    },
    { 
      icon: <MousePointer size={36} className="text-primary" />, 
      title: "User-Centric Dashboard", 
      desc: "Manage your profile, view saved documents, track activity, and access support all in one streamlined place." 
    },
  ];

  const stats = [
    { number: "50K+", label: "Documents Generated", icon: <FileText size={24} /> },
    { number: "100+", label: "Legal Templates", icon: <Layers size={24} /> },
    { number: "24/7", label: "Support Available", icon: <Clock size={24} /> },
    { number: "60%", label: "Cost Savings", icon: <DollarSign size={24} /> },
  ];

  const howItWorksSteps = [
    { 
      num: 1, 
      image: img1, 
      title: "Select Your Template", 
      desc: "Choose from our diverse library of professionally drafted legal documents tailored to your specific needs." 
    },
    { 
      num: 2, 
      image: img2, 
      title: "Customize with Ease", 
      desc: "Answer simple questions in our guided forms to input your details and customize the document precisely." 
    },
    { 
      num: 3, 
      image: img3, 
      title: "Generate & Download", 
      desc: "Instantly create, review, and download your professional legal document in your preferred format." 
    },
  ];

  const templateCategories = [
    { 
      slug: 'nda', 
      icon: <Lock size={36} className="text-primary" />, 
      title: "NDAs", 
      desc: "Protect sensitive information.",
      count: "15+ Templates" 
    },
    { 
      slug: 'rental', 
      icon: <HomeIcon size={36} className="text-primary" />, 
      title: "Rental Agreements", 
      desc: "For residential & commercial leases.",
      count: "10+ Templates" 
    },
    { 
      slug: 'employment', 
      icon: <Briefcase size={36} className="text-primary" />, 
      title: "Employment Docs", 
      desc: "Contracts, offer letters, & more.",
      count: "20+ Templates" 
    },
    { 
      slug: 'business', 
      icon: <Layers size={36} className="text-primary" />, 
      title: "Business Contracts", 
      desc: "Essential operational agreements.",
      count: "25+ Templates" 
    },
  ];

  const whyChooseUs = [
    { 
      image: ExpertBacked,
      title: "Expert-Backed & Reliable", 
      desc: "Our templates are meticulously developed with legal expertise, providing a solid foundation you can trust."
    },
    { 
      image: Fast,
      title: "Fast & Intuitive", 
      desc: "Generate complex documents in minutes with our user-friendly, step-by-step interface designed for clarity."
    },
    { 
      image: Secure,
      title: "Secure & Private by Design", 
      desc: "We prioritize your data security and privacy, employing robust measures to ensure your information is protected."
    },
    { 
      image: Accessible,
      title: "Accessible Legal Support", 
      desc: "Easily find and connect with qualified attorneys through our integrated network for personalized advice."
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="overflow-x-hidden bg-gray-50"
    >
      {/* Hero Section - Full Screen */}
      <motion.section
        className="relative bg-gradient-to-br from-primary to-accent h-screen flex items-center justify-center overflow-hidden text-white"
        variants={contentBlockVariants}
      >
        <HeroBackground />
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        
        <div className="w-full relative z-10 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center">
              <ShieldCheck size={72} className="mx-auto opacity-90 text-white" strokeWidth={1.5}/>
            </motion.div>
            <motion.div
              variants={titleContainer}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={titleWord}
                  className="inline-block mr-[0.2em] last:mr-0 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
            >
              Create, customize, and manage your legal documents with ease. Our intuitive platform helps you generate professional documents in minutes.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl transform transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <div className="text-primary group-hover:text-primary/80 transition-colors duration-300">{stat.icon}</div>
                    </div>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-3">
                      {stat.number}
                    </div>
                    <div className="text-base text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={contentBlockVariants} className="text-center mb-16">
            <motion.h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Legal Needs
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, manage, and store your legal documents securely and efficiently.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={contentBlockVariants} className="text-center mb-16">
            <motion.h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional legal documents in three simple steps
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
          >
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {step.num}
                </div>
                <div className="flex justify-center mb-6">
                  <img src={step.image} alt={step.title} className="w-20 h-20 object-contain rounded-xl shadow" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Template Categories Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={contentBlockVariants} className="text-center mb-16">
            <motion.h2 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Templates
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our extensive collection of professional legal templates
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {templateCategories.map((category, index) => (
              <motion.div
                key={index}
                className="group"
              >
                <Link
                  to={`/templates#${category.slug}`}
                  className="block bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg flex flex-col items-center"
                >
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    {category.icon}
                  </div>
                  <div className="w-full text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.desc}</p>
                    <p className="text-sm text-primary font-medium">{category.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="text-center mt-12">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-lg group"
            >
              View All Templates
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={contentBlockVariants} className="text-center mb-16">
            <motion.h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why To Choose LegallyUp
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine legal expertise with modern technology to make document creation simple and reliable
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded-xl shadow" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-20 bg-white"
      >
        <div className="absolute inset-0 bg-gray-50/50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900"
            >
              Ready to Streamline Your Legal Documentation?
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-10"
            >
              Join thousands of satisfied users who trust LegallyUp for their legal document needs
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;