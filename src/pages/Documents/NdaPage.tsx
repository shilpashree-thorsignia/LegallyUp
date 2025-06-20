import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../../components/forms/FormField'; // Adjust path if necessary
import { ArrowLeft, ArrowRight, CheckCircle, Download, Edit3, Save } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
// import { API_BASE } from '../../lib/apiBase';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom/client';

// Interface NdaData remains the same
interface NdaData {
  disclosingPartyName: string; disclosingPartyEntityType: string; disclosingPartyAddress: string;
  companyName: string; businessType: string; businessAddress: string; countryRegion: string; contactEmail: string; contactPhone: string;
  receivingPartyName: string; receivingPartyEntityType: string; receivingPartyAddress: string;
  effectiveDate: string; purposeOfDisclosure: string; durationNDA: string; governingLaw: string;
  definitionConfidentialInfo: string; obligationsReceivingParty: string; exclusionsConfidentiality: string; legalRemedies: string;
}

// initialNdaData remains the same
const initialNdaData: NdaData = {
  disclosingPartyName: '', disclosingPartyEntityType: 'Corporation', disclosingPartyAddress: '',
  companyName: '', businessType: '', businessAddress: '', countryRegion: '', contactEmail: '', contactPhone: '',
  receivingPartyName: '', receivingPartyEntityType: 'Corporation', receivingPartyAddress: '',
  effectiveDate: new Date().toISOString().split('T')[0], purposeOfDisclosure: 'e.g., To evaluate a potential business relationship or investment.',
  durationNDA: '5 years from the Effective Date', governingLaw: 'e.g., State of California, USA',
  definitionConfidentialInfo: 'Includes, but is not limited to, all non-public information...',
  obligationsReceivingParty: 'The Receiving Party shall hold and maintain...',
  exclusionsConfidentiality: 'Information that (a) is or becomes publicly known...',
  legalRemedies: 'The Disclosing Party shall be entitled to seek injunctive relief...',
};


const stepVariants = {
  initial: { opacity: 0, y: 20 }, // Adjusted y for a softer entry
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const NdaPage: React.FC = () => {
  const location = useLocation();
  const [editingTemplate] = useState<any>(location.state?.template || null);  const initialFormData = React.useMemo(() => {
    if (editingTemplate && editingTemplate.content) {
      try {
        const parsed = typeof editingTemplate.content === 'string'
          ? JSON.parse(editingTemplate.content)
          : editingTemplate.content;
        return { ...initialNdaData, ...parsed };
      } catch {
        return initialNdaData;
      }
    }
    return initialNdaData;
  }, [editingTemplate]);
  const [formData, setFormData] = useState<NdaData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const totalFormSteps = 3;
  const [isSaving, setIsSaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  const {
    currentStep,
    errors,
    nextStep,
    prevStep,
    jumpToStep,
    validateBeforeSubmit,
    setErrors
  } = useFormValidation('nda', formData, totalFormSteps);

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

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
    const isValid = validateBeforeSubmit();
    if (!isValid) {
      setSaveError('Please fill in all mandatory fields before saving the document.');
      setShowErrorModal(true);
      return;
    }
    setSaveError('');
    setShowErrorModal(false);
    setIsSaving(true);
    const title = `NDA - ${formData.disclosingPartyName || 'Untitled'}`;
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    // First validate all steps
    const isValid = validateBeforeSubmit();
    if (!isValid) {
      setSaveError('Please fill in all mandatory fields before generating the document.');
      setShowErrorModal(true);
      return;
    }
    setIsGenerating(true);
    try {
      // Render preview to hidden container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.width = '800px';
      container.style.left = '0';
      container.style.top = '0';
      document.body.appendChild(container);
      // Use your live preview render function/component
      const root = ReactDOM.createRoot(container);
      root.render(renderLivePreview());
      setTimeout(async () => {
        const previewNode = container.firstElementChild;
        await html2pdf().from(previewNode).set({
          filename: `NDA-${formData.disclosingPartyName || 'Document'}.pdf`,
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

  const entityTypes = [
    { value: 'Corporation', label: 'Corporation' }, { value: 'LLC', label: 'LLC' },
    { value: 'Partnership', label: 'Partnership' }, { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
    { value: 'Individual', label: 'Individual' },
  ];

  const renderStepFormContent = () => {
    const getError = (fieldName: string) => {
      return errors ? errors[fieldName as keyof typeof errors] || '' : '';
    };

    // Helper function to render form fields with error handling
    const renderField = (fieldName: keyof NdaData, label: string, type: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select' = 'text', options?: { value: string; label: string }[], required = true, rows?: number, placeholder?: string) => (
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
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Disclosing Party Information</h3>
            {renderField('disclosingPartyName', 'Full Name or Company Name', 'text', undefined, true)}
            {renderField('disclosingPartyEntityType', 'Entity Type', 'select', entityTypes, true)}
            {renderField('disclosingPartyAddress', 'Address', 'textarea', undefined, true)}
            
            {formData.disclosingPartyEntityType !== 'Individual' && (
              <>
                <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 mt-6">General Company Information (Disclosing Party)</h3>
                {renderField('companyName', 'Official Company Name', 'text', undefined, false, undefined, formData.disclosingPartyName)}
                {renderField('businessType', 'Business Type')}
                {renderField('businessAddress', 'Primary Business Address', 'textarea', undefined, false, undefined, formData.disclosingPartyAddress)}
                {renderField('countryRegion', 'Country/Region of Operation')}
                {renderField('contactEmail', 'Primary Contact Email', 'email')}
                {renderField('contactPhone', 'Primary Contact Phone (Optional)', 'tel', undefined, false)}
              </>
            )}
            
            <hr className="my-8 border-gray-300" />
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Receiving Party Information</h3>
            {renderField('receivingPartyName', 'Full Name or Company Name', 'text', undefined, true)}
            {renderField('receivingPartyEntityType', 'Entity Type', 'select', entityTypes, true)}
            {renderField('receivingPartyAddress', 'Address', 'textarea', undefined, true)}
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Core Agreement Details</h3>
            {renderField('effectiveDate', 'Effective Date', 'date', undefined, true)}
            {renderField('purposeOfDisclosure', 'Purpose of Disclosure', 'textarea', undefined, true, 4, 'e.g., To evaluate a potential business relationship or investment.')}
            {renderField('durationNDA', 'Duration of NDA (e.g., 5 years from Effective Date)', 'text', undefined, true)}
            {renderField('governingLaw', 'Governing Law (e.g., State of California, USA)', 'text', undefined, true)}
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Confidentiality & Obligations</h3>
            {renderField('definitionConfidentialInfo', 'Definition of Confidential Information', 'textarea', undefined, true, 6, 'Includes, but is not limited to, all non-public information...')}
            {renderField('obligationsReceivingParty', 'Obligations of Receiving Party', 'textarea', undefined, true, 6, 'The Receiving Party shall hold and maintain...')}
            {renderField('exclusionsConfidentiality', 'Exclusions from Confidentiality', 'textarea', undefined, false, 5, 'Information that (a) is or becomes publicly known...')}
            {renderField('legalRemedies', 'Legal Remedies & Breach Clause', 'textarea', undefined, false, 5, 'The Disclosing Party shall be entitled to seek injunctive relief...')}
          </>
        );
      default:
        return null;
    }
  };

  // Helper for Preview Section Title with Edit Button
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
    <div
      ref={previewRef}
      className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto"
    >
        <h2 className="text-xl font-semibold text-center text-primary !mb-6">NDA Preview</h2>
        <PreviewSectionTitle title="Parties & Effective Date" stepToEdit={1} />
        <p><strong>Effective Date:</strong> {formData.effectiveDate || "[Effective Date]"}</p>
        <p><strong>Disclosing Party:</strong> {formData.disclosingPartyName || "[Name]"} ({formData.disclosingPartyEntityType || "[Type]"}), {formData.disclosingPartyAddress || "[Address]"}.
            {formData.companyName && formData.companyName !== formData.disclosingPartyName ? ` (Company: ${formData.companyName}, Email: ${formData.contactEmail || "[Email]"})` : (formData.contactEmail ? ` (Email: ${formData.contactEmail})` : '')}
        </p>
        <p><strong>Receiving Party:</strong> {formData.receivingPartyName || "[Name]"} ({formData.receivingPartyEntityType || "[Type]"}), {formData.receivingPartyAddress || "[Address]"}.</p>

        <PreviewSectionTitle title="Agreement Core" stepToEdit={2} />
        <p><strong>Purpose of Disclosure:</strong> {formData.purposeOfDisclosure || "[Purpose]"}</p>
        <p><strong>Duration of NDA:</strong> {formData.durationNDA || "[Duration]"}</p>
        <p><strong>Governing Law:</strong> {formData.governingLaw || "[Governing Law]"}</p>

        <PreviewSectionTitle title="Confidentiality Terms" stepToEdit={3} />
        <p><strong>Definition of Confidential Information:</strong> <span className="whitespace-pre-line block">{formData.definitionConfidentialInfo || "[Definition]"}</span></p>
        <p><strong>Obligations of Receiving Party:</strong> <span className="whitespace-pre-line block">{formData.obligationsReceivingParty || "[Obligations]"}</span></p>
        <p><strong>Exclusions from Confidentiality:</strong> <span className="whitespace-pre-line block">{formData.exclusionsConfidentiality || "[Exclusions]"}</span></p>
        <p><strong>Legal Remedies & Breach:</strong> <span className="whitespace-pre-line block">{formData.legalRemedies || "[Remedies]"}</span></p>

        <p className="mt-6 text-center italic text-xs">--- Signature blocks will be included in the final downloaded document ---</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">Generate Non-Disclosure Agreement</h1>
      <p className="text-center text-textColor mb-8 max-w-2xl mx-auto">
        Fill in the details step-by-step. Your document preview will update live on the right.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xl mx-auto mb-10">
        <div className="flex items-center">
          {[1, 2, 3].map((stepNum, index) => (
            <React.Fragment key={stepNum}>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => jumpToStep(stepNum)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${currentStep > stepNum ? 'bg-accent border-accent text-white' : ''} ${currentStep === stepNum ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
                  {currentStep > stepNum ? <CheckCircle size={20} /> : stepNum}
                </div>
                <p className={`text-xs mt-1 transition-colors duration-300 ${currentStep >= stepNum ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                  {stepNum === 1 && "Parties"} {stepNum === 2 && "Agreement"} {stepNum === 3 && "Terms"}
                </p>
              </div>
              {index < totalFormSteps - 1 && (
                <div className={`flex-1 h-1.5 transition-colors duration-300 mx-1 rounded ${currentStep > stepNum ? 'bg-accent' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left Column: Form Steps & Navigation */}
        <div
          ref={formColumnRef}
          className="bg-lightGray rounded-xl shadow-xl flex flex-col lg:h-[calc(100vh-16rem)]" // Adjusted height calc, added flex flex-col
        >
          <div className="p-6 md:p-8 flex-grow overflow-y-auto"> {/* Form content area */}
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} variants={stepVariants} initial="initial" animate="animate" exit="exit">
                {renderStepFormContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons for Form Steps - MOVED TO BOTTOM OF THIS COLUMN */}
          <div className="p-6 border-t border-gray-300 bg-lightGray/50 rounded-b-xl">
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-primary border border-primary font-semibold py-2.5 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
              {currentStep < totalFormSteps ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-primary hover:bg-accent text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                >
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
    </motion.div>
  );
};

export default NdaPage;