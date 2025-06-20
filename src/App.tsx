import React, { Suspense, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Layout Components (not lazy loaded as they're needed immediately)
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Lazy load page components for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const DocumentGeneratorPage = React.lazy(() => import('./pages/Documents/DocumentGeneratorPage'));
const TemplateLibraryPage = React.lazy(() => import('./pages/TemplateLibraryPage'));
const AttorneyPage = React.lazy(() => import('./pages/AttorneyPage'));
const ScheduleConsultationPage = React.lazy(() => import('./pages/ScheduleConsultationPage'));
const LegalResourcesPage = React.lazy(() => import('./pages/LegalResourcesPage'));
const ResourceDetailPage = React.lazy(() => import('./pages/ResourceDetailPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const CaseStudiesPage = React.lazy(() => import('./pages/CaseStudiesPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const SignInPage = React.lazy(() => import('./pages/SignInPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/Documents/PrivacyPolicyPage'));
const NdaPage = React.lazy(() => import('./pages/Documents/NdaPage'));
const RefundPolicyPage = React.lazy(() => import('./pages/Documents/RefundPolicyPage'));
const PowerOfAttorneyPage = React.lazy(() => import('./pages/Documents/PowerOfAttorneyPage'));
const EulaPage = React.lazy(() => import('./pages/Documents/EulaPage'));
const WebsiteServicesAgreementPage = React.lazy(() => import('./pages/Documents/WebsiteServicesAgreementPage'));
const CookiesPolicyPage = React.lazy(() => import('./pages/Documents/CookiesPolicyPage'));
const CaseStudyDetailPage = React.lazy(() => import('./pages/CaseStudyDetailPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const BlogsPage = React.lazy(() => import('./pages/BlogsPage'));
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/policies/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/policies/TermsAndConditions'));
const RefundPolicy = React.lazy(() => import('./pages/policies/RefundPolicy'));

// Loading component for Suspense fallback
const PageLoader: React.FC = memo(() => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
));

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
});

// Memoized layout component to prevent unnecessary re-renders
const Layout: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
  <div className="flex flex-col min-h-screen text-textColor bg-white">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
));

// Wrapper component for lazy-loaded routes
const LazyRoute: React.FC<{ component: React.ComponentType }> = memo(({ component: Component }) => (
  <Layout>
    <Component />
  </Layout>
));

// Wrapper component for protected lazy-loaded routes
const ProtectedLazyRoute: React.FC<{ component: React.ComponentType }> = memo(({ component: Component }) => (
  <ProtectedRoute>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
));

function App() {
  return (
    <AuthProvider>
      <>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LazyRoute component={HomePage} />} />
          <Route path="/about" element={<LazyRoute component={AboutPage} />} />
          <Route path="/generate" element={<LazyRoute component={DocumentGeneratorPage} />} />
          <Route path="/Documents/generate" element={<LazyRoute component={DocumentGeneratorPage} />} />
          <Route path="/Documents/generate/nda" element={<LazyRoute component={NdaPage} />} />
          <Route path="/Documents/generate/privacy-policy" element={<LazyRoute component={PrivacyPolicyPage} />} />
          <Route path="/Documents/generate/refund-policy" element={<LazyRoute component={RefundPolicyPage} />} />
          <Route path="/Documents/generate/power-of-attorney" element={<LazyRoute component={PowerOfAttorneyPage} />} />
          <Route path="/Documents/generate/eula" element={<LazyRoute component={EulaPage} />} />
          <Route path="/Documents/generate/website-services-agreement" element={<LazyRoute component={WebsiteServicesAgreementPage} />} />
          <Route path="/Documents/generate/cookies-policy" element={<LazyRoute component={CookiesPolicyPage} />} />
          <Route path="/templates" element={<LazyRoute component={TemplateLibraryPage} />} />
          <Route path="/attorneys" element={<LazyRoute component={AttorneyPage} />} />
          <Route path="/schedule-consultation/:attorneySlug" element={<LazyRoute component={ScheduleConsultationPage} />} />
          <Route path="/resources" element={<LazyRoute component={LegalResourcesPage} />} />
          <Route path="/resources/:resourceSlug" element={<LazyRoute component={ResourceDetailPage} />} />
          <Route path="/pricing" element={<LazyRoute component={PricingPage} />} />
          <Route path="/case-studies" element={<LazyRoute component={CaseStudiesPage} />} />
          <Route path="/case-studies/:caseStudySlug" element={<LazyRoute component={CaseStudyDetailPage} />} />
          <Route path="/contact" element={<LazyRoute component={ContactPage} />} />
          <Route path="/blogs" element={<LazyRoute component={BlogsPage} />} />
          <Route path="/blogs/:blogId" element={<LazyRoute component={BlogDetailPage} />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedLazyRoute component={DashboardPage} />} />

          {/* Auth pages */}
          <Route path="/signin" element={<LazyRoute component={SignInPage} />} />
          <Route path="/signup" element={<LazyRoute component={SignUpPage} />} />
          <Route path="/forgot-password" element={<LazyRoute component={ForgotPasswordPage} />} />

          {/* Policy Pages */}
          <Route path="/privacy" element={<LazyRoute component={PrivacyPolicy} />} />
          <Route path="/terms" element={<LazyRoute component={TermsAndConditions} />} />
          <Route path="/refund" element={<LazyRoute component={RefundPolicy} />} />

          {/* Document Generator Pages */}
          <Route path="/documents/privacy-policy" element={<LazyRoute component={PrivacyPolicyPage} />} />
          <Route path="/documents/terms-of-service" element={<LazyRoute component={EulaPage} />} />
          <Route path="/documents/refund-policy" element={<LazyRoute component={RefundPolicyPage} />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default memo(App);