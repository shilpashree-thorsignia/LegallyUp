import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to create a professional, legal-style HTML template for PDF export
export function renderLegalPdfTemplate({ title, content }: { title: string, content: string }) {
  // This function returns a string of HTML styled for legal documents
  return `
    <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #111; background: #fff; padding: 48px; margin: 0; width: 794px; min-height: 1123px; box-sizing: border-box;">
      <h1 style="text-align: center; font-size: 20pt; font-weight: bold; margin-bottom: 32px;">${title}</h1>
      <div style="white-space: pre-wrap; line-height: 1.7;">${content}</div>
    </div>
  `;
}

// Render legal document as HTML (not JSON) for PDF export
export function renderLegalHtmlFromData(documentTypeKey: string, data: any): string {
  if (documentTypeKey === 'powerOfAttorney') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">POWER OF ATTORNEY</h1>
      <p style="margin-top:24px;"><b>Principal Name:</b> ${data.principalFullName || ''}</p>
      <p><b>Principal Address:</b> ${data.principalAddress || ''}</p>
      <p><b>Principal PAN/ID:</b> ${data.principalPan || ''}</p>
      <p><b>Principal Date of Birth:</b> ${data.principalDob || ''}</p>
      <p><b>Agent Name:</b> ${data.agentFullName || ''}</p>
      <p><b>Agent Address:</b> ${data.agentAddress || ''}</p>
      <p><b>Agent PAN/ID:</b> ${data.agentPan || ''}</p>
      <p><b>Relationship to Principal:</b> ${data.agentRelationshipToPrincipal || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Scope of Authority Granted</h2>
      <p>${data.specificPowersGranted || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Limitations on Powers</h2>
      <p>${data.limitationsOnPowers || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Duration and Revocation</h2>
      <p>${data.durationOfPoa || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Governing Law and Jurisdiction</h2>
      <p>${data.governingLawAndJurisdiction || ''}</p>
      <div style="margin-top:48px;">
        <p>_____________________________<br/>Principal's Signature</p>
        <p>_____________________________<br/>Agent's Signature</p>
      </div>
    `;
  }
  if (documentTypeKey === 'nda') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">NON-DISCLOSURE AGREEMENT</h1>
      <p><b>Effective Date:</b> ${data.effectiveDate || ''}</p>
      <p><b>Disclosing Party:</b> ${data.disclosingPartyName || ''}</p>
      <p><b>Receiving Party:</b> ${data.receivingPartyName || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Confidential Information</h2>
      <p>${data.confidentialInformation || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Obligations</h2>
      <p>${data.obligations || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Term</h2>
      <p>${data.term || ''}</p>
      <div style="margin-top:48px;">
        <p>_____________________________<br/>Disclosing Party Signature</p>
        <p>_____________________________<br/>Receiving Party Signature</p>
      </div>
    `;
  }
  if (documentTypeKey === 'privacyPolicy') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">PRIVACY POLICY</h1>
      <p><b>Company Name:</b> ${data.companyName || ''}</p>
      <p><b>Effective Date:</b> ${data.effectiveDate || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Introduction</h2>
      <p>${data.introductionText || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Information Collected</h2>
      <p>${data.informationCollected || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Use of Information</h2>
      <p>${data.useOfInformation || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Data Security</h2>
      <p>${data.dataSecurity || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Contact</h2>
      <p>${data.contactEmail || ''}</p>
    `;
  }
  if (documentTypeKey === 'refundPolicy') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">REFUND POLICY</h1>
      <p><b>Company Name:</b> ${data.companyName || ''}</p>
      <p><b>Effective Date:</b> ${data.effectiveDate || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Refund Conditions</h2>
      <p>${data.refundConditions || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Process</h2>
      <p>${data.refundProcess || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Contact</h2>
      <p>${data.contactEmail || ''}</p>
    `;
  }
  if (documentTypeKey === 'cookiesPolicy') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">COOKIES POLICY</h1>
      <p><b>Company Name:</b> ${data.companyName || ''}</p>
      <p><b>Effective Date:</b> ${data.effectiveDate || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">What Are Cookies?</h2>
      <p>${data.whatAreCookies || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">How We Use Cookies</h2>
      <p>${data.howWeUseCookies || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Managing Cookies</h2>
      <p>${data.managingCookies || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Contact</h2>
      <p>${data.contactEmail || ''}</p>
    `;
  }
  if (documentTypeKey === 'eula') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">END USER LICENSE AGREEMENT (EULA)</h1>
      <p><b>Product Name:</b> ${data.productName || ''}</p>
      <p><b>Licensor:</b> ${data.licensorCompanyName || ''}</p>
      <p><b>Effective Date:</b> ${data.effectiveDate || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">License Grant</h2>
      <p>${data.licenseGrant || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Restrictions</h2>
      <p>${data.restrictions || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Termination</h2>
      <p>${data.termination || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Contact</h2>
      <p>${data.contactEmail || ''}</p>
    `;
  }
  if (documentTypeKey === 'websiteServicesAgreement') {
    return `
      <h1 style="text-align:center; font-size:20pt; font-family:'Times New Roman', Times, serif;">WEBSITE SERVICES AGREEMENT</h1>
      <p><b>Service Provider:</b> ${data.serviceProviderCompanyName || ''}</p>
      <p><b>Client:</b> ${data.clientCompanyName || ''}</p>
      <p><b>Agreement Date:</b> ${data.agreementDate || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Project Description</h2>
      <p>${data.websiteDescription || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Services Included</h2>
      <p>${data.servicesIncluded || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Payment Terms</h2>
      <p>${data.paymentSchedule || ''}</p>
      <h2 style="margin-top:24px; font-size:16pt;">Contact</h2>
      <p>${data.serviceProviderContactPerson || ''}</p>
    `;
  }
  // Fallback for other types
  return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

export const generatePdf = async (elementOrData: HTMLElement | { title: string, content: string, documentTypeKey?: string }, fileName: string): Promise<void> => {
  try {
    let element: HTMLElement;
    if (elementOrData instanceof HTMLElement) {
      element = elementOrData;
    } else {
      // Use the legal HTML renderer if documentTypeKey and data are provided
      let htmlContent = '';
      if ('documentTypeKey' in elementOrData && elementOrData.documentTypeKey) {
        htmlContent = renderLegalPdfTemplate({
          title: elementOrData.title,
          content: renderLegalHtmlFromData(elementOrData.documentTypeKey, JSON.parse(elementOrData.content)),
        });
      } else {
        htmlContent = renderLegalPdfTemplate(elementOrData);
      }
      const previewId = `pdf-legal-preview-${Date.now()}`;
      let previewDiv = document.getElementById(previewId);
      if (!previewDiv) {
        previewDiv = document.createElement('div');
        previewDiv.id = previewId;
        previewDiv.style.position = 'absolute';
        previewDiv.style.left = '-9999px';
        previewDiv.style.top = '0';
        previewDiv.style.width = '794px'; // A4 width in px at 96dpi
        previewDiv.style.background = '#fff';
        document.body.appendChild(previewDiv);
      }
      previewDiv.innerHTML = htmlContent;
      element = previewDiv;
    }
    // Make sure the element is visible
    const originalDisplay = element.style.display;
    element.style.display = 'block';
    
    // Scroll to the element to ensure it's in view
    element.scrollIntoView();
    
    // Add a small delay to ensure rendering is complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get the full height of the content
    const elementHeight = element.scrollHeight;
    const elementWidth = element.scrollWidth;
    
    // Create a canvas with the full content size
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: true, // Enable logging for debugging
      scrollY: -window.scrollY,
      width: elementWidth,
      height: elementHeight,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        // Ensure the cloned element is visible and properly sized
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.width = `${elementWidth}px`;
          clonedElement.style.height = 'auto';
          clonedElement.style.position = 'absolute';
          clonedElement.style.top = '0';
          clonedElement.style.left = '0';
        }
      }
    });
    
    // Calculate dimensions for PDF (A4 size in pixels at 96 DPI)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    
    // Save the PDF
    pdf.save(fileName);
    
    // Restore original display style
    element.style.display = originalDisplay;
  } catch (error: unknown) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate PDF: ${errorMessage}`);
  }
};