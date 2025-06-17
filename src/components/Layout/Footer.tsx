// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinkClasses = "text-gray-200 hover:text-white transition-colors duration-200 text-sm";
  const footerTitleClasses = "text-lg font-semibold text-white mb-5 uppercase tracking-wider";

  return (
    <footer className="bg-gradient-to-br from-primary to-accent text-white pt-16 md:pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">

          {/* Column 1: Quick Links */}
          <div>
            <h4 className={footerTitleClasses}>Navigate</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className={footerLinkClasses}>About Us</Link></li>
              <li><Link to="/templates" className={footerLinkClasses}>Template Library</Link></li>
              <li><Link to="/pricing" className={footerLinkClasses}>Pricing Plans</Link></li>
              <li><Link to="/attorneys" className={footerLinkClasses}>Find an Attorney</Link></li>
              <li><Link to="/contact" className={footerLinkClasses}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources & Support */}
          <div>
            <h4 className={footerTitleClasses}>Support</h4>
            <ul className="space-y-3">
              <li><Link to="/resources" className={footerLinkClasses}>Legal Resources</Link></li>
              <li><Link to="/case-studies" className={footerLinkClasses}>Case Studies</Link></li>
              <li><Link to="/faq" className={footerLinkClasses}>FAQ</Link></li>
              <li><Link to="/blogs" className={footerLinkClasses}>Blog</Link></li>
              <li><Link to="/help" className={footerLinkClasses}>Help Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className={footerTitleClasses}>Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/documents/privacy-policy" className={footerLinkClasses}>Privacy Policy</Link></li>
              <li><Link to="/documents/eula" className={footerLinkClasses}>Terms of Service</Link></li>
              <li><Link to="/documents/cookies-policy" className={footerLinkClasses}>Cookies Policy</Link></li>
              <li><Link to="/documents/refund-policy" className={footerLinkClasses}>Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Brand & About */}
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 flex flex-col items-center md:items-end md:pl-8 lg:pl-0 text-center md:text-right">
            <Link to="/" className="inline-block mb-4 md:mb-6">
              <h2 className="text-4xl font-extrabold font-sans hover:opacity-90 transition-opacity">
                <span className="text-gray-800">Legally</span><span className="text-[#3db6f2]">Up</span>
              </h2>
            </Link>
            <p className="text-gray-200 leading-relaxed max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-md mb-4 md:mb-6">
              Simplifying your legal world with intuitive document generation, comprehensive templates, and access to expert advice.
            </p>
            <div className="flex space-x-5 mt-4 md:mt-6 justify-center md:justify-end w-full">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors"><Facebook size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors"><Twitter size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors"><Linkedin size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors"><Instagram size={22} /></a>
            </div>
          </div>

        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-white/20 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-200">
            <p>© {currentYear} LegallyUp. All Rights Reserved.</p>
            <p className="mt-2 sm:mt-0">
              Built to simplify your legal world.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;