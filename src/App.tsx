import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth

// Import Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Import Page Components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DocumentGeneratorPage from './pages/Documents/DocumentGeneratorPage';
import TemplateLibraryPage from './pages/TemplateLibraryPage';
import AttorneyPage from './pages/AttorneyPage';
import ScheduleConsultationPage from './pages/ScheduleConsultationPage';
import LegalResourcesPage from './pages/LegalResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import PricingPage from './pages/PricingPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import PrivacyPolicyPage from './pages/Documents/PrivacyPolicyPage';
import NdaPage from './pages/Documents/NdaPage.tsx';
import RefundPolicyPage from './pages/Documents/RefundPolicyPage.tsx';
import PowerOfAttorneyPage from './pages/Documents/PowerOfAttorneyPage.tsx';
import EulaPage from './pages/Documents/EulaPage.tsx';
import WebsiteServicesAgreementPage from './pages/Documents/WebsiteServicesAgreementPage.tsx';
import CookiesPolicyPage from './pages/Documents/CookiesPolicyPage.tsx';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';


// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  return <>{children}</>;
};

// Simple layout component to wrap pages with Header and Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen text-textColor bg-white">
    <Header />
    {/* Main content area with generous padding and max-width */}
    <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <>
        <ScrollToTop />
        <Routes>
          {/* Routes wrapped by the Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/generate" element={<Layout><DocumentGeneratorPage /></Layout>} />
          <Route path="/Documents/generate" element={<Layout><DocumentGeneratorPage /></Layout>} />
          <Route path="/Documents/generate/nda" element={<Layout><NdaPage /></Layout>} />
          <Route path="/Documents/generate/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
          <Route path="/Documents/generate/refund-policy" element={<Layout><RefundPolicyPage /></Layout>} />
          <Route path="/Documents/generate/power-of-attorney" element={<Layout><PowerOfAttorneyPage /></Layout>} />
          <Route path="/Documents/generate/eula" element={<Layout><EulaPage /></Layout>} />
          <Route path="/Documents/generate/website-services-agreement" element={<Layout><WebsiteServicesAgreementPage /></Layout>} />
          <Route path="/Documents/generate/cookies-policy" element={<Layout><CookiesPolicyPage /></Layout>} />
          <Route path="/templates" element={<Layout><TemplateLibraryPage /></Layout>} />
          <Route path="/attorneys" element={<Layout><AttorneyPage /></Layout>} />
          <Route path="/schedule-consultation/:attorneySlug" element={<Layout><ScheduleConsultationPage /></Layout>} />
          <Route path="/resources" element={<Layout><LegalResourcesPage /></Layout>} />
          <Route path="/resources/:resourceSlug" element={<Layout><ResourceDetailPage /></Layout>} />
          <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
          <Route path="/case-studies" element={<Layout><CaseStudiesPage /></Layout>} /> 
          <Route path="/case-studies/:caseStudySlug" element={<Layout><CaseStudyDetailPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/blogs" element={<Layout><BlogsPage /></Layout>} />
          <Route path="/blogs/:blogId" element={<Layout><BlogDetailPage /></Layout>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Auth pages with Layout */}
          <Route path="/signin" element={<Layout><SignInPage /></Layout>} />
          <Route path="/signup" element={<Layout><SignUpPage /></Layout>} />

          {/* New route for editing privacy policy with an ID */}
          <Route path="/documents/privacy-policy/:id" element={<Layout><PrivacyPolicyPage /></Layout>} />

          {/* New route for Forgot Password */}
          <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
        </Routes>
        <ScrollToTop />
      </>
    </AuthProvider>
  );
}


export default App;