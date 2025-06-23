// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LegallyUpLogo from '../../assets/LegallyUpLogo.jpeg';

const NAVBAR_HEIGHT_REM = 5; // 5rem = 80px (h-20 in Tailwind)

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
    { path: '/templates', label: 'Templates' },
    { path: '/attorneys', label: 'Attorneys' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/resources', label: 'Resources' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/contact', label: 'Contact' },
  ];

  // Adjusted link colors for white background
  const activeLinkClasses = "text-primary font-semibold border-b-2 border-primary pb-1";
  const inactiveLinkClasses = "text-gray-600 hover:text-primary pb-1 border-b-2 border-transparent hover:border-primary/30 transition-all duration-300";
  const mobileActiveLinkClasses = "bg-accent/10 text-accent font-semibold";
  const mobileInactiveLinkClasses = "text-gray-700 hover:bg-gray-200 hover:text-primary";

  // Simplified animation variants to prevent layout shifts
  const mobileMenuVariants = {
    closed: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
    open: { opacity: 1, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ease-in-out bg-white shadow-md w-full"
      style={{ 
        height: `${NAVBAR_HEIGHT_REM}rem`,
        contain: 'layout', // Prevent layout shifts
        willChange: 'contents' // Optimize for content changes
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center h-full">
        {/* Logo/Brand - Fixed dimensions to prevent shifts */}
        <Link 
          to="/" 
          className="hover:opacity-80 transition-opacity duration-200 mr-4 lg:mr-8 flex-shrink-0"
          style={{ minWidth: '160px' }} // Prevent layout shifts
        >
          <img 
            src={LegallyUpLogo} 
            alt="LegallyUp" 
            className="h-12 md:h-14 w-auto object-contain"
            style={{ maxHeight: '56px' }} // Stable height
          />
        </Link>

        {/* Desktop/Tablet Navigation */}
        <nav className="hidden md:flex items-center justify-between flex-1">
          <div className="flex items-center flex-wrap lg:flex-nowrap gap-x-3 lg:gap-x-6 xl:gap-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center h-full ${isActive ? activeLinkClasses : inactiveLinkClasses} text-base md:text-[15px] lg:text-[16px] font-medium whitespace-nowrap py-2`
                }
                style={{ minHeight: '40px' }} // Stable height
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Desktop/Tablet Auth Links */}
        <div className="hidden md:flex items-center space-x-4 ml-4 flex-shrink-0">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'text-gray-600 hover:text-primary hover:bg-gray-100'}`
                }
                style={{ minHeight: '40px', minWidth: '100px' }} // Stable dimensions
              >
                {user.name || 'Dashboard'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-primary/80 transition-colors"
                style={{ minHeight: '40px', minWidth: '80px' }} // Stable dimensions
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'text-gray-600 hover:text-primary hover:bg-gray-100'}`
                }
                style={{ minHeight: '40px', minWidth: '70px' }} // Stable dimensions
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-primary text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-primary/80 transition-colors"
                style={{ minHeight: '40px', minWidth: '80px' }} // Stable dimensions
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button - Fixed dimensions */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
            aria-label="Toggle Mobile Menu"
            style={{ 
              width: '44px', 
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Dropdown) - Optimized for CLS */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 shadow-xl bg-white border-t border-gray-200 w-full"
            style={{ contain: 'layout' }} // Prevent layout shifts
          >
            <div className="px-4 pt-4 pb-5 space-y-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-[16px] font-medium transition-colors ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`
                  }
                  style={{ minHeight: '48px' }} // Stable height
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-[16px] font-medium transition-colors ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                      style={{ minHeight: '48px' }}
                    >
                      {user.name || 'Dashboard'}
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-[16px] font-medium text-left bg-primary text-white hover:bg-primary/80 transition-colors"
                      style={{ minHeight: '48px' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-[16px] font-medium transition-colors ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                      style={{ minHeight: '48px' }}
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-[16px] font-medium text-left bg-primary text-white hover:bg-primary/80 transition-colors"
                      style={{ minHeight: '48px' }}
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;