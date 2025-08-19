import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Patient } from './constants';
import { enhancePatientPicture, imageToBase64 } from '../ai/flows/enhance-picture';

export async function generatePatientCard(patient: Patient) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Standard ID card size (3.375" x 2.125")
    });

    // Theme Colors - Match existing PDF design
    const primaryColor = '#89B7E5';
    const headingColor = '#2d3748';
    const textColor = '#4a5568';
    const borderColor = '#CBD5E0';
    const emergencyColor = '#E53E3E';

    // Fonts - Match existing PDF design
    doc.setFont('times', 'normal');

    // Process patient picture if available
    let patientImage: string | null = null;
    if (patient.avatarUrl) {
        try {
            // Enhance picture with AI (white background)
            const enhanced = await enhancePatientPicture({
                imageUrl: patient.avatarUrl,
                patientName: patient.name
            });
            
            if (enhanced.success && enhanced.enhancedImageUrl) {
                patientImage = await imageToBase64(enhanced.enhancedImageUrl);
            } else {
                // Fallback to original image
                patientImage = await imageToBase64(patient.avatarUrl);
            }
        } catch (error) {
            console.error('Error processing patient image:', error);
            patientImage = null;
        }
    }

    // FRONT OF CARD
    generateCardFront(doc, patient, primaryColor, headingColor, textColor, borderColor, patientImage);
    
    // Add new page for back
    doc.addPage();
    generateCardBack(doc, patient, emergencyColor, headingColor, textColor, borderColor);

    // Save the card
    const fileName = `Patient-Card-${patient.name.replace(/ /g, '_')}-${patient.id}.pdf`;
    doc.save(fileName);
}

function generateCardFront(doc: jsPDF, patient: Patient, primaryColor: string, headingColor: string, textColor: string, borderColor: string, patientImage?: string | null) {
    doc.setFont('times', 'normal');

    // Ornate Border - Match existing PDF design
    doc.setDrawColor('#CBD5E0');
    doc.setLineWidth(1.5);
    doc.rect(2, 2, 81.6, 49.98);
    doc.setLineWidth(0.5);
    doc.rect(3, 3, 79.6, 47.98);

    // Hospital name - Match existing PDF style with proper spacing
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('Careflux Hospital', 42.8, 8, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    doc.text('No 35 Lamido Crescent Kano State', 42.8, 11.5, { align: 'center' });
    
    // Card title with proper spacing
    doc.setFontSize(7);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('PATIENT ID CARD', 42.8, 15, { align: 'center' });

    // Patient photo section - Enhanced with actual photo or placeholder
    const photoX = 58;
    const photoY = 18;
    const photoW = 20;
    const photoH = 24;
    
    if (patientImage) {
        try {
            // Add the enhanced patient photo
            doc.addImage(patientImage, 'JPEG', photoX, photoY, photoW, photoH);
            
            // Add photo border
            doc.setDrawColor('#CBD5E0');
            doc.setLineWidth(1);
            doc.rect(photoX, photoY, photoW, photoH);
            
            // Add inner border for professional look
            doc.setDrawColor('#89B7E5');
            doc.setLineWidth(0.5);
            doc.rect(photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
            
        } catch (error) {
            console.error('Error adding patient image to PDF:', error);
            // Fall back to placeholder
            addPhotoPlaceholder(doc, photoX, photoY, photoW, photoH);
        }
    } else {
        // Use placeholder when no image available
        addPhotoPlaceholder(doc, photoX, photoY, photoW, photoH);
    }

    // Patient details (left side) - Carefully spaced to avoid overlaps
    let yPos = 19;
    const labelX = 5;
    const valueX = 18;
    const lineHeight = 4.2;
    const maxValueWidth = 35; // Maximum width for values to prevent overlap with photo

    // Patient ID (prominent and well-spaced)
    doc.setFontSize(7);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('ID:', labelX, yPos);
    doc.setTextColor('#89B7E5');
    doc.setFontSize(8);
    doc.text(patient.id, valueX, yPos);
    yPos += lineHeight;

    // Patient name (truncated to prevent overlap)
    doc.setFontSize(7);
    doc.setTextColor('#2d3748');
    doc.setFont('times', 'bold');
    doc.text('NAME:', labelX, yPos);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    // Ensure name doesn't exceed available space
    let displayName = patient.name;
    if (displayName.length > 20) {
        displayName = displayName.substring(0, 20) + '...';
    }
    doc.text(displayName, valueX, yPos);
    yPos += lineHeight;

    // Date of birth (well aligned)
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('DOB:', labelX, yPos);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(format(new Date(patient.dateOfBirth), 'dd/MM/yyyy'), valueX, yPos);
    yPos += lineHeight;

    // Gender (properly positioned)
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('GENDER:', labelX, yPos);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(patient.gender, valueX, yPos);
    yPos += lineHeight;

    // Blood type (well highlighted and positioned)
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('BLOOD:', labelX, yPos);
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor('#E53E3E');
    doc.text(patient.bloodType, valueX, yPos);
    yPos += lineHeight;

    // Phone number (truncated if too long)
    doc.setFontSize(7);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('PHONE:', labelX, yPos);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    let phoneDisplay = patient.phone || 'Not provided';
    // Truncate phone if too long
    if (phoneDisplay.length > 15) {
        phoneDisplay = phoneDisplay.substring(0, 15) + '...';
    }
    doc.text(phoneDisplay, valueX, yPos);
    yPos += lineHeight + 1;

    // Footer section - properly spaced at bottom
    const footerY = 46;
    doc.setFontSize(6);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(`Issued: ${format(new Date(), 'dd/MM/yyyy')}`, labelX, footerY);
    
    // Validity status - positioned to not overlap with issue date
    doc.setTextColor('#89B7E5');
    doc.setFont('times', 'bold');
    doc.text('VALID', 40, footerY);
}

function generateCardBack(doc: jsPDF, patient: Patient, emergencyColor: string, headingColor: string, textColor: string, borderColor: string) {
    doc.setFont('times', 'normal');

    // Ornate Border - Match existing PDF design
    doc.setDrawColor('#CBD5E0');
    doc.setLineWidth(1.5);
    doc.rect(2, 2, 81.6, 49.98);
    doc.setLineWidth(0.5);
    doc.rect(3, 3, 79.6, 47.98);

    // Emergency contact header - properly spaced
    doc.setFontSize(8);
    doc.setFont('times', 'bold');
    doc.setTextColor('#E53E3E');
    doc.text('EMERGENCY CONTACT INFORMATION', 42.8, 9, { align: 'center' });

    // Emergency contact section with clear spacing
    let yPos = 16;
    const leftMargin = 6;
    const labelWidth = 18;
    const valueX = leftMargin + labelWidth;
    const lineHeight = 4.5;
    const maxTextWidth = 50; // Maximum width to prevent text overflow

    // Contact Name - properly positioned
    doc.setFontSize(7);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('Contact Name:', leftMargin, yPos);
    
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    let contactName = patient.emergencyContactName || 'Not provided';
    // Truncate if too long to prevent overlap
    if (contactName.length > 25) {
        contactName = contactName.substring(0, 25) + '...';
    }
    doc.text(contactName, valueX, yPos);
    yPos += lineHeight;

    // Relationship - well spaced
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('Relationship:', leftMargin, yPos);
    
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    let relationship = patient.emergencyContactRelationship || 'Not provided';
    // Truncate if too long
    if (relationship.length > 20) {
        relationship = relationship.substring(0, 20) + '...';
    }
    doc.text(relationship, valueX, yPos);
    yPos += lineHeight;

    // Phone Number - highlighted and well positioned
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('Phone:', leftMargin, yPos);
    
    doc.setFont('times', 'bold');
    doc.setTextColor('#E53E3E');
    let contactPhone = patient.emergencyContactPhone || 'Not provided';
    // Ensure phone number fits
    if (contactPhone.length > 18) {
        contactPhone = contactPhone.substring(0, 18) + '...';
    }
    doc.text(contactPhone, valueX, yPos);
    yPos += lineHeight + 3;

    // Clear separator line
    doc.setDrawColor('#CBD5E0');
    doc.setLineWidth(0.5);
    doc.line(6, yPos, 76, yPos);
    yPos += 5;

    // Hospital return information - properly centered and spaced
    doc.setFontSize(7);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('IF FOUND, KINDLY RETURN TO:', 42.8, yPos, { align: 'center' });
    yPos += 5;

    // Hospital name - well spaced
    doc.setFontSize(9);
    doc.setFont('times', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('Careflux Hospital', 42.8, yPos, { align: 'center' });
    yPos += 4;

    // Address - properly positioned
    doc.setFontSize(6);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    doc.text('No 35 Lamido Crescent, Kano State', 42.8, yPos, { align: 'center' });
    yPos += 4;

    // Phone number - highlighted
    doc.setFont('times', 'bold');
    doc.setFontSize(7);
    doc.setTextColor('#E53E3E');
    doc.text('+234 706 916 3505', 42.8, yPos, { align: 'center' });
    yPos += 5;

    // Footer message - well positioned at bottom
    doc.setFontSize(5);
    doc.setFont('times', 'normal');
    doc.setTextColor('#4a5568');
    doc.text('or nearest police station. Thank you.', 42.8, yPos, { align: 'center' });
}

// Helper function for photo placeholder
function addPhotoPlaceholder(doc: jsPDF, x: number, y: number, width: number, height: number) {
    // Background
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y, width, height, 'F');
    
    // Border
    doc.setDrawColor('#CBD5E0');
    doc.setLineWidth(1);
    doc.rect(x, y, width, height);
    
    // Placeholder text
    doc.setFontSize(5);
    doc.setTextColor('#4a5568');
    doc.text('PATIENT', x + width/2, y + height/2 - 1, { align: 'center' });
    doc.text('PHOTO', x + width/2, y + height/2 + 2, { align: 'center' });
}