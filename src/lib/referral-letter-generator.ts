
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Patient, MedicalHistoryEntry } from './constants';

export function generateReferralLetterPdf(patient: Patient, visit: MedicalHistoryEntry) {
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
    doc.setFontSize(24);
    doc.setFont('times', 'bold');
    doc.setTextColor(headingColor);
    doc.text('Patient Referral Letter', 105, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    doc.text('Issued by Careflux Hospital', 105, 33, { align: 'center' });


    // Letterhead details
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    doc.text(`Date: ${format(new Date(visit.date), 'PPP')}`, 14, 48);

    // Referral Details
    const detailY = 60;
    const addDetailRow = (label: string, value: string, y: number) => {
        doc.setFont('times', 'bold');
        doc.text(label, 14, y);
        doc.setFont('times', 'normal');
        doc.text(value, 50, y);
    };

    addDetailRow('Referring Doctor:', visit.doctor, detailY);
    addDetailRow('Patient Name:', patient.name, detailY + 8);
    addDetailRow('Patient ID:', patient.id, detailY + 16);

    // Letter Body
    let cursorY = detailY + 30;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    
    // --- Robust Text Rendering with Automatic Page Breaks ---
    const pageMargin = 14;
    const pageBottomMargin = 230; // Reserve space at the bottom for signatures
    const textLines = doc.splitTextToSize(visit.details, 182); // wrap text
    const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor + 1.5; // Line height with spacing

    textLines.forEach((line: string) => {
        if (cursorY > pageBottomMargin) {
            doc.addPage();
            // Re-add border to new page
            doc.setDrawColor(borderColor);
            doc.setLineWidth(1.5);
            doc.rect(5, 5, 200, 287); 
            doc.setLineWidth(0.5);
            doc.rect(8, 8, 194, 281);
            
            cursorY = 20; // Reset cursor to top of new page
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

    // Attending Physician
    doc.line(14, finalSigY, 84, finalSigY);
    doc.text('Attending Physician', 49, finalSigY + 5, { align: 'center' });
    doc.text(visit.doctor, 49, finalSigY - 2, { align: 'center' });
    
    // Hospital Administration
    doc.line(126, finalSigY, 196, finalSigY);
    doc.text('Hospital Administration', 161, finalSigY + 5, { align: 'center' });


    // Footer
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.setDrawColor(borderColor);
    doc.line(14, 270, 200, 270);
    doc.text(`This letter was generated on ${format(new Date(), 'PPP')}.`, 105, 278, { align: 'center' });
    doc.text('Careflux Hospital - No 35 Lamido Cresent Kano State.', 105, 283, { align: 'center' });

    // Save PDF
    const fileName = `Referral_Letter_${patient.name.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
}
