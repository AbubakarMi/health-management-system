
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { AutopsyCase } from './constants';

export function generateAutopsyReportPdf(caseDetails: AutopsyCase) {
    const doc = new jsPDF();

    // Theme Colors
    const primaryColor = '#89B7E5'; 
    const headingColor = '#2d3748';
    const textColor = '#4a5568';
    const borderColor = '#CBD5E0';

    // Fonts
    doc.setFont('times', 'normal');

    // Ornate Border
    doc.setDrawColor(borderColor);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287); 
    doc.setLineWidth(0.5);
    doc.rect(8, 8, 194, 281);

    // Header
    doc.setFontSize(26);
    doc.setFont('times', 'bold');
    doc.setTextColor(headingColor);
    doc.text('Post-Mortem Examination Report', 105, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    doc.text('Issued by Careflux Hospital Pathology Department', 105, 33, { align: 'center' });

    // Case Details Section
    const sectionStartY = 50;
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('Case Details', 14, sectionStartY);
    doc.setDrawColor(borderColor);
    doc.line(14, sectionStartY + 2, 45, sectionStartY + 2);

    const detailY = sectionStartY + 10;
    const addDetailRow = (label: string, value: string, y: number) => {
        doc.setFont('times', 'bold');
        doc.text(label, 14, y);
        doc.setFont('times', 'normal');
        doc.text(value, 60, y);
    };

    addDetailRow('Case ID:', caseDetails.id, detailY);
    addDetailRow('Deceased\'s Name:', caseDetails.deceasedName, detailY + 10);
    addDetailRow('Date Registered:', format(new Date(caseDetails.dateRegistered), 'PPP'), detailY + 20);

    // Autopsy Report Body
    let cursorY = detailY + 40;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    
    const pageMargin = 14;
    const pageBottomMargin = 230; // Reserve space for signatures
    const textLines = doc.splitTextToSize(caseDetails.report || "No report content available.", 180); 
    const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor + 1.5;

    textLines.forEach((line: string) => {
        if (cursorY > pageBottomMargin) {
            doc.addPage();
            doc.setDrawColor(borderColor);
            doc.setLineWidth(1.5);
            doc.rect(5, 5, 200, 287); 
            doc.setLineWidth(0.5);
            doc.rect(8, 8, 194, 281);
            cursorY = 20; 
        }
        doc.text(line, pageMargin, cursorY);
        cursorY += lineHeight;
    });

    // Signature Block - Anchored to the bottom of the final page
    const finalPage = doc.getNumberOfPages();
    doc.setPage(finalPage);
    const finalSigY = 250;
    doc.setDrawColor(headingColor);
    doc.setFontSize(10);
    doc.setFont('times', 'normal');

    // Assigned Pathologist
    doc.line(14, finalSigY, 84, finalSigY);
    doc.text('Assigned Pathologist', 49, finalSigY + 5, { align: 'center' });
    doc.text(caseDetails.assignedDoctor, 49, finalSigY - 2, { align: 'center' });
    
    // Hospital Administration
    doc.line(126, finalSigY, 196, finalSigY);
    doc.text('Hospital Administration', 161, finalSigY + 5, { align: 'center' });


    // Footer
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.setDrawColor(borderColor);
    doc.line(14, 270, 200, 270);
    doc.text(`This report was generated on ${format(new Date(), 'PPP')}.`, 105, 278, { align: 'center' });
    doc.text('Careflux Hospital - No 35 Lamido Cresent Kano State.', 105, 283, { align: 'center' });

    // Save PDF
    const fileName = `Autopsy_Report_${caseDetails.deceasedName.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
}
