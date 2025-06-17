// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu as MenuIcon,
  X,
  Home,
  Info,
  FileText,
  LayoutGrid,
  Users,
  DollarSign,
  BookOpen,
  MessageSquare,
  Briefcase,
  LogIn,
  LogOut,
  UserPlus,
  UserCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAVBAR_HEIGHT_REM = 5; // 5rem = 80px (h-20 in Tailwind)

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isScrolled, setIsScrolled] = useState(false); // No longer needed for this style
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // No longer need scroll listener if background is always white
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 20);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);


  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> }, // Reduced icon size slightly for this style
    { path: '/about', label: 'About', icon: <Info size={18} /> },
    { path: '/templates', label: 'Templates', icon: <LayoutGrid size={18} /> },
    { path: '/documents/generate', label: 'Generate', icon: <FileText size={18} /> },
    { path: '/attorneys', label: 'Attorneys', icon: <Users size={18} /> },
    { path: '/pricing', label: 'Pricing', icon: <DollarSign size={18} /> },
    { path: '/resources', label: 'Resources', icon: <BookOpen size={18} /> },
    { path: '/case-studies', label: 'Case Studies', icon: <Briefcase size={18} /> },
    { path: '/contact', label: 'Contact', icon: <MessageSquare size={18} /> },
  ];

  // Adjusted link colors for white background
  const activeLinkClasses = "text-primary font-semibold border-b-2 border-primary pb-1";
  const inactiveLinkClasses = "text-gray-600 hover:text-primary pb-1 border-b-2 border-transparent hover:border-primary/30 transition-all duration-300";
  const mobileActiveLinkClasses = "bg-accent/10 text-accent font-semibold"; // Mobile can still use accent for active
  const mobileInactiveLinkClasses = "text-gray-700 hover:bg-gray-200 hover:text-primary";


  const mobileMenuVariants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeOut" } },
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ease-in-out bg-white shadow-md`} // Default white bg and shadow
      style={{
        height: `${NAVBAR_HEIGHT_REM}rem`,
        // Removed dynamic background and backdrop filter based on scroll/open state
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Logo/Brand */}
        <Link to="/" className="text-3xl font-extrabold text-primary hover:opacity-80 transition-opacity duration-200 tracking-tight">
          Legally<span className="text-accent">Up</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 h-full">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 h-full ${isActive ? activeLinkClasses : inactiveLinkClasses} text-md font-medium`
              }
            >
              {link.icon && React.cloneElement(link.icon, { className: "text-gray-500 group-hover:text-primary" })} {/* Icon color needs to be managed */}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth Links */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'} transition-colors duration-200 text-md font-medium`
                }
              >
                <UserCircle size={22} className="text-gray-500"/>
                {user.name || 'Dashboard'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg transition-all duration-300 text-md font-semibold"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-600 hover:text-primary text-md font-medium transition-colors duration-200 px-3 py-2">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-5 py-2.5 rounded-lg text-md font-semibold hover:bg-primary/80 transition-colors duration-300 shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>


        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors" // Text color for white bg
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
            className="md:hidden absolute top-full left-0 right-0 shadow-xl bg-white border-t border-gray-200" // White bg for mobile menu
          >
            <div className="px-4 pt-4 pb-5 space-y-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`
                  }
                >
                  {link.icon && React.cloneElement(link.icon, { className: "text-gray-600" })}
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                    >
                      <UserCircle size={20} className={isMobileMenuOpen && mobileActiveLinkClasses.includes('text-accent') ? "text-accent" : "text-gray-600"}/> {user.name || 'Dashboard'}
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      <LogOut size={20} className="text-gray-600"/> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                    >
                      <LogIn size={20} className={isMobileMenuOpen && mobileActiveLinkClasses.includes('text-accent') ? "text-accent" : "text-gray-600"}/> Sign In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 bg-primary text-white px-4 py-3.5 rounded-lg text-base font-semibold hover:bg-primary/80 transition-colors duration-300 w-full justify-center"
                    >
                      <UserPlus size={20} /> Sign Up
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