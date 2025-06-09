import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <Link to="/" className="text-xl font-bold text-white hover:text-accent transition-colors duration-200">
            LegallyUp
          </Link>
        </div>
        <div className="flex flex-wrap justify-center space-x-4 text-sm mb-4">
          <Link to="/about" className="hover:text-accent transition-colors duration-200">About</Link>
          <Link to="/templates" className="hover:text-accent transition-colors duration-200">Templates</Link>
          <Link to="/pricing" className="hover:text-accent transition-colors duration-200">Pricing</Link>
          <Link to="/contact" className="hover:text-accent transition-colors duration-200">Contact</Link>
          <Link to="/resources" className="hover:text-accent transition-colors duration-200">Resources</Link>
           {/* Placeholder links for legal pages */}
          <Link to="/privacy" className="hover:text-accent transition-colors duration-200">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-accent transition-colors duration-200">Terms of Service</Link>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} LegallyUp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;