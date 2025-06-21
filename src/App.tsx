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
const EditProfilePage = React.lazy(() => import('./pages/EditProfilePage'));
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


// Full screen layout for pages with full-screen hero sections
const FullScreenLayout: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
  <div className="flex flex-col min-h-screen text-textColor bg-white">
    <Header />
    <main className="flex-grow">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
));

// Wrapper component for full-screen lazy-loaded routes
const FullScreenLazyRoute: React.FC<{ component: React.ComponentType }> = memo(({ component: Component }) => (
  <FullScreenLayout>
    <Component />
  </FullScreenLayout>
));


// Wrapper component for protected full-screen lazy-loaded routes
const ProtectedFullScreenLazyRoute: React.FC<{ component: React.ComponentType }> = memo(({ component: Component }) => (
  <ProtectedRoute>
    <FullScreenLayout>
      <Component />
    </FullScreenLayout>
  </ProtectedRoute>
));

function App() {
  return (
    <AuthProvider>
      <>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<FullScreenLazyRoute component={HomePage} />} />
          <Route path="/about" element={<FullScreenLazyRoute component={AboutPage} />} />
          <Route path="/generate" element={<FullScreenLazyRoute component={DocumentGeneratorPage} />} />
          <Route path="/Documents/generate" element={<FullScreenLazyRoute component={DocumentGeneratorPage} />} />
          <Route path="/Documents/generate/nda" element={<FullScreenLazyRoute component={NdaPage} />} />
          <Route path="/Documents/generate/privacy-policy" element={<FullScreenLazyRoute component={PrivacyPolicyPage} />} />
          <Route path="/Documents/generate/refund-policy" element={<FullScreenLazyRoute component={RefundPolicyPage} />} />
          <Route path="/Documents/generate/power-of-attorney" element={<FullScreenLazyRoute component={PowerOfAttorneyPage} />} />
          <Route path="/Documents/generate/eula" element={<FullScreenLazyRoute component={EulaPage} />} />
          <Route path="/Documents/generate/website-services-agreement" element={<FullScreenLazyRoute component={WebsiteServicesAgreementPage} />} />
          <Route path="/Documents/generate/cookies-policy" element={<FullScreenLazyRoute component={CookiesPolicyPage} />} />
          <Route path="/templates" element={<FullScreenLazyRoute component={TemplateLibraryPage} />} />
          <Route path="/attorneys" element={<FullScreenLazyRoute component={AttorneyPage} />} />
          <Route path="/schedule-consultation/:attorneySlug" element={<FullScreenLazyRoute component={ScheduleConsultationPage} />} />
          <Route path="/resources" element={<FullScreenLazyRoute component={LegalResourcesPage} />} />
          <Route path="/resources/:resourceSlug" element={<FullScreenLazyRoute component={ResourceDetailPage} />} />
          <Route path="/pricing" element={<FullScreenLazyRoute component={PricingPage} />} />
          <Route path="/case-studies" element={<FullScreenLazyRoute component={CaseStudiesPage} />} />
          <Route path="/case-studies/:caseStudySlug" element={<FullScreenLazyRoute component={CaseStudyDetailPage} />} />
          <Route path="/contact" element={<FullScreenLazyRoute component={ContactPage} />} />
          <Route path="/blogs" element={<FullScreenLazyRoute component={BlogsPage} />} />
          <Route path="/blogs/:blogId" element={<FullScreenLazyRoute component={BlogDetailPage} />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedFullScreenLazyRoute component={DashboardPage} />} />
          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <FullScreenLayout>
                <Suspense fallback={<PageLoader />}>
                  <EditProfilePage />
                </Suspense>
              </FullScreenLayout>
            </ProtectedRoute>
          } />

          {/* Auth pages */}
          <Route path="/signin" element={<FullScreenLazyRoute component={SignInPage} />} />
          <Route path="/signup" element={<FullScreenLazyRoute component={SignUpPage} />} />
          <Route path="/forgot-password" element={<FullScreenLazyRoute component={ForgotPasswordPage} />} />

          {/* Policy Pages */}
          <Route path="/privacy" element={<FullScreenLazyRoute component={PrivacyPolicy} />} />
          <Route path="/terms" element={<FullScreenLazyRoute component={TermsAndConditions} />} />
          <Route path="/refund" element={<FullScreenLazyRoute component={RefundPolicy} />} />

          {/* Document Generator Pages */}
          <Route path="/documents/privacy-policy" element={<FullScreenLazyRoute component={PrivacyPolicyPage} />} />
          <Route path="/documents/terms-of-service" element={<FullScreenLazyRoute component={EulaPage} />} />
          <Route path="/documents/refund-policy" element={<FullScreenLazyRoute component={RefundPolicyPage} />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default memo(App);