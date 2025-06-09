import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdf = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
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