import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../../components/forms/FormField'; // Adjust path
import { generateDocx } from '../../utils/docxGenerator';  // Adjust path
import { ArrowLeft, ArrowRight, CheckCircle, Download, Edit3, Eye, ShieldCheck, Save } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

interface PrivacyPolicyData {
  // Step 1
  companyName: string;
  businessType: string;
  businessAddress: string;
  countryRegion: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  policyDate: string;

  // Step 2
  dataTypesCollected: string;
  usesCookies: 'yes' | 'no' | '';
  collectsSensitiveData: 'yes' | 'no' | '';
  purposeOfUsage: string;
  sendsMarketingEmails: 'yes' | 'no' | '';

  // Step 3
  sharesWithThirdParties: 'yes' | 'no' | '';
  thirdPartyServicesList: string;
  securityMeasures: string;
  userRightsAccess: 'yes' | 'no' | '';
  userRightsDelete: 'yes' | 'no' | '';
  userRightsUpdate: 'yes' | 'no' | '';
  policyUpdateNotification: string;
}

const initialData: PrivacyPolicyData = {
  companyName: '',
  businessType: '',
  businessAddress: '',
  countryRegion: '',
  contactEmail: '',
  contactPhone: '',
  websiteUrl: '',
  policyDate: new Date().toISOString().split('T')[0],
  dataTypesCollected: 'e.g., Name, Email Address, IP Address, Usage Data, Payment Information (if applicable).',
  usesCookies: '',
  collectsSensitiveData: '',
  purposeOfUsage: 'e.g., To provide and improve our services, personalize user experience, process transactions, communicate with users, analytics, marketing (if applicable).',
  sendsMarketingEmails: '',
  sharesWithThirdParties: '',
  thirdPartyServicesList: 'e.g., Google Analytics (Analytics), Stripe (Payment Processing), Mailchimp (Email Marketing), AWS (Hosting).',
  securityMeasures: 'e.g., SSL/TLS encryption for data in transit, encryption at rest for sensitive data, regular security audits, access controls, data minimization.',
  userRightsAccess: '',
  userRightsDelete: '',
  userRightsUpdate: '',
  policyUpdateNotification: 'e.g., Via email notification to registered users, a prominent notice on our website prior to the change becoming effective.',
};

const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const PrivacyPolicyPage: React.FC = () => {
  const [formData, setFormData] = useState<PrivacyPolicyData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const totalFormSteps = 3;

  const {
    currentStep,
    errors,
    nextStep,
    prevStep,
    jumpToStep,
    validateBeforeSubmit,
    setErrors
  } = useFormValidation('privacy', formData, totalFormSteps);

  useEffect(() => { 
    formColumnRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Clear error for the field being edited
    if (errors?.[name as keyof typeof errors]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const handleSaveToDashboard = async () => {
    // TODO: Implement save to dashboard functionality
    alert('Document saved to dashboard!');
  };

  const handleDownloadDocx = async () => {
    // First validate all steps
    const isValid = validateBeforeSubmit();
    if (!isValid) {
      // If not valid, the validation hook will have set the errors
      // and scrolled to the first error field
      return;
    }
    
    try {
      setIsGenerating(true);
      await generateDocx(formData, `Privacy-Policy-${formData.companyName || 'Document'}.docx`, 'privacy');
    } catch (error) { 
      console.error('Error generating DOCX:', error); 
      alert('Failed to generate DOCX document.'); 
    } finally {
      setIsGenerating(false);
    }
  };

  const yesNoOptions = [ { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

  const renderStepFormContent = () => {
    const getError = (fieldName: string) => {
      return errors ? errors[fieldName as keyof typeof errors] || '' : '';
    };

    // Helper function to render form fields with error handling
    const renderField = (fieldName: keyof PrivacyPolicyData, label: string, type: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select' = 'text', options?: { value: string; label: string }[], required = true, rows?: number, placeholder?: string) => (
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
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Company Information</h3>
            {renderField('companyName', 'Company/Organization Name', 'text', undefined, true)}
            {renderField('businessType', 'Type of Business', 'text', undefined, true)}
            {renderField('businessAddress', 'Business Address', 'textarea', undefined, true)}
            {renderField('countryRegion', 'Country/Region of Operation', 'text', undefined, true)}
            {renderField('contactEmail', 'Contact Email for Privacy Inquiries', 'email', undefined, true)}
            {renderField('contactPhone', 'Contact Phone (Optional)', 'tel', undefined, false)}
            {renderField('websiteUrl', 'Website URL', 'url', undefined, true, undefined, 'https://')}
            {renderField('policyDate', 'Policy Effective Date', 'date', undefined, true)}
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Collection & Usage</h3>
            {renderField('dataTypesCollected', 'What types of personal data do you collect?', 'textarea', undefined, true, 4, 'e.g., Name, Email Address, IP Address, Usage Data, Payment Information (if applicable).')}
            
            {renderField('usesCookies', 'Does your website use cookies or similar tracking technologies?', 'select', yesNoOptions, true)}
            {renderField('collectsSensitiveData', 'Do you collect sensitive personal data (e.g., health, financial, biometric data)?', 'select', yesNoOptions, true)}
            
            {renderField('purposeOfUsage', 'For what purposes do you use the collected data?', 'textarea', undefined, true, 4, 'e.g., To provide and improve our services, personalize user experience, process transactions, communicate with users, analytics, marketing (if applicable).')}
            
            {renderField('sendsMarketingEmails', 'Do you send marketing or promotional emails?', 'select', yesNoOptions, true)}
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Sharing & User Rights</h3>
            
            {renderField('sharesWithThirdParties', 'Do you share data with third parties?', 'select', yesNoOptions, true)}
            
            {formData.sharesWithThirdParties === 'yes' && renderField(
              'thirdPartyServicesList', 
              'List the third-party services and the purpose of sharing', 
              'textarea', 
              undefined, 
              true, 
              4, 
              'e.g., Google Analytics (Analytics), Stripe (Payment Processing), Mailchimp (Email Marketing), AWS (Hosting).'
            )}

            {renderField('securityMeasures', 'What security measures do you have in place to protect user data?', 'textarea', undefined, true, 4, 'e.g., SSL/TLS encryption for data in transit, encryption at rest for sensitive data, regular security audits, access controls, data minimization.')}
            
            <h4 className="font-medium text-gray-700 mt-6 mb-3">User Rights</h4>
            {renderField('userRightsAccess', 'Can users request access to their personal data?', 'select', yesNoOptions, true)}
            {renderField('userRightsDelete', 'Can users request deletion of their personal data?', 'select', yesNoOptions, true)}
            {renderField('userRightsUpdate', 'Can users update or correct their personal data?', 'select', yesNoOptions, true)}
            
            {renderField('policyUpdateNotification', 'How will users be notified of changes to this privacy policy?', 'textarea', undefined, true, 3, 'e.g., Via email notification to registered users, a prominent notice on our website prior to the change becoming effective.')}
          </>
        );
      default:
        return null;
    }
  };

  const PreviewSectionTitle: React.FC<{ title: string; stepToEdit: number; condition?: boolean }> = ({ title, stepToEdit, condition = true }) => {
    if (!condition) return null;
    return (
        <div className="flex justify-between items-center !mt-4 !mb-1 group">
        <h3 className="!text-base !font-semibold">{title}</h3>
        <button
            onClick={() => jumpToStep(stepToEdit)}
            className="text-accent opacity-0 group-hover:opacity-100 hover:text-primary text-xs font-medium p-1 rounded hover:bg-accent/10 transition-all duration-200 flex items-center gap-1"
            title={`Edit ${title}`}
        >
            <Edit3 size={14} /> Edit
        </button>
        </div>
    );
  };

  const renderLivePreview = () => (
    <div ref={previewRef} className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto">
        <h2 className="text-xl font-semibold text-center text-primary !mb-6">Privacy Policy Preview</h2>

        <PreviewSectionTitle title="1. Introduction & Business Information" stepToEdit={1} />
        <p>This Privacy Policy describes how {formData.companyName || "[Company Name]"} ("we", "us", or "our") collects, uses, and shares personal information of users of our website {formData.websiteUrl ? <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer">{formData.websiteUrl}</a> : "[Website URL]"} (the "Service").</p>
        <p><strong>Effective Date:</strong> {formData.policyDate || "[Date]"}</p>
        <p><strong>Contact:</strong> {formData.contactEmail || "[Contact Email]"}</p>

        <PreviewSectionTitle title="2. Information We Collect & How We Use It" stepToEdit={2} />
        <p><strong>Types of Data Collected:</strong> <span className="whitespace-pre-line block">{formData.dataTypesCollected || "[List data types]"}</span></p>
        <p><strong>Cookies & Tracking:</strong> We {formData.usesCookies === 'yes' ? 'use' : (formData.usesCookies === 'no' ? 'do not use' : '[use/do not use]')} cookies and similar technologies. {formData.usesCookies === 'yes' && `(Refer to our Cookies Policy for details).`}</p>
        <p><strong>Sensitive Data:</strong> We {formData.collectsSensitiveData === 'yes' ? 'may collect' : (formData.collectsSensitiveData === 'no' ? 'do not knowingly collect' : '[may collect/do not collect]')} sensitive personal data.</p>
        <p><strong>Purpose of Use:</strong> <span className="whitespace-pre-line block">{formData.purposeOfUsage || "[State purposes]"}</span></p>
        <p><strong>Marketing Communications:</strong> We {formData.sendsMarketingEmails === 'yes' ? 'may send you' : (formData.sendsMarketingEmails === 'no' ? 'will not send you' : '[may send/will not send]')} marketing emails. You can opt-out at any time.</p>

        <PreviewSectionTitle title="3. Data Sharing, Security & Your Rights" stepToEdit={3} />
        <p><strong>Third-Party Sharing:</strong> We {formData.sharesWithThirdParties === 'yes' ? 'may share your information with third-party service providers' : (formData.sharesWithThirdParties === 'no' ? 'do not share your personal data with third parties for their own marketing purposes without your consent' : '[state sharing practices]')}.
          {formData.sharesWithThirdParties === 'yes' && ` Key services include: ${formData.thirdPartyServicesList || "[List services]"}.`}
        </p>
        <p><strong>Data Security:</strong> <span className="whitespace-pre-line block">{formData.securityMeasures || "[Describe security measures]"}</span></p>
        <p><strong>Your Rights:</strong> You typically have the right to Access ({formData.userRightsAccess?.toUpperCase() || "N/A"}), Delete ({formData.userRightsDelete?.toUpperCase() || "N/A"}), and Update ({formData.userRightsUpdate?.toUpperCase() || "N/A"}) your personal information. Please contact us to exercise these rights.</p>
        <p><strong>Policy Updates:</strong> <span className="whitespace-pre-line block">{formData.policyUpdateNotification || "[How users are notified]"}</span></p>

        <p className="mt-6 text-center italic text-xs">This is a preview. The final document will be formatted professionally and may include additional legal clauses.</p>
    </div>
  );

  const progressSteps = [1, 2, 3];
  const progressLabels = ["Business Info", "Data & Usage", "Security & Rights"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">Generate Privacy Policy</h1>
      <p className="text-center text-textColor mb-8 max-w-2xl mx-auto">
        Complete the information below to create your website's Privacy Policy.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xl mx-auto mb-10">
        <div className="flex items-center">
          {progressSteps.map((stepNum, index) => (
            <React.Fragment key={`progress-${stepNum}`}>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => jumpToStep(stepNum)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${currentStep > stepNum ? 'bg-accent border-accent text-white' : ''} ${currentStep === stepNum ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
                  {currentStep > stepNum ? <CheckCircle size={20} /> : stepNum}
                </div>
                <p className={`text-xs mt-1 transition-colors duration-300 ${currentStep >= stepNum ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                  {progressLabels[index]}
                </p>
              </div>
              {index < progressSteps.length - 1 && (
                <div className={`flex-1 h-1.5 transition-colors duration-300 mx-1 rounded ${currentStep > stepNum ? 'bg-accent' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left Column: Form Steps & Navigation */}
        <div ref={formColumnRef} className="bg-lightGray rounded-xl shadow-xl flex flex-col lg:h-[calc(100vh-16rem)]">
          <div className="p-6 md:p-8 flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} variants={stepVariants} initial="initial" animate="animate" exit="exit">
                {renderStepFormContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-6 border-t border-gray-300 bg-lightGray/50 rounded-b-xl">
            <div className="flex justify-between">
              <button onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 bg-white hover:bg-gray-100 text-primary border border-primary font-semibold py-2.5 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ArrowLeft size={18} /> Back
              </button>
              {currentStep < totalFormSteps ? (
                <button onClick={handleNext} className="flex items-center gap-2 bg-primary hover:bg-accent text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <div className="text-primary font-semibold flex items-center gap-2 p-2.5 px-6 rounded-lg bg-green-100 border border-green-300">
                  <CheckCircle size={18} className="text-green-600" /> All Sections Filled
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
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Save size={18}/> Save to Dashboard
            </button>
            <button 
              onClick={handleDownloadDocx} 
              disabled={isGenerating} 
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-colors"
            >
              <Download size={18}/> {isGenerating ? 'Generating DOCX...' : 'Download DOCX'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyPage;