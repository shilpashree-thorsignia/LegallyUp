// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { FileText, Lock, FileEdit, CheckSquare } from 'lucide-react';

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 75 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const heroTitle = "Create Legal Documents in Minutes";
const heroTitleWords = heroTitle.split(" ");

const titleContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 12, stiffness: 100 },
  },
};

const animatedElementVariants = (
  delay: number = 0,
  duration: number = 15,
  yMovement: number = 20
): Variants => ({
  initial: { opacity: 0.3, y: yMovement / 2, scale: 0.9 },
  animate: {
    opacity: [0.3, 0.7, 0.3],
    y: [-yMovement / 2, yMovement / 2, -yMovement / 2],
    scale: [0.9, 1, 0.9],
    transition: {
      duration: duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      delay: delay,
    },
  },
});


const HomePage: React.FC = () => {
  return (
    <motion.div
      className="overflow-x-hidden"
    >
      {/* Hero Section - Revamped for Full Width and Distinction */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16"> {/* Changed via-lightGray to via-white for better contrast, increased padding */}
        <div className="w-full max-w-screen-2xl mx-auto"> {/* Content wrapper wider than default container */}
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
          {/* Left Content Area */}
          <motion.div
            className="text-left z-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
            }}
          >
            <motion.h1
              variants={titleContainerVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-primary mb-6 lg:mb-8 leading-tight tracking-tight"
            >
              Automate Your Legal Paperwork Instantly
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-textColor mb-10 lg:mb-12 max-w-xl lg:max-w-2xl leading-relaxed"
            >
              Generate compliance-ready legal documentation such as NDAs and lease contracts. Browse a robust template library or get expert assistance—fast, secure, and scalable.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/generate"
                className="inline-block bg-gradient-to-r from-primary to-accent text-white px-10 py-4 sm:px-12 sm:py-5 rounded-xl text-lg sm:text-xl font-semibold hover:opacity-90 transition-opacity duration-300 shadow-xl transform hover:scale-105 active:scale-95"
              >
                Launch Document Builder
              </Link>
            </motion.div>
               </motion.div>

            {/* Right Animation Area */}
            <div className="relative h-72 sm:h-80 md:h-[calc(100vh-250px)] min-h-[350px] max-h-[650px] flex items-center justify-center z-0 order-first md:order-last"> {/* Adjusted dynamic height calc */}
              <div className="absolute inset-0 flex items-center justify-center opacity-70 md:opacity-100">
                  <motion.div
                    className="absolute text-accent p-3 rounded-lg"
                    variants={animatedElementVariants(0, 12, 30)}
                    initial="initial"
                    animate="animate"
                    style={{ top: '10%', left: '10%', width: '90px', height: '90px' }} // Adjusted positioning for wider area
                  >
                    <FileText strokeWidth={1.5} size="100%" className="opacity-40" />
                  </motion.div>

                  <motion.div
                    className="absolute text-primary p-2 rounded-full"
                    variants={animatedElementVariants(1, 15, 25)}
                    initial="initial"
                    animate="animate"
                    style={{ bottom: '12%', right: '8%', width: '70px', height: '70px' }}
                  >
                     <Lock strokeWidth={1.5} size="100%" className="opacity-30" />
                  </motion.div>

                  <motion.div
                    className="absolute text-accent p-2 rounded-lg"
                    variants={animatedElementVariants(0.5, 18, 35)}
                    initial="initial"
                    animate="animate"
                    style={{ top: '25%', right: '20%', width: '60px', height: '60px' }}
                  >
                    <FileEdit strokeWidth={1.5} size="100%" className="opacity-50" />
                  </motion.div>

                  <motion.div
                    className="absolute text-primary p-3 rounded-lg"
                    variants={animatedElementVariants(1.5, 13, 20)}
                    initial="initial"
                    animate="animate"
                    style={{ bottom: '30%', left: '5%', width: '80px', height: '80px' }}
                  >
                    <CheckSquare strokeWidth={1.5} size="100%" className="opacity-35" />
                  </motion.div>

                  <motion.div
                    className="absolute bg-primary/5 rounded-full -z-10"
                    variants={animatedElementVariants(0.2, 20, 10)}
                    initial="initial"
                    animate="animate"
                    style={{ top: '5%', left: '0%', width: '180px', height: '180px' }}
                  />
                  <motion.div
                    className="absolute bg-accent/5 rounded-full -z-10"
                     variants={animatedElementVariants(0.8, 25, 15)}
                    initial="initial"
                    animate="animate"
                    style={{ bottom: '5%', right: '0%', width: '220px', height: '220px' }}
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview - Clear separation from Hero */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-20 md:py-28 bg-lightGray rounded-t-3xl md:rounded-t-[60px] relative z-10 mt-0 mb-20 md:mb-32 px-4 sm:px-6 lg:px-8" // Removed negative top margin
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-12 md:mb-16 text-center">Key Capabilities</h2>
        {/* Optional: Constrain this grid if it should be narrower than hero's content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
          {[
            { icon: "📄", title: "Smart Document Builder", desc: "Create custom legal documents with step-by-step smart forms based on expert templates." },
            { icon: "📚", title: "Comprehensive Template Suite", desc: "Access a wide and growing range of legal templates for various personal and business needs." },
            { icon: "🤝", title: "Attorney Network Access", desc: "Find and consult with qualified legal professionals for personalized advice when you need it." },
            { icon: "🔒", title: "Encrypted Document Vault", desc: "Safely store your generated documents in your personal dashboard for easy access anytime." },
            { icon: "📤", title: "Instant Export Options", desc: "Download your final documents instantly in standard formats like PDF or DOCX." },
            { icon: "📊", title: "Real-Time Activity Dashboard", desc: "Manage your profile, view saved documents, and track your activity in one place." },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl md:text-5xl mb-5 inline-block p-3 bg-accent/10 text-accent rounded-full">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-textColor leading-relaxed text-sm md:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

       {/* How It Works */}
       <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24 mb-20 md:mb-32 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-12 md:mb-16">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-start md:space-x-8 lg:space-x-12 space-y-10 md:space-y-0 max-w-7xl mx-auto"> {/* Constrained width */}
          {[
            { num: 1, title: "Choose a legal form tailored to your needs from templates.", desc: "Choose the type of legal document you need from our diverse library." },
            { num: 2, title: "Input your data via an intuitive wizard interface with logic.", desc: "Answer simple questions in our guided form to customize your document." },
            { num: 3, title: "Receive a legally formatted, export-ready document instantly.", desc: "Instantly create, review, and download your professional legal document." },
          ].map((step) => (
            <motion.div
              key={step.num}
              variants={itemVariants}
              className="flex flex-col items-center text-center max-w-xs mx-auto md:mx-0"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white text-3xl md:text-4xl font-bold rounded-full mb-6 shadow-lg">
                {step.num}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-primary mb-3">{step.title}</h3>
              <p className="text-textColor leading-relaxed text-sm md:text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
       </motion.section>

        {/* Top Template Categories */}
       <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24 bg-lightGray rounded-3xl md:rounded-[50px] mb-20 md:mb-32 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-12 md:mb-16">Most Requested Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"> {/* Constrained width */}
          {[
            { to: "/templates?category=nda", icon: "🤫", title: "NDAs", desc: "Protect confidential information with Non-Disclosure Agreements." },
            { to: "/templates?category=rental", icon: "🏠", title: "Rental Agreements", desc: "Create residential and commercial lease agreements." },
            { to: "/templates?category=employment", icon: "💼", title: "Employment Docs", desc: "Generate employment contracts, offer letters, and more." },
            { to: "/templates?category=business", icon: "🏢", title: "Business Contracts", desc: "Essential agreements for your business operations." },
          ].map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link
                to={category.to}
                className="block bg-white p-6 rounded-xl shadow-xl hover:shadow-accent/30 border-2 border-transparent hover:border-accent transition-all duration-300 transform hover:-translate-y-1.5 h-full flex flex-col"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-primary mb-2">{category.title}</h3>
                <p className="text-textColor text-xs sm:text-sm leading-relaxed flex-grow">{category.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div variants={itemVariants} className="mt-12 md:mt-16 text-center">
          <Link
            to="/templates"
            className="inline-block text-accent hover:text-primary text-md md:text-lg font-semibold group"
          >
            View All Templates <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
          </Link>
        </motion.div>
       </motion.section>

       {/* Why Choose LegallyUp? */}
       <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24 mb-20 md:mb-32 px-4 sm:px-6 lg:px-8 text-center"
      >
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-12 md:mb-16">Why Choose LegallyUp?</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-left max-w-7xl mx-auto"> {/* Constrained width */}
                 {[
                    { icon: "✅", title: "Expert-Backed Validity", desc: "Our templates are developed with legal expertise in mind, providing a solid foundation for your documents." },
                    { icon: "⏱️", title: "User-Centric UI/UX", desc: "Generate complex documents in minutes with our intuitive, step-by-step interface." },
                    { icon: "🔒", title: "Data Protection by Design", desc: "We prioritize your data security and privacy, ensuring your information is protected." },
                    { icon: "⚖️", title: "On-Demand Legal Expertise", desc: "Easily find and connect with qualified attorneys through our integrated directory." },
                 ].map((value) => (
                    <motion.div
                    key={value.title}
                    variants={itemVariants}
                    className="p-6 md:p-8 bg-white rounded-xl shadow-xl border border-transparent hover:border-primary/30 transition-colors duration-300 flex items-start space-x-4 md:space-x-5"
                    >
                    <div className="text-3xl md:text-4xl mt-1 bg-primary/10 text-primary p-2.5 md:p-3 rounded-lg">{value.icon}</div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2 md:mb-3">{value.title}</h3>
                        <p className="text-textColor leading-relaxed text-sm md:text-base">{value.desc}</p>
                    </div>
                    </motion.div>
                ))}
             </div>
        </motion.section>

      {/* Testimonials */}
       <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24 bg-lightGray rounded-3xl md:rounded-[50px] mb-20 md:mb-32 px-4 sm:px-6 lg:px-8 text-center"
      >
         <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-12 md:mb-16">What Our Users Say</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-7xl mx-auto"> {/* Constrained width */}
             {[
                { quote: "LegallyUp made creating an NDA so simple and fast. Saved me so much time and money compared to hiring a lawyer for a standard document!", author: "Sarah K., Small Business Owner" },
                { quote: "Finding a rental agreement template that was both comprehensive and easy to fill out was a breeze. Highly recommend LegallyUp for landlords!", author: "David L., Property Manager" },
             ].map((testimonial) => (
                <motion.div
                key={testimonial.author}
                variants={itemVariants}
                className="bg-white p-6 md:p-8 rounded-xl shadow-xl italic text-textColor relative border-l-4 border-accent"
                >
                <span className="absolute top-3 left-3 text-6xl text-accent opacity-15 font-serif -z-0">“</span>
                <p className="mb-5 text-md md:text-lg relative z-10">"{testimonial.quote}"</p>
                <p className="font-semibold text-primary not-italic text-right text-sm md:text-base">- {testimonial.author}</p>
                </motion.div>
            ))}
         </div>
       </motion.section>

        {/* Final Call-to-Action */}
       <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent text-white rounded-3xl md:rounded-[50px] mx-4 sm:mx-6 lg:mx-auto lg:max-w-5xl px-6 sm:px-8 lg:px-12 shadow-2xl text-center mb-16 md:mb-24"
      >
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5"> Ready to Streamline Your Legal Needs?</h2>
           <p className="text-md sm:text-lg text-white/90 mb-10 max-w-xl mx-auto leading-relaxed">Eliminate legal bottlenecks. Begin automating your documents or explore templates and legal support tools.</p>
           <Link
              to="/generate"
              className="inline-block bg-white text-primary px-10 py-4 sm:px-12 sm:py-4 rounded-xl text-lg sm:text-xl font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95"
            >
              Generate Your Document
            </Link>
       </motion.section>
    </motion.div>
  );
};

export default HomePage;