import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Edit3, 
  UserCog, 
  UserCheck, 
  Scale, 
  CalendarCheck, 
  Save 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
// import { API_BASE } from '../../lib/apiBase';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom/client';

// Components
import FormField from '../../components/forms/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { PoASignatureBlock } from '../../components/ui/SignatureBlock';

// Types
interface IFormFieldProps extends Omit<React.ComponentProps<typeof FormField>, 'name' | 'value' | 'onChange' | 'error' | 'id'> {
  required?: boolean;
}

interface PowerOfAttorneyData {
  // Step 1: Document Type & Principal (Executor) Details
  poaType: 'general' | 'special' | 'durable' | 'medical' | '';
  principalFullName: string;
  principalAddress: string;
  principalPan: string;
  principalDob: string;

  // Step 2: Attorney-in-Fact (Agent) Details
  agentFullName: string;
  agentAddress: string;
  agentPan: string;
  agentRelationshipToPrincipal: string;

  // Step 3: Scope of Authority & Jurisdiction
  specificPowersGranted: string;
  limitationsOnPowers: string;
  durationOfPoa: string;
  governingLawAndJurisdiction: string;

  // Step 4: Witnesses & Finalization
  witness1FullName: string;
  witness1Address: string;
  witness2FullName: string;
  witness2Address: string;
  poaEffectiveDate: string;
}

const initialData: PowerOfAttorneyData = {
  poaType: '',
  principalFullName: '',
  principalAddress: '',
  principalPan: '',
  principalDob: '',
  agentFullName: '',
  agentAddress: '',
  agentPan: '',
  agentRelationshipToPrincipal: '',
  specificPowersGranted: 'e.g., To manage all financial affairs, including banking, investments, and real estate transactions. To file taxes and handle government correspondence. To make healthcare decisions (if medical PoA).',
  limitationsOnPowers: 'e.g., This Power of Attorney does not grant the Agent the power to make gifts of the Principal\'s property or change the Principal\'s will.',
  durationOfPoa: 'e.g., This Power of Attorney shall become effective immediately and shall continue until revoked by the Principal in writing.',
  governingLawAndJurisdiction: 'e.g., The laws of the State of [YourState], United States of America.',
  witness1FullName: '',
  witness1Address: '',
  witness2FullName: '',
  witness2Address: '',
  poaEffectiveDate: new Date().toISOString().split('T')[0],
};

const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const PowerOfAttorneyPage: React.FC = () => {
  const location = useLocation();
  const [editingTemplate] = useState<any>(location.state?.template || null);  const initialFormData = React.useMemo(() => {
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
  const [formData, setFormData] = useState<PowerOfAttorneyData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const totalFormSteps = 4;
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
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
  } = useFormValidation('powerOfAttorney', formData, totalFormSteps);

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

  const handleNext = () => nextStep();
  const handleBack = () => prevStep();

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
    const title = `Power of Attorney - ${formData.principalFullName || 'Untitled'}`;
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

  const handleDownloadPdf = async () => {
    // First validate all steps
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
      root.render(renderLivePreview(true));
      setTimeout(async () => {
        const previewNode = container.firstElementChild;
        await html2pdf().from(previewNode).set({
          filename: `Power-of-Attorney-${formData.principalFullName || 'Document'}.pdf`,
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

  const poaTypeOptions = [
    { value: 'general', label: 'General Power of Attorney' },
    { value: 'special', label: 'Special/Limited Power of Attorney' },
    { value: 'durable', label: 'Durable Power of Attorney' },
    { value: 'medical', label: 'Medical Power of Attorney' },
  ];

  const getError = (fieldName: string) => {
    return errors?.[fieldName];
  };

  const renderField = (
    fieldName: keyof PowerOfAttorneyData, 
    props: Omit<React.ComponentProps<typeof FormField>, 'name' | 'value' | 'onChange' | 'error' | 'id'> & { required?: boolean } = { label: '' }
  ) => {
    const error = getError(fieldName);
    const commonProps = {
      ...props,
      id: fieldName,
      name: fieldName,
      value: formData[fieldName] as string,
      onChange: handleChange,
      error: error,
      required: props.required !== false,
    };
    return <FormField {...commonProps} />;
  };

  const renderStepFormContent = () => {
    const commonFieldProps = {
      className: 'w-full',
      labelClassName: 'font-medium text-gray-700',
      inputClassName: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent',
      errorClassName: 'mt-1 text-sm text-red-600',
    };

    type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'email' | 'tel' | 'url';

  const getFieldProps = (
    _fieldName: keyof PowerOfAttorneyData, 
    label: string, 
    required = true, 
    type: FieldType = 'text', 
    extraProps: Omit<IFormFieldProps, 'label' | 'type' | 'required'> = {}
  ) => ({
    ...commonFieldProps,
    ...extraProps,
    label,
    type,
    required,
  });

    switch (currentStep) {
      case 1: // Document Type & Principal (Executor) Details
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Document Type</h3>
              {renderField('poaType', {
                ...getFieldProps('poaType', 'Type of Power of Attorney', true, 'select'),
                options: poaTypeOptions,
              })}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Principal (Person Granting Power)</h3>
              {renderField('principalFullName', getFieldProps('principalFullName', 'Full Legal Name of Principal'))}
              {renderField('principalAddress', getFieldProps('principalAddress', 'Permanent Address of Principal', true, 'textarea'))}
              {renderField('principalDob', getFieldProps('principalDob', "Principal's Date of Birth", true, 'date'))}
              {renderField('principalPan', {
                ...getFieldProps('principalPan', "Principal's PAN / National ID / SSN (as applicable)"),
                placeholder: 'Enter relevant ID number',
              })}
            </div>
          </>
        );
      case 2: // Attorney-in-Fact (Agent) Details
        return (
          <>
            {renderField('agentFullName', {
              ...commonFieldProps,
              sectionTitle: 'Attorney-in-Fact (Agent - Person Receiving Power)',
              label: 'Full Legal Name of Agent',
              required: true,
            })}
            {renderField('agentAddress', {
              ...commonFieldProps,
              label: 'Permanent Address of Agent',
              type: 'textarea',
              required: true,
            })}
            {renderField('agentPan', {
              ...commonFieldProps,
              label: "Agent's PAN / National ID / SSN (as applicable)",
              placeholder: 'Enter relevant ID number',
              required: true,
            })}
            {renderField('agentRelationshipToPrincipal', {
              ...commonFieldProps,
              label: "Agent's Relationship to Principal (e.g., Spouse, Child, Friend)",
              required: true,
            })}
          </>
        );
      case 3: // Scope of Authority & Jurisdiction
        return (
          <>
            {renderField('specificPowersGranted', {
              ...commonFieldProps,
              sectionTitle: 'Scope of Authority',
              label: 'Specific Powers Granted to Agent',
              type: 'textarea',
              rows: 7,
              placeholder: "Clearly list all powers. If General PoA, state 'All lawful acts the Principal could perform.' If Special, list specific tasks.",
              required: true,
            })}
            {renderField('limitationsOnPowers', {
              ...commonFieldProps,
              label: "Limitations on Agent's Powers (if any)",
              type: 'textarea',
              rows: 4,
              placeholder: "e.g., Agent cannot sell Principal's primary residence.",
              required: false,
            })}
            {renderField('durationOfPoa', {
              ...commonFieldProps,
              label: 'Duration & Revocation Conditions',
              type: 'textarea',
              rows: 3,
              placeholder: "e.g., Effective immediately until revoked in writing by Principal, or upon Principal's death.",
              required: true,
            })}
            {formData.poaType === 'durable' && (
              <p className="text-sm text-accent -mt-4 mb-4 ml-1 italic">
                For Durable PoA, ensure this includes language about remaining in effect upon Principal's incapacity.
              </p>
            )}
            {renderField('governingLawAndJurisdiction', {
              ...commonFieldProps,
              sectionTitle: 'Jurisdiction',
              label: 'Governing Law & Jurisdiction',
              placeholder: 'e.g., The laws of the State of [YourState], [YourCountry]',
              required: true,
            })}
          </>
        );
      case 4: // Witnesses & Finalization
        return (
          <>
            {renderField('witness1FullName', {
              ...commonFieldProps,
              sectionTitle: 'Witness Information (If Required by Jurisdiction)',
              label: 'Full Name of Witness 1',
              required: false,
            })}
            {renderField('witness1Address', {
              ...commonFieldProps,
              label: 'Address of Witness 1',
              type: 'textarea',
              required: false,
            })}
            <hr className="my-6 border-gray-300" />
            {renderField('witness2FullName', {
              ...commonFieldProps,
              label: 'Full Name of Witness 2 (Optional/If Required)',
              required: false,
            })}
            {renderField('witness2Address', {
              ...commonFieldProps,
              label: 'Address of Witness 2',
              type: 'textarea',
              required: false,
            })}
            {renderField('poaEffectiveDate', {
              ...commonFieldProps,
              sectionTitle: 'Finalization',
              label: 'Power of Attorney Effective Date',
              type: 'date',
              required: true,
            })}
            <p className="text-sm text-textColor/80 mt-4 italic">
              Note: This document will need to be signed by the Principal, Agent, and any Witnesses in accordance with local laws.
              Notarization may also be required depending on your jurisdiction and the powers granted.
            </p>
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

  const renderLivePreview = (forDownload = false) => (
    <div ref={previewRef} className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-center text-primary !mb-2">POWER OF ATTORNEY</h2>
      <p className="text-center text-sm text-gray-600 mb-6">
        {formData.poaType === 'general' && 'GENERAL POWER OF ATTORNEY'}
        {formData.poaType === 'special' && 'SPECIAL/LIMITED POWER OF ATTORNEY'}
        {formData.poaType === 'durable' && 'DURABLE POWER OF ATTORNEY'}
        {formData.poaType === 'medical' && 'MEDICAL POWER OF ATTORNEY (HEALTHCARE PROXY)'}
        {!formData.poaType && 'POWER OF ATTORNEY'}
      </p>
      
      <p className="text-justify">
        KNOW ALL MEN BY THESE PRESENTS, that I, <span className="font-semibold">{formData.principalFullName || '[Principal\'s Full Name]'}</span>, 
        residing at <span className="font-medium">{formData.principalAddress || '[Principal\'s Address]'}</span>, 
        hereby make, constitute, and appoint <span className="font-semibold">{formData.agentFullName || '[Agent\'s Full Name]'}</span>, 
        residing at <span className="font-medium">{formData.agentAddress || '[Agent\'s Address]'}</span>, 
        as my true and lawful attorney-in-fact ("Agent") for me and in my name, place, and stead, and for my use and benefit.
      </p>

      <PreviewSectionTitle title="1. Principal & Agent Information" stepToEdit={1} />
      <p><strong>Principal:</strong> {formData.principalFullName || '[Principal\'s Full Name]'}</p>
      <p className="whitespace-pre-line"><strong>Address:</strong> {formData.principalAddress || '[Principal\'s Address]'}</p>
      {formData.principalDob && <p><strong>Date of Birth:</strong> {formData.principalDob}</p>}
      {formData.principalPan && <p><strong>PAN/ID:</strong> {formData.principalPan}</p>}
      
      <p className="mt-4"><strong>Agent:</strong> {formData.agentFullName || '[Agent\'s Full Name]'}</p>
      <p className="whitespace-pre-line"><strong>Address:</strong> {formData.agentAddress || '[Agent\'s Address]'}</p>
      {formData.agentPan && <p><strong>PAN/ID:</strong> {formData.agentPan}</p>}
      {formData.agentRelationshipToPrincipal && <p><strong>Relationship to Principal:</strong> {formData.agentRelationshipToPrincipal}</p>}

      <PreviewSectionTitle title="2. Scope of Authority" stepToEdit={3} />
      <p><strong>Type of Power of Attorney:</strong> {poaTypeOptions.find(opt => opt.value === formData.poaType)?.label || 'Not specified'}</p>
      
      <p className="mt-2"><strong>Powers Granted:</strong></p>
      <div className="whitespace-pre-line text-sm bg-gray-50 p-3 rounded mt-1">
        {formData.specificPowersGranted || '[Specific powers granted to the Agent will appear here]'}
      </div>
      
      {formData.limitationsOnPowers && (
        <div className="mt-3">
          <p><strong>Limitations:</strong></p>
          <div className="whitespace-pre-line text-sm bg-gray-50 p-3 rounded mt-1">
            {formData.limitationsOnPowers}
          </div>
        </div>
      )}

      <PreviewSectionTitle title="3. Duration & Governing Law" stepToEdit={3} />
      <p><strong>Effective Date:</strong> {formData.poaEffectiveDate || '[Effective Date]'}</p>
      <p><strong>Duration:</strong> {formData.durationOfPoa || '[Duration of POA]'}</p>
      <p className="whitespace-pre-line"><strong>Governing Law:</strong> {formData.governingLawAndJurisdiction || '[Governing Law]'}</p>

      {(formData.witness1FullName || formData.witness2FullName) && (
        <>
          <PreviewSectionTitle title="4. Witnesses" stepToEdit={4} />
          <div className="grid md:grid-cols-2 gap-4">
            {formData.witness1FullName && (
              <div className="border p-3 rounded">
                <p><strong>Witness 1:</strong> {formData.witness1FullName}</p>
                {formData.witness1Address && <p className="text-sm">{formData.witness1Address}</p>}
              </div>
            )}
            {formData.witness2FullName && (
              <div className="border p-3 rounded">
                <p><strong>Witness 2:</strong> {formData.witness2FullName}</p>
                {formData.witness2Address && <p className="text-sm">{formData.witness2Address}</p>}
              </div>
            )}
          </div>
        </>
      )}
      
      {forDownload ? (
        <PoASignatureBlock
          principal={formData.principalFullName}
          agent={formData.agentFullName}
          witness1={formData.witness1FullName}
          witness2={formData.witness2FullName}
          effectiveDate={formData.poaEffectiveDate}
        />
      ) : (
        <p className="mt-6 text-center italic text-xs">Signature blocks will be included in the final document.</p>
      )}
    </div>
  );

  const progressSteps = [1, 2, 3, 4];
  const progressLabels = ["Principal", "Agent", "Authority", "Finalize"];
  const progressIcons = [<UserCheck size={16} />, <UserCog size={16} />, <Scale size={16} />, <CalendarCheck size={16} />];

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">Generate Power of Attorney (PoA)</h1>
      <p className="text-center text-textColor mb-8 max-w-2xl mx-auto">
        Grant legal authority by completing the steps below. The preview will update live.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto mb-10">
        <div className="flex items-center">
          {progressSteps.map((stepNum, index) => (
            <React.Fragment key={`progress-${stepNum}`}>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => jumpToStep(stepNum)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${currentStep > stepNum ? 'bg-accent border-accent text-white' : ''} ${currentStep === stepNum ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
                  {currentStep > stepNum ? <CheckCircle size={20} /> : progressIcons[index] || stepNum}
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
    </motion.div>
  );
};

export default PowerOfAttorneyPage;
