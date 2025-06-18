import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../../components/forms/FormField'; // Adjust path
import { useFormValidation } from '../../hooks/useFormValidation';
import { generateDocx } from '../../utils/docxGenerator';
import { ArrowLeft, ArrowRight, CheckCircle, Download, Save, Edit3 } from 'lucide-react'; // Relevant icons
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { API_BASE } from '../../lib/apiBase';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom/client';

interface EulaData {
  // Step 1: Parties & Product Information
  licensorCompanyName: string;
  licensorAddress: string;
  licensorEmail: string;
  licensorPhone?: string;
  licensorWebsiteUrl?: string;

  productName: string;
  productVersion?: string; // Optional
  platform: string;        // e.g., Desktop (Windows/Mac/Linux), Mobile (iOS/Android), Web Application
  productDescription: string;

  // Step 2: License Grant & Scope
  licenseType: string;     // e.g., Perpetual, Subscription, Trial, Freeware, Open Source (specify license like MIT, GPL)
  licenseDuration: string; // e.g., Perpetual, 1 Year, 30 Days (for trial)
  permittedUses: string;   // e.g., Personal non-commercial use, Internal business operations
  numberOfInstallationsOrUsers?: string; // e.g., Single user, Up to 5 devices

  // Step 3: Usage Restrictions & Prohibitions
  usageRestrictions: string; // e.g., No reverse engineering, decompiling, modifying, sublicensing, renting, etc.

  // Step 4: Support, Updates & Ownership
  supportTerms: string;      // e.g., Email support during business hours, Community forum only, Paid premium support
  updatePolicy: string;      // e.g., Updates provided free for version X.X, Subscription includes updates
  intellectualPropertyStatement: string; // Reinforce Licensor's ownership of the software

  // Step 5: Termination, Liability, Warranty & Final Clauses
  terminationConditions: string; // e.g., Breach of EULA, non-payment for subscription
  limitationOfLiability: string; // Standard limitation of liability clause
  warrantyDisclaimer: string;    // "AS IS" clause, no warranties or limited warranty
  governingLawAndJurisdiction: string;
  eulaEffectiveDate: string; // When the EULA terms are effective
}

const initialData: EulaData = {
  licensorCompanyName: '', licensorAddress: '', licensorEmail: '', licensorPhone: '', licensorWebsiteUrl: '',
  productName: '', productVersion: '', platform: 'Desktop Application', productDescription: '',
  licenseType: 'Perpetual License', licenseDuration: 'Perpetual',
  permittedUses: 'Personal, non-commercial use on a single device.', numberOfInstallationsOrUsers: '1',
  usageRestrictions: 'The Licensee shall not: (a) reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code of the Software; (b) modify, adapt, translate, or create derivative works based on the Software; (c) rent, lease, sublicense, assign, or transfer rights to the Software; (d) remove any proprietary notices or labels on the Software.',
  supportTerms: 'Basic email support is provided for 90 days from the date of purchase. Access to online documentation and community forums is available.',
  updatePolicy: 'Minor updates (e.g., bug fixes) for the current major version will be provided free of charge. Major version upgrades may require a separate purchase or subscription.',
  intellectualPropertyStatement: 'The Software is licensed, not sold. The Licensor retains all right, title, and interest in and to the Software, including all intellectual property rights therein.',
  terminationConditions: 'This EULA is effective until terminated. The Licensor may terminate this EULA immediately if the Licensee breaches any of its terms. Upon termination, the Licensee must cease all use of the Software and destroy all copies.',
  limitationOfLiability: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE LICENSOR BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR ANY OTHER PECUNIARY LOSS) ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF THE LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.',
  warrantyDisclaimer: 'THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE LICENSOR BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
  governingLawAndJurisdiction: 'e.g., The laws of the State of [YourState], [YourCountry]',
  eulaEffectiveDate: new Date().toISOString().split('T')[0],
};

const stepVariants = { /* ... (same as before) ... */ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }, exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }};

const EulaPage: React.FC = () => {
  const [formData, setFormData] = useState<EulaData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const totalFormSteps = 5;

  const {
    currentStep,
    errors,
    nextStep,
    prevStep,
    jumpToStep,
    validateBeforeSubmit,
    setErrors
  } = useFormValidation('eula', formData, totalFormSteps);

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

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
    if (!user) {
      alert('You must be logged in to save documents.');
      return;
    }
    setIsSaving(true);
    const title = `EULA - ${formData.licensorCompanyName || 'Untitled'}`;
    const content = JSON.stringify(formData, null, 2);
    try {
      const res = await fetch(`${API_BASE}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, title, content }),
      });
      if (res.ok) {
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert('Failed to save: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to save: ' + err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    // First validate all steps
    const isValid = validateBeforeSubmit();
    if (!isValid) return;
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
          filename: `EULA-${formData.productName || 'Software'}.pdf`,
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
      alert('Failed to generate PDF.');
    }
  };

  const platformOptions = [
    { value: "Desktop Application (Windows)", label: "Desktop Application (Windows)"},
    { value: "Desktop Application (macOS)", label: "Desktop Application (macOS)"},
    { value: "Desktop Application (Linux)", label: "Desktop Application (Linux)"},
    { value: "Mobile Application (iOS)", label: "Mobile Application (iOS)"},
    { value: "Mobile Application (Android)", label: "Mobile Application (Android)"},
    { value: "Web Application / SaaS", label: "Web Application / SaaS"},
    { value: "Software Library / SDK", label: "Software Library / SDK"},
    { value: "Other", label: "Other (Specify in description)"},
  ];

  const licenseTypeOptions = [
    {value: "Perpetual License", label: "Perpetual License (One-time purchase)"},
    {value: "Subscription License", label: "Subscription License (Recurring payment)"},
    {value: "Trial License", label: "Trial License (Time-limited evaluation)"},
    {value: "Freeware License", label: "Freeware License (Free to use, no payment)"},
    {value: "Open Source License (e.g., MIT)", label: "Open Source License (Specify type, e.g., MIT, GPL)"},
    {value: "Custom License", label: "Custom License (Describe below)"},
  ];

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const renderStepFormContent = () => {
    const getError = (fieldName: string) => {
      return errors ? errors[fieldName as keyof typeof errors] || '' : '';
    };

    switch (currentStep) {
      case 1: // Parties & Product Information
        return (
          <>
            <FormField 
              sectionTitle="Licensor (Software Provider)" 
              id="licensorCompanyName" 
              label="Company/Developer Name" 
              value={formData.licensorCompanyName} 
              onChange={handleChange} 
              required 
              error={getError('licensorCompanyName')}
            />
            <FormField 
              id="licensorAddress" 
              label="Address" 
              type="textarea" 
              value={formData.licensorAddress} 
              onChange={handleChange} 
              error={getError('licensorAddress')}
            />
            <FormField 
              id="licensorEmail" 
              label="Contact Email for Licensing" 
              type="email" 
              value={formData.licensorEmail} 
              onChange={handleChange} 
              required 
              error={getError('licensorEmail')}
            />
            <FormField 
              id="licensorPhone" 
              label="Contact Phone (Optional)" 
              type="tel" 
              value={formData.licensorPhone} 
              onChange={handleChange} 
            />
            <FormField 
              id="licensorWebsiteUrl" 
              label="Website URL (Optional)" 
              type="url" 
              value={formData.licensorWebsiteUrl} 
              onChange={handleChange} 
            />

            <FormField 
              sectionTitle="Product Information" 
              id="productName" 
              label="Software/Product Name" 
              value={formData.productName} 
              onChange={handleChange} 
              required 
              error={getError('productName')}
            />
            <FormField 
              id="productVersion" 
              label="Version (Optional)" 
              value={formData.productVersion} 
              onChange={handleChange} 
            />
            <FormField 
              id="platform" 
              label="Platform/Environment" 
              type="select" 
              value={formData.platform} 
              onChange={handleChange} 
              options={platformOptions}
              required 
              error={getError('platform')}
            />
            <FormField 
              id="productDescription" 
              label="Product Description" 
              type="textarea" 
              value={formData.productDescription} 
              onChange={handleChange} 
              rows={4} 
              required 
              error={getError('productDescription')}
            />
          </>
        );
      case 2: // License Grant & Scope
        return (
          <>
            <FormField 
              sectionTitle="License Grant" 
              id="licenseType" 
              label="Type of License Granted" 
              type="select" 
              options={licenseTypeOptions} 
              value={formData.licenseType} 
              onChange={handleChange} 
              required 
              error={getError('licenseType')}
            />
            <FormField 
              id="licenseDuration" 
              label="Duration of License" 
              value={formData.licenseDuration} 
              onChange={handleChange} 
              required 
              error={getError('licenseDuration')}
            />
            <FormField 
              id="permittedUses" 
              label="Permitted Uses of the Software" 
              type="textarea" 
              value={formData.permittedUses} 
              onChange={handleChange} 
              rows={4} 
              required 
              error={getError('permittedUses')}
            />
            <FormField 
              id="numberOfInstallationsOrUsers" 
              label="Number of Installations / Users Allowed (Optional)" 
              value={formData.numberOfInstallationsOrUsers} 
              onChange={handleChange} 
            />
            <FormField id="licenseDuration" label="Duration of License" value={formData.licenseDuration} onChange={handleChange} required placeholder="e.g., Perpetual, 1 Year, 30 Days"/>
            <FormField id="permittedUses" label="Permitted Uses of the Software" type="textarea" value={formData.permittedUses} onChange={handleChange} rows={4} required placeholder="e.g., Personal use, internal business operations only."/>
            <FormField id="numberOfInstallationsOrUsers" label="Number of Installations / Users Allowed (Optional)" value={formData.numberOfInstallationsOrUsers} onChange={handleChange} placeholder="e.g., 1 device, 5 users"/>
          </>
        );
      case 3: // Usage Restrictions & Prohibitions
        return (
          <>
            <FormField sectionTitle="Usage Restrictions & Prohibitions" id="usageRestrictions" label="What the User CANNOT do with the Software" type="textarea" value={formData.usageRestrictions} onChange={handleChange} rows={8} required placeholder="List all prohibited actions clearly." />
          </>
        );
      case 4: // Support, Updates & Ownership
        return (
          <>
            <FormField sectionTitle="Support & Updates" id="supportTerms" label="Support Terms" type="textarea" value={formData.supportTerms} onChange={handleChange} rows={4} placeholder="e.g., Email support, documentation only, paid support tiers."/>
            <FormField id="updatePolicy" label="Software Update Policy" type="textarea" value={formData.updatePolicy} onChange={handleChange} rows={4} placeholder="e.g., Free updates for current version, major upgrades require purchase."/>
            <FormField sectionTitle="Intellectual Property" id="intellectualPropertyStatement" label="Intellectual Property Statement" type="textarea" value={formData.intellectualPropertyStatement} onChange={handleChange} rows={3} required placeholder="e.g., Licensor retains all IP rights. Software is licensed, not sold."/>
          </>
        );
      case 5: // Termination, Liability, Warranty & Final Clauses
        return (
          <>
            <FormField sectionTitle="Termination" id="terminationConditions" label="Conditions for Termination of License" type="textarea" value={formData.terminationConditions} onChange={handleChange} rows={4} required />
            <FormField sectionTitle="Liability & Warranty" id="limitationOfLiability" label="Limitation of Liability Clause" type="textarea" value={formData.limitationOfLiability} onChange={handleChange} rows={5} required />
            <FormField id="warrantyDisclaimer" label="Warranty Disclaimer (e.g., AS IS Clause)" type="textarea" value={formData.warrantyDisclaimer} onChange={handleChange} rows={5} required />
            <FormField sectionTitle="Final Clauses" id="governingLawAndJurisdiction" label="Governing Law & Jurisdiction" value={formData.governingLawAndJurisdiction} onChange={handleChange} required />
            <FormField id="eulaEffectiveDate" label="EULA Effective Date" type="date" value={formData.eulaEffectiveDate} onChange={handleChange} required />
            <p className="text-sm text-textColor/80 mt-4 italic">
              The End User typically agrees to these terms by installing, copying, or using the software.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const PreviewSectionTitle: React.FC<{ title: string; stepToEdit: number }> = ({ title, stepToEdit }) => (
    <div className="flex justify-between items-center !mt-4 !mb-1 group"> <h3 className="!text-base !font-semibold">{title}</h3> <button onClick={() => jumpToStep(stepToEdit)} className="text-accent opacity-0 group-hover:opacity-100 hover:text-primary text-xs font-medium p-1 rounded hover:bg-accent/10 transition-all duration-200 flex items-center gap-1" title={`Edit ${title}`}> <Edit3 size={14} /> Edit </button> </div>
  );

  const renderLivePreview = () => (
    <div ref={previewRef} className="prose prose-sm max-w-none p-6 border border-gray-300 rounded-lg bg-white shadow-sm h-full overflow-y-auto">
        <h2 className="text-xl font-semibold text-center text-primary !mb-6">End User License Agreement (EULA) Preview</h2>
        <p className="text-xs text-center">For: {formData.productName || "[Product Name]"} {formData.productVersion && `(v${formData.productVersion})`}</p>
        <p className="text-xs text-center">Effective Date: {formData.eulaEffectiveDate || "[Date]"}</p>

        <PreviewSectionTitle title="1. Parties & Product" stepToEdit={1} />
        <p>This EULA is between you (the "Licensee") and {formData.licensorCompanyName || "[Licensor Company]"}{formData.licensorAddress ? `, located at ${formData.licensorAddress}` : ''} ("Licensor").</p>
        <p>This EULA governs your use of the software product: <strong>{formData.productName || "[Product Name]"}</strong> for {formData.platform || "[Platform]"}.</p>
        <p>Description: {formData.productDescription || "[Product Description]"}</p>

        <PreviewSectionTitle title="2. License Grant" stepToEdit={2} />
        <p>Licensor grants Licensee a {formData.licenseType ? formData.licenseType.toLowerCase() : "[license type]"} for a duration of {formData.licenseDuration || "[duration]"} to use the Software for: {formData.permittedUses || "[permitted uses]"}.
        {formData.numberOfInstallationsOrUsers && ` This license permits use on/by ${formData.numberOfInstallationsOrUsers}.`}</p>

        <PreviewSectionTitle title="3. Usage Restrictions" stepToEdit={3} />
        <p><span className="whitespace-pre-line block">{formData.usageRestrictions || "[Usage Restrictions]"}</span></p>

        <PreviewSectionTitle title="4. Support, Updates & IP" stepToEdit={4} />
        <p><strong>Support:</strong> {formData.supportTerms || "[Support Terms]"}</p>
        <p><strong>Updates:</strong> {formData.updatePolicy || "[Update Policy]"}</p>
        <p><strong>Intellectual Property:</strong> {formData.intellectualPropertyStatement || "[IP Statement]"}</p>

        <PreviewSectionTitle title="5. Termination, Liability & Warranty" stepToEdit={5} />
        <p><strong>Termination:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.terminationConditions || "[Termination Conditions]"}</span></p>
        <p><strong>Limitation of Liability:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.limitationOfLiability || "[Limitation of Liability]"}</span></p>
        <p><strong>Warranty Disclaimer:</strong><br/><span className="whitespace-pre-line block pl-2">{formData.warrantyDisclaimer || "[Warranty Disclaimer]"}</span></p>
        <p><strong>Governing Law:</strong> {formData.governingLawAndJurisdiction || "[Governing Law]"}</p>

        <p className="mt-6 text-center italic text-xs">By installing, copying, or otherwise using the Software, Licensee agrees to be bound by the terms of this EULA.</p>
    </div>
  );

  const progressSteps = [1, 2, 3, 4, 5];
  const progressLabels = ["Product", "License", "Restrictions", "Support & IP", "Legal"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">Generate End User License Agreement (EULA)</h1>
      <p className="text-center text-textColor mb-8 max-w-2xl mx-auto">
        Define the terms for use of your software. Fill the details below.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl mx-auto mb-10">
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

export default EulaPage;