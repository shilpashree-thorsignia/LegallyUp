// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const mobileMenuVariants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeOut" } },
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ease-in-out bg-white shadow-md w-full"
      style={{ height: `${NAVBAR_HEIGHT_REM}rem` }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center h-full">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold text-primary hover:opacity-80 transition-opacity duration-200 tracking-tight mr-4 lg:mr-8">
          Legally<span className="text-accent">Up</span>
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
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Desktop/Tablet Auth Links */}
        <div className="hidden md:flex items-center ml-4 lg:ml-8">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center ${isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'} transition-colors duration-200 text-base md:text-[15px] lg:text-[16px] font-medium mr-4`
                }
              >
                {user.name || 'Dashboard'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 lg:px-5 py-2.5 rounded-lg text-base md:text-[15px] lg:text-[16px] font-semibold hover:bg-primary/80 transition-colors duration-300 shadow-md whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="bg-primary text-white px-4 lg:px-5 py-2.5 rounded-lg text-base md:text-[15px] lg:text-[16px] font-semibold hover:bg-primary/80 transition-colors duration-300 shadow-md whitespace-nowrap"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Dropdown) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 shadow-xl bg-white border-t border-gray-200 w-full"
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
                    >
                      {user.name || 'Dashboard'}
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-[16px] font-medium text-left bg-primary text-white hover:bg-primary/80 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-[16px] font-medium text-left bg-primary text-white hover:bg-primary/80 transition-colors"
                  >
                    Sign In
                  </NavLink>
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