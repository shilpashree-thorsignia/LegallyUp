import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/generate', label: 'Generate' },
    { path: '/templates', label: 'Templates' },
    { path: '/attorneys', label: 'Attorneys' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/resources', label: 'Resources' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/contact', label: 'Contact' },
    // ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-white hover:text-accent transition-colors duration-200">
          LegallyUp
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="text-white hover:text-accent transition-colors duration-200 text-lg">
              {link.label}
            </Link>
          ))}
          {/* Auth Links */}
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-white hover:text-accent transition-colors duration-200 text-lg"
              >
                {user.name}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-white hover:text-accent transition-colors duration-200 text-lg">
                Sign In
              </Link>
              <Link to="/signup" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-lg">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Navigation (Dropdown) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-primary px-4 pt-2 pb-4 space-y-2">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="block text-white hover:text-accent transition-colors duration-200 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {/* Mobile Auth Links */}
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="block text-white hover:text-accent transition-colors duration-200 text-lg" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white hover:text-accent transition-colors duration-200 text-lg py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="block text-white hover:text-accent transition-colors duration-200 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className="block text-white hover:text-accent transition-colors duration-200 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;