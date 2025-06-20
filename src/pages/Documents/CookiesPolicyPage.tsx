import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../../components/forms/FormField'; // Adjust path
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Eye, Save, Download } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom/client';
import { SinglePartySignatureBlock } from '../../components/ui/SignatureBlock';
// import { API_BASE } from '../../lib/apiBase';

interface CookiesPolicyData {
  // Step 1: Business & Basic Cookie Info
  companyName: string;
  businessType: string;
  businessAddress: string;
  countryRegion: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  usesCookies: 'yes' | 'no' | '';
  lastUpdated: string;

  // Step 2: Cookie Details (if usesCookies is 'yes')
  typesOfCookiesUsed: string;
  cookieDetailsList: string;
  cookiePolicyManagement: string;

  // Step 3: Contact & Legal References
  contactPersonPolicy: string;
  linkToPrivacyPolicy: string;
}

const initialCookiesPolicyData: CookiesPolicyData = {
  companyName: '',
  businessType: '',
  businessAddress: '',
  countryRegion: '',
  contactEmail: '',
  contactPhone: '',
  websiteUrl: '',
  usesCookies: '',
  lastUpdated: new Date().toISOString().split('T')[0],
  typesOfCookiesUsed: 'Essential/Strictly Necessary Cookies, Performance/Analytics Cookies, Functional Cookies, Targeting/Advertising Cookies.',
  cookieDetailsList: 'Example: \n- CookieName1 (Provider: Us, Purpose: Session management, Expiry: Session)\n- _ga (Provider: Google Analytics, Purpose: Website traffic analysis, Expiry: 2 years)',
  cookiePolicyManagement: 'Users can manage their cookie preferences through their browser settings or by using our cookie consent banner. Detailed instructions are available on our website.',
  contactPersonPolicy: '',
  linkToPrivacyPolicy: '',
};

const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const CookiesPolicyPage: React.FC = () => {
  const location = useLocation();
const [editingTemplate] = useState<any>(location.state?.template || null);  const initialFormData = React.useMemo(() => {
    if (editingTemplate && editingTemplate.content) {
      try {
        const parsed = typeof editingTemplate.content === 'string'
          ? JSON.parse(editingTemplate.content)
          : editingTemplate.content;
        return { ...initialCookiesPolicyData, ...parsed };
      } catch {
        return initialCookiesPolicyData;
      }
    }
    return initialCookiesPolicyData;
  }, [editingTemplate]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CookiesPolicyData>(initialFormData);
  // const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const totalFormSteps = formData.usesCookies === 'yes' ? 3 : 2; // Step 2 is conditional

  useEffect(() => {
    formColumnRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const { errors, validateBeforeSubmit } = useFormValidation('cookiesPolicy', formData, totalFormSteps);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (saveError) setSaveError('');
    if (showErrorModal) setShowErrorModal(false);
  };

  // Form validation is handled in handleDownloadDocx

  const handleNext = () => {
    if (currentStep < totalFormSteps) {
      if (formData.usesCookies === 'no' && currentStep === 1) {
        setCurrentStep(3); 
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // If not using cookies and currently on step 3, go back to step 1
      if (formData.usesCookies === 'no' && currentStep === 3) {
        setCurrentStep(1);
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  const jumpToStep = (step: number) => {
    if (step >= 1 && step <= totalFormSteps) {
      if (formData.usesCookies === 'no' && step === 2) {
        // If trying to jump to step 2 but not using cookies, go to step 1 or 3
        setCurrentStep(currentStep < 2 ? 1 : 3);
      } else {
        setCurrentStep(step);
      }
    }
  };

  const handleSaveToDashboard = async () => {
    if (!user) {
      setSaveError('You must be logged in to save documents.');
      setShowErrorModal(true);
      return;
    }
    const isValid = validateBeforeSubmit();
    if (!isValid) {
      setSaveError('Please fill in all mandatory fields before saving the document.');
      setShowErrorModal(true);
      return;
    }
    setSaveError('');
    setShowErrorModal(false);
    setIsSaving(true);
    const title = `Cookies Policy - ${formData.companyName || 'Untitled'}`;
    const content = JSON.stringify(formData, null, 2);
    try {
      let res;
      if (editingTemplate) {
        res = await fetch(`/api/templates/${editingTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });
      } else {
        res = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, title, content }),
        });
      }
      if (res.ok) {
        navigate('/dashboard');
      } else {
        const data = await res.json();
        const errorMessage = data.error || 'Unknown error';
        
        // Check if it's a daily limit error and show upgrade modal
        if (errorMessage.includes('Daily document generation limit reached')) {
          setShowUpgradeModal(true);
        } else {
          setSaveError('Failed to save: ' + errorMessage);
          setShowErrorModal(true);
        }
      }
    } catch (err) {
      setSaveError('Failed to save: ' + err);
      setShowErrorModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    const isValid = validateBeforeSubmit();
    if (!isValid) {
        setSaveError('Please fill in all mandatory fields before generating the document.');
        setShowErrorModal(true);
        return;
    }
    setSaveError('');
    setShowErrorModal(false);
    setIsGenerating(true);
    
    try {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        container.style.width = '800px';
        container.style.left = '0';
        container.style.top = '0';
        document.body.appendChild(container);

        const root = ReactDOM.createRoot(container);
        root.render(renderLivePreview(true));

        setTimeout(async () => {
            const previewNode = container.firstElementChild;
            await html2pdf().from(previewNode).set({
                filename: `Cookies-Policy-${formData.companyName || 'Document'}.pdf`,
                margin: 0.5,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }).save();
            root.unmount();
            document.body.removeChild(container);
            setIsGenerating(false);
        }, 1000);
    } catch (error) {
        setIsGenerating(false);
        setSaveError('Failed to generate PDF.');
        setShowErrorModal(true);
    }
  };

  const renderStepFormContent = () => {
    const yesNoOptions = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ];
    
    const getError = (fieldName: string) => {
      return errors ? errors[fieldName as keyof typeof errors] || '' : '';
    };

    // Helper function to render form fields with error handling
    const renderField = (fieldName: keyof CookiesPolicyData, label: string, type: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select' = 'text', options?: { value: string; label: string }[], required = true, rows?: number, placeholder?: string) => (
      <FormField
        id={fieldName}
        label={label}
        type={type}
        value={formData[fieldName]}
        onChange={handleChange}
        options={options}
        required={required}
        error={getError(fieldName as string)}
        rows={rows}
        placeholder={placeholder}
      />
    );

    switch (currentStep) {
      case 1: // Basic Information & Cookie Usage
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Business Information</h3>
            {renderField('companyName', 'Company/Organization Name', 'text', undefined, true)}
            {renderField('businessType', 'Type of Business', 'text', undefined, true)}
            {renderField('businessAddress', 'Business Address', 'textarea', undefined, false)}
            {renderField('countryRegion', 'Country/Region of Operation', 'text', undefined, false)}
            {renderField('contactEmail', 'Contact Email for Cookie Inquiries', 'email', undefined, true)}
            {renderField('contactPhone', 'Contact Phone (Optional)', 'tel', undefined, false)}
            {renderField('websiteUrl', 'Website URL', 'url', undefined, true, undefined, 'https://')}
            {renderField('usesCookies', 'Does your website use cookies or similar tracking technologies?', 'select', yesNoOptions, true)}
            {renderField('lastUpdated', 'Policy Last Updated Date', 'date', undefined, true)}
          </>
        );
      case 2: // Cookie Details (only shown if usesCookies is 'yes')
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Cookie Details</h3>
            {renderField('typesOfCookiesUsed', 'What types of cookies do you use?', 'textarea', undefined, true, 3, 'e.g., Essential, Analytics, Marketing, etc.')}
            {renderField('cookieDetailsList', 'List of cookies used on your website', 'textarea', undefined, true, 8, 'Example: \n- CookieName1 (Provider: Us, Purpose: Session management, Expiry: Session)\n- _ga (Provider: Google Analytics, Purpose: Website traffic analysis, Expiry: 2 years)')}
            {renderField('cookiePolicyManagement', 'How can users manage cookie preferences?', 'textarea', undefined, true, 4, 'e.g., Users can manage their cookie preferences through their browser settings or by using our cookie consent banner.')}
          </>
        );
      case 3: // Contact & Legal References
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Contact & Legal Information</h3>
            {renderField('contactPersonPolicy', 'Contact Person for Cookie Inquiries', 'text', undefined, true, undefined, 'e.g., Data Protection Officer or Privacy Team')}
            {renderField('linkToPrivacyPolicy', 'Link to your Privacy Policy', 'url', undefined, true, undefined, 'https://')}
            
            <div className="p-4 bg-blue-50 rounded-lg mt-6">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Review Your Cookies Policy
              </h4>
              <p className="text-sm text-blue-700">
                Please review all the information you've entered. Once you're satisfied, you can generate your cookies policy document.
              </p>
              <div className="mt-3 p-3 bg-blue-100 rounded text-sm">
                <p className="font-medium text-blue-800 mb-1">Legal Note:</p>
                <p className="text-blue-700">
                  This is a general template. Consider consulting with a legal professional to ensure compliance with cookie laws like the ePrivacy Directive and GDPR.
                </p>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const PreviewSectionTitle: React.FC<{ title: string; stepToEdit: number; condition?: boolean }> = ({ title, stepToEdit, condition = true }) => {
    if (!condition) return null;
    return (
        <div className="flex justify-between items-center !mt-4 !mb-1">
        <h3 className="!text-base !font-semibold">{title}</h3>
        <button
            onClick={() => jumpToStep(stepToEdit)}
            className="text-accent hover:text-primary text-xs font-medium p-1 rounded hover:bg-accent/10 transition-colors flex items-center gap-1"
            title={`Edit ${title}`}
        >
            <Edit3 size={14} /> Edit
        </button>
        </div>
    );
  };

  const renderLivePreview = (forDownload = false) => (
    <div ref={previewRef} className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-center text-primary !mb-6">Cookies Policy</h2>
      
      <PreviewSectionTitle title="Introduction" stepToEdit={1} />
      <p>This Cookies Policy explains how {formData.companyName || '[Company Name]'} ("we", "us", or "our") uses cookies and similar technologies on our website {formData.websiteUrl || '[Website URL]'}.</p>
      <p><strong>Last Updated:</strong> {formData.lastUpdated || '[Date]'}</p>
      
      <PreviewSectionTitle title="Cookie Usage" stepToEdit={1} />
      <p>Our website {formData.usesCookies === 'yes' ? 'uses' : (formData.usesCookies === 'no' ? 'does not use' : '[uses/does not use]')} cookies.</p>
      
      <PreviewSectionTitle title="Types of Cookies & Details" stepToEdit={2} condition={formData.usesCookies === 'yes'} />
      {formData.usesCookies === 'yes' && (
        <>
          <p>We use the following types of cookies:</p>
          <p className="whitespace-pre-line">{formData.typesOfCookiesUsed || '[List types of cookies]'}</p>
          <p>Specific cookies we use include:</p>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded">{formData.cookieDetailsList || '[List specific cookies]'}</pre>
        </>
      )}

      <PreviewSectionTitle title="Managing Cookies" stepToEdit={2} condition={formData.usesCookies === 'yes'} />
      {formData.usesCookies === 'yes' && (
        <p className="whitespace-pre-line">{formData.cookiePolicyManagement || '[How users can manage cookies]'}</p>
      )}

      <PreviewSectionTitle title="Contact & Other Policies" stepToEdit={3} />
      <p>For more information about our privacy practices, please see our Privacy Policy: <a href={formData.linkToPrivacyPolicy} target="_blank" rel="noopener noreferrer">{formData.linkToPrivacyPolicy || '[Privacy Policy Link]'}</a>.</p>
      <p>If you have any questions about this Cookies Policy, please contact {formData.contactPersonPolicy || '[Contact Person/Team]'} at <a href={`mailto:${formData.contactEmail}`}>{formData.contactEmail || '[Contact Email]'}</a>.</p>

      {forDownload && (
        <SinglePartySignatureBlock
          party={formData.companyName}
          partyRole={`${formData.companyName} - Authorized Representative`}
        />
      )}
    </div>
  );

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-center mb-2">Cookies Policy Generator</h1>
      <p className="text-center text-gray-600 mb-8">Create a custom Cookies Policy for your website in minutes</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div ref={formColumnRef} className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Document Details</h2>
              <div className="flex items-center space-x-2">
                <Eye className="text-gray-500" size={18} />
                <span className="text-sm text-gray-600">Step {currentStep} of {totalFormSteps}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1">
                    <div className={`h-2 rounded-full ${currentStep >= step ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    {step <= totalFormSteps && (
                      <div className="mt-2 text-center">
                        <button
                          onClick={() => jumpToStep(step)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                        >
                          {step}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                {renderStepFormContent()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
              {currentStep < totalFormSteps ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-green-600 font-medium">All steps completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview & Download */}
        <div className="sticky top-24 lg:h-[calc(100vh-12rem)] flex flex-col">
          <div className="flex-grow overflow-hidden rounded-lg border border-gray-300 shadow">
            {renderLivePreview()}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleSaveToDashboard} 
              disabled={isSaving} 
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18}/> {isSaving ? 'Saving...' : 'Save to Dashboard'}
            </button>
            <button 
              onClick={handleDownloadPdf} 
              disabled={isGenerating} 
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-colors"
            >
              <Download size={18}/> {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Action Required</h3>
            <p className="mb-6 text-gray-700">{saveError}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-accent transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-primary mb-4">Upgrade to Pro</h3>
            <p className="mb-6 text-gray-600">
              You've reached your daily document limit for the free plan. 
              Upgrade to Pro for unlimited document generation and access to premium templates!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/pricing')}
                className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2 text-gray-500 hover:text-primary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CookiesPolicyPage;
