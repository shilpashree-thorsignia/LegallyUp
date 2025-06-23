import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../../components/forms/FormField';
import { ArrowLeft, ArrowRight, CheckCircle, Download, Edit3, Users, Tv2, DollarSign, Lock, FileSignature, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom/client';
import { useFormValidation } from '../../hooks/useFormValidation';
import { SignatureBlock } from '../../components/ui/SignatureBlock';

interface WebsiteServicesAgreementData {
  // Step 1: Parties & Agreement Overview
  serviceProviderCompanyName: string;
  serviceProviderAddress: string;
  serviceProviderContactPerson: string;
  serviceProviderEmail: string;
  serviceProviderPhone: string;

  clientCompanyName: string;
  clientAddress: string;
  clientContactPerson: string;
  clientEmail: string;
  clientPhone: string;

  agreementDate: string; // Date the agreement is made
  projectName: string;   // Name or title of the website project

  // Step 2: Scope of Services & Deliverables
  websiteDescription: string;    // Detailed description of the website to be built/serviced
  servicesIncluded: string;      // List of services (e.g., Design, Development, SEO, Maintenance)
  specificDeliverables: string;  // e.g., Homepage design mockups, Fully functional e-commerce site, Monthly maintenance reports
  projectStartDate: string;
  projectCompletionDate: string; // Or estimated duration
  milestones: string; // Optional: Key project milestones and their deadlines (textarea)

  // Step 3: Payment Terms & Schedule
  totalProjectCost: string; // Can be fixed, hourly, or retainer
  paymentSchedule: string;  // e.g., 50% upfront, 50% on completion; or milestone-based
  latePaymentTerms: string; // e.g., Interest rate on overdue payments
  additionalExpenses: string; // e.g., Stock photos, premium plugins, travel (how they are handled)

  // Step 4: Intellectual Property, Confidentiality & Term
  intellectualPropertyOwnership: string; // Who owns the final website/code/design
  confidentialityClause: string;       // Standard confidentiality terms
  agreementTerm: string;               // Duration of the agreement (e.g., for ongoing maintenance) or project-based

  // Step 5: Termination, Dispute Resolution & Signatures
  terminationConditions: string; // How either party can terminate
  terminationNoticePeriod: string; // e.g., 30 days written notice
  governingLawAndJurisdiction: string;
  disputeResolutionMethod: string; // e.g., Mediation, Arbitration, Court
  agreementEffectiveDate: string; // When this agreement becomes effective (can be same as agreementDate)
}

const initialData: WebsiteServicesAgreementData = {
  serviceProviderCompanyName: '', 
  serviceProviderAddress: '', 
  serviceProviderContactPerson: '', 
  serviceProviderEmail: '', 
  serviceProviderPhone: '',
  clientCompanyName: '', 
  clientAddress: '', 
  clientContactPerson: '', 
  clientEmail: '', 
  clientPhone: '',
  agreementDate: new Date().toISOString().split('T')[0],
  projectName: '',
  websiteDescription: 'e.g., A responsive website with up to 10 pages, e-commerce functionality, and basic SEO setup.',
  servicesIncluded: 'e.g., Website design, front-end development, back-end development, content integration, basic SEO setup, 30 days of post-launch support.',
  specificDeliverables: 'e.g., Homepage design mockups, Inner page templates, Fully functional website, Source code, User documentation.',
  projectStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
  projectCompletionDate: 'e.g., 8 weeks from project start date',
  milestones: 'e.g., \n- Design Approval: 2 weeks after start\n- Development Complete: 6 weeks after start\n- Testing & Revisions: 1 week\n- Launch: 8 weeks after start',
  totalProjectCost: 'e.g., $5,000 USD (fixed price) or $75/hour',
  paymentSchedule: 'e.g., 50% due upon signing, 25% upon design approval, 25% upon completion.',
  latePaymentTerms: 'e.g., 1.5% monthly interest on overdue balances.',
  additionalExpenses: 'e.g., Stock photos, premium plugins, third-party services, travel expenses (if applicable). All expenses over $100 require prior written approval.',
  intellectualPropertyOwnership: 'e.g., Upon full payment, the Client will own all final deliverables. The Service Provider retains the right to display the work in their portfolio.',
  confidentialityClause: 'e.g., Both parties agree to keep confidential information private and not disclose it to third parties without prior written consent, except as required by law.',
  agreementTerm: 'e.g., This agreement remains in effect until the completion of the project and any post-launch support period, unless terminated earlier as provided herein.',
  terminationConditions: 'e.g., Either party may terminate this agreement with 30 days written notice. In the event of termination, the Client will pay for all work completed up to the termination date.',
  terminationNoticePeriod: 'e.g., 30 days written notice',
  governingLawAndJurisdiction: 'e.g., This agreement shall be governed by and construed in accordance with the laws of the State of [State], USA.',
  disputeResolutionMethod: 'e.g., Any disputes arising from this agreement shall first be attempted to be resolved through good faith negotiation. If unsuccessful, disputes will be resolved through binding arbitration in [City, State].',
  agreementEffectiveDate: new Date().toISOString().split('T')[0],
};

const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const WebsiteServicesAgreementPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [formData, setFormData] = useState<WebsiteServicesAgreementData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const totalFormSteps = 5;

  const {
    // errors,
    // nextStep,
    // prevStep,
    jumpToStep,
    validateBeforeSubmit,
    // setErrors
  } = useFormValidation('websiteServicesAgreement', formData, totalFormSteps);

  useEffect(() => {
    formColumnRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (saveError) setSaveError('');
    if (showErrorModal) setShowErrorModal(false);
  };

  const handleNext = () => { if (currentStep < totalFormSteps) setCurrentStep(prev => prev + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

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
    const title = `Website Services Agreement - ${formData.projectName || 'Untitled'}`;
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
        navigate('/dashboard', { state: { shouldRefreshDashboard: true } });
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
          filename: `Website-Services-Agreement-${formData.projectName || 'Project'}.pdf`,
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
    switch (currentStep) {
      case 1: // Parties & Agreement Overview
        return (
          <>
            <FormField sectionTitle="Service Provider (Developer/Agency)" id="serviceProviderCompanyName" label="Company Name" value={formData.serviceProviderCompanyName} onChange={handleChange} required />
            <FormField id="serviceProviderAddress" label="Permanent Address" type="textarea" value={formData.serviceProviderAddress} onChange={handleChange} required />
            <FormField id="serviceProviderContactPerson" label="Contact Person" value={formData.serviceProviderContactPerson} onChange={handleChange} />
            <FormField id="serviceProviderEmail" label="Email" type="email" value={formData.serviceProviderEmail} onChange={handleChange} required />
            <FormField id="serviceProviderPhone" label="Phone (Optional)" type="tel" value={formData.serviceProviderPhone} onChange={handleChange} />
            <hr className="my-8 border-gray-300"/>
            <FormField sectionTitle="Client" id="clientCompanyName" label="Company Name" value={formData.clientCompanyName} onChange={handleChange} required />
            <FormField id="clientAddress" label="Permanent Address" type="textarea" value={formData.clientAddress} onChange={handleChange} required />
            <FormField id="clientContactPerson" label="Contact Person" value={formData.clientContactPerson} onChange={handleChange} />
            <FormField id="clientEmail" label="Email" type="email" value={formData.clientEmail} onChange={handleChange} required />
            <FormField id="clientPhone" label="Phone (Optional)" type="tel" value={formData.clientPhone} onChange={handleChange} />
            <hr className="my-8 border-gray-300"/>
            <FormField sectionTitle="Agreement Overview" id="agreementDate" label="Date of Agreement" type="date" value={formData.agreementDate} onChange={handleChange} required />
            <FormField id="projectName" label="Project Name/Title" value={formData.projectName} onChange={handleChange} required />
          </>
        );
      case 2: // Scope of Services & Deliverables
        return (
          <>
            <FormField sectionTitle="Scope of Services" id="websiteDescription" label="Detailed Description of Website to be Provided" type="textarea" value={formData.websiteDescription} onChange={handleChange} rows={5} required />
            <FormField id="servicesIncluded" label="Services Included (List clearly)" type="textarea" value={formData.servicesIncluded} onChange={handleChange} rows={5} required />
            <FormField id="specificDeliverables" label="Specific Deliverables" type="textarea" value={formData.specificDeliverables} onChange={handleChange} rows={4} placeholder="e.g., Design mockups, Functional website, Source code..." required />
            <FormField sectionTitle="Timeline" id="projectStartDate" label="Project Start Date" type="date" value={formData.projectStartDate} onChange={handleChange} required />
            <FormField id="projectCompletionDate" label="Estimated Project Completion Date / Duration" value={formData.projectCompletionDate} onChange={handleChange} placeholder="e.g., YYYY-MM-DD or 3 months" required />
            <FormField id="milestones" label="Key Project Milestones & Deadlines (Optional)" type="textarea" value={formData.milestones} onChange={handleChange} rows={4} placeholder="Phase 1: Design - [Date]\nPhase 2: Development - [Date]\nPhase 3: Testing - [Date]\nPhase 4: Launch - [Date]"/>
          </>
        );
      case 3: // Payment Terms & Schedule
        return (
          <>
            <FormField sectionTitle="Payment Terms" id="totalProjectCost" label="Total Project Cost (or Hourly Rate / Retainer)" value={formData.totalProjectCost} onChange={handleChange} required placeholder="e.g., $5000 USD or $75/hour" />
            <FormField id="paymentSchedule" label="Payment Schedule / Milestones" type="textarea" value={formData.paymentSchedule} onChange={handleChange} rows={4} required placeholder="e.g., 50% upfront, 25% at milestone X, 25% on completion."/>
            <FormField id="latePaymentTerms" label="Late Payment Terms (Optional)" value={formData.latePaymentTerms} onChange={handleChange} placeholder="e.g., 1.5% monthly interest on overdue invoices."/>
            <FormField id="additionalExpenses" label="Handling of Additional Expenses (e.g., stock photos, plugins)" type="textarea" value={formData.additionalExpenses} onChange={handleChange} rows={3} placeholder="e.g., Client pre-approves all third-party costs."/>
          </>
        );
      case 4: // Intellectual Property, Confidentiality & Term
        return (
          <>
            <FormField sectionTitle="Intellectual Property" id="intellectualPropertyOwnership" label="Ownership of Work Product" type="textarea" value={formData.intellectualPropertyOwnership} onChange={handleChange} rows={4} required />
            <FormField id="confidentialityClause" label="Confidentiality Agreement" type="textarea" value={formData.confidentialityClause} onChange={handleChange} rows={4} required />
            <FormField id="agreementTerm" label="Term of Agreement" type="textarea" value={formData.agreementTerm} onChange={handleChange} rows={3} required placeholder="e.g., This agreement remains in effect until the completion of the project and any post-launch support period." />
          </>
        );
      case 5: // Termination, Dispute Resolution & Signatures
        return (
          <>
            <FormField sectionTitle="Termination" id="terminationConditions" label="Conditions for Termination" type="textarea" value={formData.terminationConditions} onChange={handleChange} rows={3} required />
            <FormField id="terminationNoticePeriod" label="Notice Period for Termination" value={formData.terminationNoticePeriod} onChange={handleChange} required placeholder="e.g., 30 days written notice" />
            <FormField id="governingLawAndJurisdiction" label="Governing Law & Jurisdiction" value={formData.governingLawAndJurisdiction} onChange={handleChange} required placeholder="e.g., State of [State], USA" />
            <FormField id="disputeResolutionMethod" label="Dispute Resolution Process" type="textarea" value={formData.disputeResolutionMethod} onChange={handleChange} rows={4} required placeholder="e.g., Mediation, then arbitration in [City, State]" />
            <FormField id="agreementEffectiveDate" label="Effective Date of Agreement" type="date" value={formData.agreementEffectiveDate} onChange={handleChange} required />
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> This is a legally binding agreement. Both parties should review all terms carefully before signing. Consider having a legal professional review this agreement.
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

  const renderLivePreview = (forDownload = false) => (
    <div ref={previewRef} className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-center text-primary !mb-2">WEBSITE SERVICES AGREEMENT</h2>
      <p className="text-center text-sm text-gray-600 mb-6">This Agreement is made effective as of {formData.agreementEffectiveDate || '[Effective Date]'}</p>
      
      <PreviewSectionTitle title="1. Parties" stepToEdit={1} />
      <p><strong>Service Provider:</strong><br/>
        {formData.serviceProviderCompanyName || '[Service Provider Company Name]'}<br/>
        {formData.serviceProviderAddress && <>{formData.serviceProviderAddress}<br/></>}
        {formData.serviceProviderContactPerson && <>Contact: {formData.serviceProviderContactPerson}<br/></>}
        {formData.serviceProviderEmail && <>Email: {formData.serviceProviderEmail}<br/></>}
        {formData.serviceProviderPhone && <>Phone: {formData.serviceProviderPhone}<br/></>}
      </p>
      
      <p className="mt-4"><strong>Client:</strong><br/>
        {formData.clientCompanyName || '[Client Company Name]'}<br/>
        {formData.clientAddress && <>{formData.clientAddress}<br/></>}
        {formData.clientContactPerson && <>Contact: {formData.clientContactPerson}<br/></>}
        {formData.clientEmail && <>Email: {formData.clientEmail}<br/></>}
        {formData.clientPhone && <>Phone: {formData.clientPhone}<br/></>}
      </p>
      
      <p className="mt-6"><strong>Project:</strong> {formData.projectName || '[Project Name]'}</p>
      
      <PreviewSectionTitle title="2. Scope of Services" stepToEdit={2} />
      <p><strong>Description:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.websiteDescription || '[Website Description]'}</span></p>
      <p className="mt-2"><strong>Services Included:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.servicesIncluded || '[Services Included]'}</span></p>
      <p className="mt-2"><strong>Deliverables:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.specificDeliverables || '[Specific Deliverables]'}</span></p>
      
      <p className="mt-2"><strong>Project Timeline:</strong><br/>
        Start Date: {formData.projectStartDate || '[Start Date]'}<br/>
        Estimated Completion: {formData.projectCompletionDate || '[Completion Date]'}
      </p>
      
      {formData.milestones && (
        <div className="mt-2">
          <p><strong>Key Milestones:</strong></p>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded">{formData.milestones}</pre>
        </div>
      )}
      
      <PreviewSectionTitle title="3. Payment Terms" stepToEdit={3} />
      <p><strong>Total Cost:</strong> {formData.totalProjectCost || '[Cost]'}</p>
      <p><strong>Payment Schedule:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.paymentSchedule || '[Schedule]'}</span></p>
      {formData.latePaymentTerms && <p><strong>Late Payments:</strong> {formData.latePaymentTerms}</p>}
      {formData.additionalExpenses && <p><strong>Additional Expenses:</strong> {formData.additionalExpenses}</p>}

      <PreviewSectionTitle title="4. Intellectual Property, Confidentiality & Term" stepToEdit={4} />
      <p><strong>Intellectual Property:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.intellectualPropertyOwnership || "[IP Terms]"}</span></p>
      <p><strong>Confidentiality:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.confidentialityClause || "[Confidentiality Terms]"}</span></p>
      <p><strong>Agreement Term:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.agreementTerm || "[Term]"}</span></p>

      <PreviewSectionTitle title="5. Termination, Disputes & Effective Date" stepToEdit={5} />
      <p><strong>Termination:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.terminationConditions || "[Termination Conditions]"}</span> (Notice: {formData.terminationNoticePeriod || "[Notice Period]"})</p>
      <p><strong>Governing Law:</strong> {formData.governingLawAndJurisdiction || "[Law & Jurisdiction]"}</p>
      <p><strong>Dispute Resolution:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.disputeResolutionMethod || "[Method]"}</span></p>
      <p><strong>Effective Date of Agreement:</strong> {formData.agreementEffectiveDate || "[Effective Date]"}</p>

      {forDownload ? (
        <SignatureBlock
          party1={formData.serviceProviderCompanyName}
          party2={formData.clientCompanyName}
          party1Role="Service Provider"
          party2Role="Client"
        />
      ) : (
        <p className="mt-6 text-center italic text-xs">This Agreement requires signatures from authorized representatives of both parties to be binding.</p>
      )}
    </div>
  );

  const progressSteps = [1, 2, 3, 4, 5];
  const progressLabels = ["Parties", "Scope", "Payment", "IP & Term", "Finalize"];
  const progressIcons = [<Users size={16} />, <Tv2 size={16} />, <DollarSign size={16} />, <Lock size={16} />, <FileSignature size={16} />];

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">Generate Website Services Agreement</h1>
      <p className="text-center text-textColor mb-8 max-w-2xl mx-auto">
        Define the terms for your website project. Fill the details below.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-10">
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

export default WebsiteServicesAgreementPage;
