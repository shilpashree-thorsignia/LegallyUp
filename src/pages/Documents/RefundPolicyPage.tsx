import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../../components/forms/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ArrowLeft, ArrowRight, CheckCircle, Edit3,  Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { API_BASE } from '../../lib/apiBase';

interface RefundPolicyData {
  // Step 1: Business Information & Policy Scope
  companyName: string;
  businessType: string;
  businessAddress: string; // Optional
  countryRegion: string;   // Optional
  contactEmail: string;    // For refund inquiries
  contactPhone: string;    // Optional
  websiteUrl: string;
  policyScope: string; // e.g., Digital products, Physical goods, Services

  // Step 2: Refund Eligibility & Process
  refundEligibilityConditions: string; // e.g., Within X days, unused, defective
  howToRequestRefund: string;        // e.g., Email support, fill a form
  refundProcessingTimeframe: string; // e.g., 5-7 business days after approval

  // Step 3: Non-Refundable Items, Exchanges & Shipping
  nonRefundableItems: string;      // e.g., Gift cards, downloadable software, sale items
  hasExchangePolicy: 'yes' | 'no' | '';
  exchangePolicyDetails: string;   // If yes, describe
  returnShippingResponsibility: 'customer' | 'company' | 'case_by_case' | ''; // Who pays for return shipping
  returnShippingInstructions: string; // If customer pays or specific instructions

  // Step 4: Contact & Policy Date
  policyEffectiveDate: string;
}

const initialData: RefundPolicyData = {
  companyName: '',
  businessType: '',
  businessAddress: '',
  countryRegion: '',
  contactEmail: '',
  contactPhone: '',
  websiteUrl: '',
  policyScope: 'e.g., All products and services sold on our website, unless otherwise specified.',
  refundEligibilityConditions: "e.g., To be eligible for a refund, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Our refund policy lasts for 30 days. If 30 days have gone by since your purchase, unfortunately, we can't offer you a refund or exchange.",
  howToRequestRefund: 'e.g., To request a refund, please email us at [Your Refund Email Address] with your order number and reason for the request. We may require proof of purchase or evidence of the issue.',
  refundProcessingTimeframe: 'e.g., Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment, within 5-7 business days.',
  nonRefundableItems: 'e.g., Gift cards, Downloadable software products, Some health and personal care items, Sale items (if applicable).',
  hasExchangePolicy: '',
  exchangePolicyDetails: 'e.g., We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at [Your Exchange Email Address] and send your item to: [Your Return Address].',
  returnShippingResponsibility: '',
  returnShippingInstructions: 'e.g., To return your product, you should mail your product to: [Your Return Address]. You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.',
  policyEffectiveDate: new Date().toISOString().split('T')[0],
};

const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const RefundPolicyPage: React.FC = () => {
  const location = useLocation();
  const [editingTemplate, setEditingTemplate] = useState<any>(location.state?.template || null);
  const initialFormData = React.useMemo(() => {
    if (editingTemplate && editingTemplate.content) {
      try {
        const parsed = typeof editingTemplate.content === 'string'
          ? JSON.parse(editingTemplate.content)
          : editingTemplate.content;
        return { ...initialData, ...parsed };
      } catch {
        return initialData;
      }
    }
    return initialData;
  }, [editingTemplate]);
  const [formData, setFormData] = useState<RefundPolicyData>(initialFormData);
  // const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const totalFormSteps = 4;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [saveError, setSaveError] = useState('');

  const {
    currentStep,
    errors,
    nextStep,
    prevStep,
    jumpToStep,
    validateBeforeSubmit,
    setErrors
  } = useFormValidation('refundPolicy', formData, totalFormSteps);

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
    if (saveError) setSaveError('');
    if (showErrorModal) setShowErrorModal(false);
  };

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const handleSaveToDashboard = async () => {
    if (!user) {
      setSaveError('You must be logged in to save documents.');
      setShowErrorModal(true);
      return;
    }
    if (typeof validateBeforeSubmit === 'function') {
      const isValid = validateBeforeSubmit();
      if (!isValid) {
        setSaveError('Please fill in all mandatory fields before saving the document.');
        setShowErrorModal(true);
        return;
      }
    }
    setSaveError('');
    setShowErrorModal(false);
    setIsSaving(true);
    const title = `Refund Policy - ${formData.companyName || 'Untitled'}`;
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
        setSaveError('Failed to save: ' + (data.error || 'Unknown error'));
        setShowErrorModal(true);
      }
    } catch (err) {
      setSaveError('Failed to save: ' + err);
      setShowErrorModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Add a handler for document generation/download with validation
  const handleDownload = async () => {
    if (typeof validateBeforeSubmit === 'function') {
      const isValid = validateBeforeSubmit();
      if (!isValid) {
        setSaveError('Please fill in all mandatory fields before generating the document.');
        setShowErrorModal(true);
        return;
      }
    }
    // Place your document generation logic here (e.g., download PDF, DOCX, etc.)
    alert('Document would be generated here (implement actual logic)');
  };

  const renderStepFormContent = () => {
    const yesNoOptions = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ];

    const shippingResponsibilityOptions = [
      { value: 'customer', label: 'Customer pays for return shipping' },
      { value: 'company', label: 'Company pays for return shipping' },
      { value: 'case_by_case', label: 'Decided on a case-by-case basis' },
    ];
    
    const getError = (fieldName: string) => {
      return errors ? errors[fieldName as keyof typeof errors] || '' : '';
    };

    // Helper function to render form fields with error handling
    const renderField = (fieldName: keyof RefundPolicyData, label: string, type: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select' = 'text', options?: { value: string; label: string }[], required = true, rows?: number, placeholder?: string) => (
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
      case 1: // Business Information & Policy Scope
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Business Information</h3>
            {renderField('companyName', 'Company/Organization Name', 'text', undefined, true)}
            {renderField('businessType', 'Type of Business', 'text', undefined, true)}
            {renderField('businessAddress', 'Business Address', 'textarea', undefined, false)}
            {renderField('countryRegion', 'Country/Region of Operation', 'text', undefined, false)}
            {renderField('contactEmail', 'Contact Email for Refund Inquiries', 'email', undefined, true)}
            {renderField('contactPhone', 'Contact Phone (Optional)', 'tel', undefined, false)}
            {renderField('websiteUrl', 'Website URL', 'url', undefined, true, undefined, 'https://')}
            {renderField('policyScope', 'What does this policy apply to?', 'textarea', undefined, true, 3, 'e.g., All products and services sold on our website, unless otherwise specified.')}
          </>
        );
      case 2: // Refund Eligibility & Process
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Refund Eligibility</h3>
            {renderField('refundEligibilityConditions', 'Under what conditions is a customer eligible for a refund?', 'textarea', undefined, true, 5, 'e.g., To be eligible for a refund, your item must be unused and in the same condition that you received it. It must also be in the original packaging.')}
            
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 mt-6">Refund Process</h3>
            {renderField('howToRequestRefund', 'How can customers request a refund?', 'textarea', undefined, true, 4, 'e.g., To request a refund, please email us at [Your Refund Email Address] with your order number and reason for the request.')}
            {renderField('refundProcessingTimeframe', 'What is the expected timeframe for processing refunds?', 'textarea', undefined, true, 4, 'e.g., Once your return is received and inspected, we will send you an email to notify you that we have received your returned item.')}
          </>
        );
      case 3: // Non-Refundable Items, Exchanges & Shipping
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Non-Refundable Items & Exchanges</h3>
            {renderField('nonRefundableItems', 'List any items that are not eligible for refunds', 'textarea', undefined, true, 4, 'e.g., Gift cards, Downloadable software products, Some health and personal care items, Sale items (if applicable).')}
            
            {renderField('hasExchangePolicy', 'Do you offer exchanges?', 'select', yesNoOptions, true)}
            
            {formData.hasExchangePolicy === 'yes' && 
              renderField('exchangePolicyDetails', 'Please provide details about your exchange policy', 'textarea', undefined, true, 4, 'e.g., We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at [Your Exchange Email Address].')
            }
            
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 mt-6">Return Shipping</h3>
            {renderField('returnShippingResponsibility', 'Who is responsible for return shipping costs?', 'select', shippingResponsibilityOptions, true)}
            {renderField('returnShippingInstructions', 'Return shipping instructions for customers', 'textarea', undefined, true, 4, 'e.g., To return your product, you should mail your product to: [Your Return Address]. You will be responsible for paying for your own shipping costs for returning your item.')}
          </>
        );
      case 4: // Policy Date & Final Details
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Policy Effective Date</h3>
            {renderField('policyEffectiveDate', 'When does this policy go into effect?', 'date', undefined, true)}
            
            <div className="p-4 bg-blue-50 rounded-lg mt-6">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Review Your Refund Policy
              </h4>
              <p className="text-sm text-blue-700">
                Please review all the information you've entered. Once you're satisfied, you can generate your refund policy document.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const PreviewSectionTitle: React.FC<{ title: string; stepToEdit: number }> = ({ title, stepToEdit }) => (
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

  const renderLivePreview = () => (
    <div ref={previewRef} className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-center text-primary !mb-6">Refund Policy</h2>
      <p className="text-right text-sm text-gray-500">Effective Date: {formData.policyEffectiveDate || '[Date]'}</p>
      
      <PreviewSectionTitle title="1. Introduction" stepToEdit={1} />
      <p>This Refund Policy ("Policy") describes the policies and procedures of {formData.companyName || '[Your Company Name]'} ("we," "our," or "us") regarding refunds for purchases made through our website: {formData.websiteUrl ? <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer">{formData.websiteUrl}</a> : '[Your Website URL]'}.</p>
      <p className="whitespace-pre-line">{formData.policyScope || '[Policy Scope]'}</p>
      
      <PreviewSectionTitle title="2. Refund Eligibility & Process" stepToEdit={2} />
      <p className="whitespace-pre-line">{formData.refundEligibilityConditions || '[Refund Eligibility Conditions]'}</p>
      <p className="font-semibold mt-2">How to Request a Refund:</p>
      <p className="whitespace-pre-line">{formData.howToRequestRefund || '[How to Request a Refund]'}</p>
      <p className="mt-2"><strong>Processing Time:</strong> {formData.refundProcessingTimeframe || '[Refund Processing Timeframe]'}</p>
      
      <PreviewSectionTitle title="3. Non-Refundable Items & Exchanges" stepToEdit={3} />
      <p className="whitespace-pre-line">{formData.nonRefundableItems || '[Non-Refundable Items]'}</p>
      
      {formData.hasExchangePolicy === 'yes' && (
        <>
          <p className="font-semibold mt-2">Exchange Policy:</p>
          <p className="whitespace-pre-line">{formData.exchangePolicyDetails || '[Exchange Policy Details]'}</p>
        </>
      )}
      
      <p className="font-semibold mt-2">Return Shipping:</p>
      <p className="whitespace-pre-line">
        {formData.returnShippingResponsibility === 'customer' 
          ? 'You will be responsible for paying for your own shipping costs for returning your item.' 
          : formData.returnShippingResponsibility === 'company'
            ? 'We will cover the cost of return shipping.'
            : 'Return shipping responsibility will be determined on a case-by-case basis.'
        }
      </p>
      <p className="whitespace-pre-line">{formData.returnShippingInstructions || '[Return Shipping Instructions]'}</p>
      
      <PreviewSectionTitle title="4. Contact Us" stepToEdit={1} />
      <p>If you have any questions about this Refund Policy, please contact us at: {formData.contactEmail || '[Your Contact Email]'}</p>
      
      <p className="mt-6 text-center italic text-xs">This is a preview. The final document will be formatted professionally.</p>
    </div>
  );

  const progressSteps = [1, 2, 3, 4];
  const progressLabels = ["Business Info", "Eligibility", "Returns", "Finalize"];

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">Generate Refund Policy</h1>
      <p className="text-center text-textColor mb-8 max-w-2xl mx-auto">
        Create a clear and comprehensive refund policy for your business.
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
              disabled={isSaving} 
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18}/> {isSaving ? 'Saving...' : 'Save to Dashboard'}
            </button>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Download Document
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
    
    </motion.div>
  );
};

export default RefundPolicyPage;
