// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinkClasses = "text-gray-300 hover:text-accent transition-colors duration-200 text-sm";
  const footerTitleClasses = "text-lg font-semibold text-white mb-5 uppercase tracking-wider";

  return (
    <footer className="bg-gradient-to-br from-primary to-accent text-white pt-16 md:pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">

          {/* Column 1: Quick Links (Now first on left) */}
          <div>
            <h4 className={footerTitleClasses}>Navigate</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className={footerLinkClasses}>About Us</Link></li>
              <li><Link to="/templates" className={footerLinkClasses}>Template Library</Link></li>
              <li><Link to="/documents/generate" className={footerLinkClasses}>Document Generator</Link></li>
              <li><Link to="/pricing" className={footerLinkClasses}>Pricing Plans</Link></li>
              <li><Link to="/attorneys" className={footerLinkClasses}>Find an Attorney</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources & Support */}
          <div>
            <h4 className={footerTitleClasses}>Support</h4>
            <ul className="space-y-3">
              <li><Link to="/resources" className={footerLinkClasses}>Legal Resources</Link></li>
              <li><Link to="/case-studies" className={footerLinkClasses}>Case Studies</Link></li>
              <li><Link to="/faq" className={footerLinkClasses}>FAQ</Link></li>
              <li><Link to="/contact" className={footerLinkClasses}>Contact Support</Link></li>
              <li><Link to="/blog" className={footerLinkClasses}>Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className={footerTitleClasses}>Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className={footerLinkClasses}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={footerLinkClasses}>Terms of Service</Link></li>
              <li><Link to="/cookies-policy" className={footerLinkClasses}>Cookies Policy</Link></li>
              <li><Link to="/refund-policy" className={footerLinkClasses}>Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 (or 5 if newsletter active): Brand & About (MOVED TO THE RIGHT) */}
          {/* On XL screens, this will be the 4th or 5th column. On LG, it might be the last in a 2x2 grid or start a new row. */}
          {/* We use 'md:col-start-auto lg:col-start-auto xl:col-start-4' or similar if newsletter is active and we want specific positioning */}
          {/* For simplicity with potentially 4 or 5 columns total, let's make it take up remaining space or a defined span */}
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 md:text-right md:pl-8 lg:pl-0"> {/* Added md:text-right and padding */}
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-4xl font-extrabold text-white hover:opacity-90 transition-opacity">
                Legally<span className="text-accent">Up</span>
              </h2>
            </Link>
            <p className={`${footerLinkClasses} leading-relaxed max-w-sm md:ml-auto`}> {/* md:ml-auto to align text right within its block if text-right on parent */}
              Simplifying your legal world with intuitive document generation, comprehensive templates, and access to expert advice.
            </p>
            <div className="flex space-x-5 mt-6 md:justify-end"> {/* md:justify-end for social links */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Facebook size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Twitter size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Linkedin size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Instagram size={22} /></a>
            </div>
          </div>

          {/* Optional Column 5: Newsletter (If you re-enable this, adjust spans above) */}
          {/* <div className="xl:col-span-1"> ... newsletter form ... </div> */}

        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-white/20 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
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