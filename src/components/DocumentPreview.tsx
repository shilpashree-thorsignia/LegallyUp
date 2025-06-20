import React from 'react';
import { SignatureBlock, PoASignatureBlock } from './ui/SignatureBlock';

interface DocumentPreviewProps {
  data: any;
  typeKey: string;
  isThumbnail?: boolean;
  forDownload?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, typeKey, isThumbnail, forDownload }) => {
  const baseStyles: React.CSSProperties = {
    background: '#fff',
    color: '#222',
    fontFamily: 'serif',
    height: '100%',
  };

  const thumbnailStyles: React.CSSProperties = {
    ...baseStyles,
    padding: isThumbnail ? '24px' : '32px',
  };

  const fullStyles: React.CSSProperties = {
    ...baseStyles,
    padding: '32px',
    borderRadius: 12,
    maxWidth: 700,
    margin: '0 auto',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  };

  const wrapperStyle = isThumbnail ? thumbnailStyles : fullStyles;

  // NDA
  if (typeKey === 'nda') {
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>NDA Preview</h2>
        <p><strong>Effective Date:</strong> {data.effectiveDate || '[Effective Date]'}</p>
        <p><strong>Disclosing Party:</strong> {data.disclosingPartyName || '[Name]'} ({data.disclosingPartyEntityType || '[Type]'}), {data.disclosingPartyAddress || '[Address]'}{data.companyName && data.companyName !== data.disclosingPartyName ? ` (Company: ${data.companyName}, Email: ${data.contactEmail || '[Email]'})` : (data.contactEmail ? ` (Email: ${data.contactEmail})` : '')}</p>
        <p><strong>Receiving Party:</strong> {data.receivingPartyName || '[Name]'} ({data.receivingPartyEntityType || '[Type]'}), {data.receivingPartyAddress || '[Address]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Agreement Core</h3>
        <p><strong>Purpose of Disclosure:</strong> {data.purposeOfDisclosure || '[Purpose]'}</p>
        <p><strong>Duration of NDA:</strong> {data.durationNDA || '[Duration]'}</p>
        <p><strong>Governing Law:</strong> {data.governingLaw || '[Governing Law]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Confidentiality Terms</h3>
        <p><strong>Definition of Confidential Information:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.definitionConfidentialInfo || '[Definition]'}</span></p>
        <p><strong>Obligations of Receiving Party:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.obligationsReceivingParty || '[Obligations]'}</span></p>
        <p><strong>Exclusions from Confidentiality:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.exclusionsConfidentiality || '[Exclusions]'}</span></p>
        <p><strong>Legal Remedies & Breach:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.legalRemedies || '[Remedies]'}</span></p>
        
        {forDownload ? (
          <SignatureBlock 
            party1={data.disclosingPartyName} 
            party2={data.receivingPartyName}
            party1Role="Disclosing Party"
            party2Role="Receiving Party"
          />
        ) : (
          <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>--- Signature blocks will be included in the final downloaded document ---</p>
        )}
      </div>
    );
  }
  // Privacy Policy
  if (typeKey === 'privacyPolicy') {
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>Privacy Policy</h2>
        <p>This Privacy Policy describes how {data.companyName || '[Company Name]'} ("we", "us", or "our") collects, uses, and shares personal information of users of our website {data.websiteUrl || '[Website URL]'} (the "Service").</p>
        <p><strong>Effective Date:</strong> {data.policyDate || '[Date]'}</p>
        <p><strong>Contact:</strong> {data.contactEmail || '[Contact Email]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Information We Collect & How We Use It</h3>
        <p><strong>Types of Data Collected:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.dataTypesCollected || '[List data types]'}</span></p>
        <p><strong>Cookies & Tracking:</strong> We {data.usesCookies === 'yes' ? 'use' : (data.usesCookies === 'no' ? 'do not use' : '[use/do not use]')} cookies and similar technologies. {data.usesCookies === 'yes' && '(Refer to our Cookies Policy for details).'}</p>
        <p><strong>Sensitive Data:</strong> We {data.collectsSensitiveData === 'yes' ? 'may collect' : (data.collectsSensitiveData === 'no' ? 'do not knowingly collect' : '[may collect/do not collect]')} sensitive personal data.</p>
        <p><strong>Purpose of Use:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.purposeOfUsage || '[State purposes]'}</span></p>
        <p><strong>Marketing Communications:</strong> We {data.sendsMarketingEmails === 'yes' ? 'may send you' : (data.sendsMarketingEmails === 'no' ? 'will not send you' : '[may send/will not send]')} marketing emails. You can opt-out at any time.</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Data Sharing, Security & Your Rights</h3>
        <p><strong>Third-Party Sharing:</strong> We {data.sharesWithThirdParties === 'yes' ? 'may share your information with third-party service providers' : (data.sharesWithThirdParties === 'no' ? 'do not share your personal data with third parties for their own marketing purposes without your consent' : '[state sharing practices]')}{data.sharesWithThirdParties === 'yes' && ` Key services include: ${data.thirdPartyServicesList || '[List services]'}.`}</p>
        <p><strong>Data Security:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.securityMeasures || '[Describe security measures]'}</span></p>
        <p><strong>Your Rights:</strong> You typically have the right to Access ({data.userRightsAccess?.toUpperCase() || 'N/A'}), Delete ({data.userRightsDelete?.toUpperCase() || 'N/A'}), and Update ({data.userRightsUpdate?.toUpperCase() || 'N/A'}) your personal information. Please contact us to exercise these rights.</p>
        <p><strong>Policy Updates:</strong> <span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.policyUpdateNotification || '[How users are notified]'}</span></p>
        <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>This is a preview. The final document will be formatted professionally and may include additional legal clauses.</p>
      </div>
    );
  }
  // Refund Policy
  if (typeKey === 'refundPolicy') {
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>Refund Policy</h2>
        <p style={{ textAlign: 'right', fontSize: 14, color: '#64748b' }}>Effective Date: {data.policyEffectiveDate || '[Date]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>1. Introduction</h3>
        <p>This Refund Policy ("Policy") describes the policies and procedures of {data.companyName || '[Your Company Name]'} ("we," "our," or "us") regarding refunds for purchases made through our website: {data.websiteUrl || '[Your Website URL]'}</p>
        <p style={{ whiteSpace: 'pre-line' }}>{data.policyScope || '[Policy Scope]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>2. Refund Eligibility & Process</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{data.refundEligibilityConditions || '[Refund Eligibility Conditions]'}</p>
        <p style={{ fontWeight: 600, marginTop: 8 }}>How to Request a Refund:</p>
        <p style={{ whiteSpace: 'pre-line' }}>{data.howToRequestRefund || '[How to Request a Refund]'}</p>
        <p style={{ marginTop: 8 }}><strong>Processing Time:</strong> {data.refundProcessingTimeframe || '[Refund Processing Timeframe]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>3. Non-Refundable Items & Exchanges</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{data.nonRefundableItems || '[Non-Refundable Items]'}</p>
        {data.hasExchangePolicy === 'yes' && (
          <>
            <p style={{ fontWeight: 600, marginTop: 8 }}>Exchange Policy:</p>
            <p style={{ whiteSpace: 'pre-line' }}>{data.exchangePolicyDetails || '[Exchange Policy Details]'}</p>
          </>
        )}
        <p style={{ fontWeight: 600, marginTop: 8 }}>Return Shipping:</p>
        <p style={{ whiteSpace: 'pre-line' }}>
          {data.returnShippingResponsibility === 'customer'
            ? 'You will be responsible for paying for your own shipping costs for returning your item.'
            : data.returnShippingResponsibility === 'company'
              ? 'We will cover the cost of return shipping.'
              : 'Return shipping responsibility will be determined on a case-by-case basis.'
          }
        </p>
        <p style={{ whiteSpace: 'pre-line' }}>{data.returnShippingInstructions || '[Return Shipping Instructions]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>4. Contact Us</h3>
        <p>If you have any questions about this Refund Policy, please contact us at: {data.contactEmail || '[Your Contact Email]'}</p>
        <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>This is a preview. The final document will be formatted professionally.</p>
      </div>
    );
  }
  // EULA
  if (typeKey === 'eula') {
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>End User License Agreement (EULA) Preview</h2>
        <p style={{ fontSize: 14, textAlign: 'center' }}>For: {data.productName || '[Product Name]'} {data.productVersion && `(v${data.productVersion})`}</p>
        <p style={{ fontSize: 14, textAlign: 'center' }}>Effective Date: {data.eulaEffectiveDate || '[Date]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>1. Parties & Product</h3>
        <p>This EULA is between you (the "Licensee") and {data.licensorCompanyName || '[Licensor Company]'}{data.licensorAddress ? `, located at ${data.licensorAddress}` : ''} ("Licensor").</p>
        <p>This EULA governs your use of the software product: <strong>{data.productName || '[Product Name]'}</strong> for {data.platform || '[Platform]'}</p>
        <p>Description: {data.productDescription || '[Product Description]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>2. License Grant</h3>
        <p>Licensor grants Licensee a {data.licenseType ? data.licenseType.toLowerCase() : '[license type]'} for a duration of {data.licenseDuration || '[duration]'} to use the Software for: {data.permittedUses || '[permitted uses]'}{data.numberOfInstallationsOrUsers && `. This license permits use on/by ${data.numberOfInstallationsOrUsers}.`}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>3. Usage Restrictions</h3>
        <p><span style={{ whiteSpace: 'pre-line', display: 'block' }}>{data.usageRestrictions || '[Usage Restrictions]'}</span></p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>4. Support, Updates & IP</h3>
        <p><strong>Support:</strong> {data.supportTerms || '[Support Terms]'}</p>
        <p><strong>Updates:</strong> {data.updatePolicy || '[Update Policy]'}</p>
        <p><strong>Intellectual Property:</strong> {data.intellectualPropertyStatement || '[IP Statement]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>5. Termination, Liability & Warranty</h3>
        <p><strong>Termination:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.terminationConditions || '[Termination Conditions]'}</span></p>
        <p><strong>Limitation of Liability:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.limitationOfLiability || '[Limitation of Liability]'}</span></p>
        <p><strong>Warranty Disclaimer:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.warrantyDisclaimer || '[Warranty Disclaimer]'}</span></p>
        <p><strong>Governing Law:</strong> {data.governingLawAndJurisdiction || '[Governing Law]'}</p>
        <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>By installing, copying, or otherwise using the Software, Licensee agrees to be bound by the terms of this EULA.</p>
      </div>
    );
  }
  // Website Services Agreement
  if (typeKey === 'websiteServicesAgreement') {
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>WEBSITE SERVICES AGREEMENT</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 }}>This Agreement is made effective as of {data.agreementEffectiveDate || '[Effective Date]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>1. Parties</h3>
        <p><strong>Service Provider:</strong><br/>
          {data.serviceProviderCompanyName || '[Service Provider Company Name]'}<br/>
          {data.serviceProviderAddress && <>{data.serviceProviderAddress}<br/></>}
          {data.serviceProviderContactPerson && <>Contact: {data.serviceProviderContactPerson}<br/></>}
          {data.serviceProviderEmail && <>Email: {data.serviceProviderEmail}<br/></>}
          {data.serviceProviderPhone && <>Phone: {data.serviceProviderPhone}<br/></>}
        </p>
        <p style={{ marginTop: 8 }}><strong>Client:</strong><br/>
          {data.clientCompanyName || '[Client Company Name]'}<br/>
          {data.clientAddress && <>{data.clientAddress}<br/></>}
          {data.clientContactPerson && <>Contact: {data.clientContactPerson}<br/></>}
          {data.clientEmail && <>Email: {data.clientEmail}<br/></>}
          {data.clientPhone && <>Phone: {data.clientPhone}<br/></>}
        </p>
        <p style={{ marginTop: 16 }}><strong>Project:</strong> {data.projectName || '[Project Name]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>2. Scope of Services</h3>
        <p><strong>Description:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.websiteDescription || '[Website Description]'}</span></p>
        <p style={{ marginTop: 8 }}><strong>Services Included:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.servicesIncluded || '[Services Included]'}</span></p>
        <p style={{ marginTop: 8 }}><strong>Deliverables:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.specificDeliverables || '[Specific Deliverables]'}</span></p>
        <p style={{ marginTop: 8 }}><strong>Project Timeline:</strong><br/>Start Date: {data.projectStartDate || '[Start Date]'}<br/>Estimated Completion: {data.projectCompletionDate || '[Completion Date]'}</p>
        {data.milestones && (
          <div style={{ marginTop: 8 }}>
            <p><strong>Key Milestones:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, background: '#f1f5f9', padding: 8, borderRadius: 6 }}>{data.milestones}</pre>
          </div>
        )}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>3. Payment Terms</h3>
        <p><strong>Total Cost:</strong> {data.totalProjectCost || '[Cost]'}</p>
        <p><strong>Payment Schedule:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.paymentSchedule || '[Schedule]'}</span></p>
        {data.latePaymentTerms && <p><strong>Late Payments:</strong> {data.latePaymentTerms}</p>}
        {data.additionalExpenses && <p><strong>Additional Expenses:</strong> {data.additionalExpenses}</p>}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>4. Intellectual Property, Confidentiality & Term</h3>
        <p><strong>Intellectual Property:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.intellectualPropertyOwnership || '[IP Terms]'}</span></p>
        <p><strong>Confidentiality:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.confidentialityClause || '[Confidentiality Terms]'}</span></p>
        <p><strong>Agreement Term:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.agreementTerm || '[Term]'}</span></p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>5. Termination, Disputes & Effective Date</h3>
        <p><strong>Termination:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.terminationConditions || '[Termination Conditions]'}</span> (Notice: {data.terminationNoticePeriod || '[Notice Period]'})</p>
        <p><strong>Governing Law:</strong> {data.governingLawAndJurisdiction || '[Law & Jurisdiction]'}</p>
        <p><strong>Dispute Resolution:</strong><br/><span style={{ whiteSpace: 'pre-line', display: 'block', paddingLeft: 8 }}>{data.disputeResolutionMethod || '[Method]'}</span></p>
        <p><strong>Effective Date of Agreement:</strong> {data.agreementEffectiveDate || '[Effective Date]'}</p>
        
        {forDownload ? (
          <SignatureBlock
            party1={data.serviceProviderCompanyName}
            party2={data.clientCompanyName}
            party1Role="Service Provider"
            party2Role="Client"
          />
        ) : (
          <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>This Agreement requires signatures from authorized representatives of both parties to be binding.</p>
        )}
      </div>
    );
  }
  // Cookies Policy
  if (typeKey === 'cookiesPolicy') {
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>Cookies Policy</h2>
        <p>This Cookies Policy explains how {data.companyName || '[Company Name]'} ("we", "us", or "our") uses cookies and similar technologies on our website {data.websiteUrl || '[Website URL]'}</p>
        <p><strong>Last Updated:</strong> {data.lastUpdated || '[Date]'}</p>
        <p><strong>Contact for Questions:</strong> {data.contactEmail || '[Contact Email]'}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Cookie Usage Statement</h3>
        <p>Our website {data.usesCookies === 'yes' ? 'uses' : (data.usesCookies === 'no' ? 'does not use' : '[uses/does not use]')} cookies.</p>
        {data.usesCookies === 'yes' && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Types of Cookies & Details</h3>
            <p>We use the following types of cookies:</p>
            <p style={{ whiteSpace: 'pre-line' }}>{data.typesOfCookiesUsed || '[List types of cookies]'}</p>
            <p>Specific cookies we use include:</p>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, background: '#f1f5f9', padding: 8, borderRadius: 6 }}>{data.cookieDetailsList || '[List specific cookies]'}</pre>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Managing Cookies</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{data.cookiePolicyManagement || '[How users can manage cookies]'}</p>
          </>
        )}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Contact & Other Policies</h3>
        <p>For more information about how we handle your personal data, please see our Privacy Policy: {data.linkToPrivacyPolicy || '[Privacy Policy Link]'}</p>
        <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>This is a preview. The final document will be formatted professionally.</p>
      </div>
    );
  }
  // Power of Attorney
  if (typeKey === 'powerOfAttorney') {
    // Render a styled Power of Attorney preview
    return (
      <div style={wrapperStyle}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>POWER OF ATTORNEY</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          {data.poaType === 'general' && 'GENERAL POWER OF ATTORNEY'}
          {data.poaType === 'special' && 'SPECIAL/LIMITED POWER OF ATTORNEY'}
          {data.poaType === 'durable' && 'DURABLE POWER OF ATTORNEY'}
          {data.poaType === 'medical' && 'MEDICAL POWER OF ATTORNEY (HEALTHCARE PROXY)'}
          {!data.poaType && 'POWER OF ATTORNEY'}
        </p>
        <p style={{ textAlign: 'justify', marginBottom: 16 }}>
          KNOW ALL MEN BY THESE PRESENTS, that I, <span style={{ fontWeight: 600 }}>{data.principalFullName || '[Principal\'s Full Name]'}</span>,
          residing at <span style={{ fontWeight: 500 }}>{data.principalAddress || '[Principal\'s Address]'}</span>,
          hereby make, constitute, and appoint <span style={{ fontWeight: 600 }}>{data.agentFullName || '[Agent\'s Full Name]'}</span>,
          residing at <span style={{ fontWeight: 500 }}>{data.agentAddress || '[Agent\'s Address]'}</span>,
          as my true and lawful attorney-in-fact ("Agent") for me and in my name, place, and stead, and for my use and benefit.
        </p>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>1. Principal & Agent Information</h3>
        <p><strong>Principal:</strong> {data.principalFullName || '[Principal\'s Full Name]'}</p>
        <p><strong>Address:</strong> {data.principalAddress || '[Principal\'s Address]'}</p>
        {data.principalDob && <p><strong>Date of Birth:</strong> {data.principalDob}</p>}
        {data.principalPan && <p><strong>PAN/ID:</strong> {data.principalPan}</p>}
        <p style={{ marginTop: 8 }}><strong>Agent:</strong> {data.agentFullName || '[Agent\'s Full Name]'}</p>
        <p><strong>Address:</strong> {data.agentAddress || '[Agent\'s Address]'}</p>
        {data.agentPan && <p><strong>PAN/ID:</strong> {data.agentPan}</p>}
        {data.agentRelationshipToPrincipal && <p><strong>Relationship to Principal:</strong> {data.agentRelationshipToPrincipal}</p>}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>2. Scope of Authority</h3>
        <p><strong>Type of Power of Attorney:</strong> {data.poaType ? data.poaType.charAt(0).toUpperCase() + data.poaType.slice(1) : 'Not specified'}</p>
        <p style={{ marginTop: 8 }}><strong>Powers Granted:</strong></p>
        <div style={{ background: '#f1f5f9', padding: 12, borderRadius: 6, fontSize: 14, marginBottom: 8 }}>
          {data.specificPowersGranted || '[Specific powers granted to the Agent will appear here]'}
        </div>
        {data.limitationsOnPowers && (
          <div style={{ marginBottom: 8 }}>
            <p><strong>Limitations:</strong></p>
            <div style={{ background: '#f1f5f9', padding: 12, borderRadius: 6, fontSize: 14 }}>{data.limitationsOnPowers}</div>
          </div>
        )}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>3. Duration & Governing Law</h3>
        <p><strong>Effective Date:</strong> {data.poaEffectiveDate || '[Effective Date]'}</p>
        <p><strong>Duration:</strong> {data.durationOfPoa || '[Duration of POA]'}</p>
        <p><strong>Governing Law:</strong> {data.governingLawAndJurisdiction || '[Governing Law]'}</p>
        {(data.witness1FullName || data.witness2FullName) && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>4. Witnesses</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              {data.witness1FullName && (
                <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
                  <p><strong>Witness 1:</strong> {data.witness1FullName}</p>
                  {data.witness1Address && <p style={{ fontSize: 14 }}>{data.witness1Address}</p>}
                </div>
              )}
              {data.witness2FullName && (
                <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
                  <p><strong>Witness 2:</strong> {data.witness2FullName}</p>
                  {data.witness2Address && <p style={{ fontSize: 14 }}>{data.witness2Address}</p>}
                </div>
              )}
            </div>
          </>
        )}
        
        {forDownload ? (
          <PoASignatureBlock
            principal={data.principalFullName}
            agent={data.agentFullName}
            witness1={data.witness1FullName}
            witness2={data.witness2FullName}
            effectiveDate={data.poaEffectiveDate}
          />
        ) : (
          <p style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 12, color: '#64748b' }}>Signature blocks will be included in the final document.</p>
        )}
      </div>
    );
  }
  return (
    <div style={wrapperStyle}>
      <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#3b82f6', marginBottom: 8 }}>{data.title || 'Document Preview'}</h2>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {typeof data.content === 'string' ? data.content : JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
};

export default DocumentPreview; 