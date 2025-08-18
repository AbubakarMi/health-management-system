import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Patient } from './constants';

export function generatePatientCard(patient: Patient) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Standard ID card size (3.375" x 2.125")
    });

    // Colors
    const primaryColor = '#89B7E5';
    const headingColor = '#2d3748';
    const textColor = '#4a5568';
    const borderColor = '#CBD5E0';
    const emergencyColor = '#E53E3E';

    // FRONT OF CARD
    generateCardFront(doc, patient, primaryColor, headingColor, textColor, borderColor);
    
    // Add new page for back
    doc.addPage();
    generateCardBack(doc, patient, emergencyColor, headingColor, textColor, borderColor);

    // Save the card
    const fileName = `Patient-Card-${patient.name.replace(/ /g, '_')}-${patient.id}.pdf`;
    doc.save(fileName);
}

function generateCardFront(doc: jsPDF, patient: Patient, primaryColor: string, headingColor: string, textColor: string, borderColor: string) {
    doc.setFont('helvetica', 'normal');

    // Card border
    doc.setDrawColor('#CBD5E0');
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 81.6, 49.98);

    // Header background
    doc.setFillColor('#89B7E5');
    doc.rect(2, 2, 81.6, 12, 'F');

    // Hospital name
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CAREFLUX HOSPITAL', 43.8, 6.5, { align: 'center' });
    doc.setFontSize(6);
    doc.text('PATIENT IDENTIFICATION CARD', 43.8, 9.5, { align: 'center' });

    // Patient photo placeholder (right side)
    doc.setFillColor(240, 240, 240);
    doc.rect(62, 16, 18, 20, 'F');
    doc.setDrawColor('#CBD5E0');
    doc.rect(62, 16, 18, 20);
    
    // Photo placeholder text
    doc.setFontSize(5);
    doc.setTextColor('#4a5568');
    doc.text('PATIENT', 71, 24, { align: 'center' });
    doc.text('PHOTO', 71, 27, { align: 'center' });

    // Patient details (left side)
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');

    let yPos = 18;
    const labelX = 4;
    const valueX = 20;
    const lineHeight = 3.2;

    // Patient ID (prominent)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ID:', labelX, yPos);
    doc.setTextColor('#89B7E5');
    doc.text(patient.id, valueX, yPos);
    yPos += lineHeight;

    // Patient name
    doc.setFontSize(7);
    doc.setTextColor('#2d3748');
    doc.text('NAME:', labelX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    const name = patient.name.length > 20 ? patient.name.substring(0, 20) + '...' : patient.name;
    doc.text(name, valueX, yPos);
    yPos += lineHeight;

    // Date of birth
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('DOB:', labelX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(format(new Date(patient.dateOfBirth), 'dd/MM/yyyy'), valueX, yPos);
    yPos += lineHeight;

    // Gender
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('GENDER:', labelX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(patient.gender, valueX, yPos);
    yPos += lineHeight;

    // Blood type
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('BLOOD:', labelX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#E53E3E'); // Red color for blood type
    doc.text(patient.bloodType, valueX, yPos);
    yPos += lineHeight;

    // Phone number
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('PHONE:', labelX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(patient.phone || 'Not provided', valueX, yPos);
    yPos += lineHeight;

    // Biometric indicators
    yPos += 1;
    doc.setFontSize(5);
    doc.setTextColor('#4a5568');
    let biometricText = 'BIOMETRICS: ';
    if (patient.fingerprintId) biometricText += '🖊️ ';
    if (patient.faceId) biometricText += '🤳 ';
    if (!patient.fingerprintId && !patient.faceId) biometricText += 'None';
    doc.text(biometricText, labelX, yPos);

    // Issue date
    yPos += 3;
    doc.setFontSize(5);
    doc.text(`Issued: ${format(new Date(), 'dd/MM/yyyy')}`, labelX, yPos);
}

function generateCardBack(doc: jsPDF, patient: Patient, emergencyColor: string, headingColor: string, textColor: string, borderColor: string) {
    doc.setFont('helvetica', 'normal');

    // Card border
    doc.setDrawColor('#CBD5E0');
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 81.6, 49.98);

    // Emergency header
    doc.setFillColor('#E53E3E');
    doc.rect(2, 2, 81.6, 10, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('EMERGENCY MEDICAL INFORMATION', 43.8, 7.5, { align: 'center' });

    let yPos = 16;
    const leftMargin = 4;
    const lineHeight = 3.2;

    // Allergies
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#E53E3E');
    doc.text('ALLERGIES:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    const allergies = patient.clinicalSummary?.includes('Allergies:') 
        ? patient.clinicalSummary.split('Allergies:')[1]?.split('.')[0]?.trim() || 'None specified'
        : 'None specified';
    doc.text(allergies, leftMargin, yPos + 2.5);
    yPos += 6;

    // Medical conditions
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('MEDICAL CONDITIONS:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(patient.condition, leftMargin, yPos + 2.5);
    yPos += 6;

    // Doctor
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('ASSIGNED DOCTOR:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text(patient.assignedDoctor, leftMargin, yPos + 2.5);
    yPos += 8;

    // Hospital information section
    doc.setDrawColor('#CBD5E0');
    doc.line(4, yPos, 80, yPos);
    yPos += 3;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d3748');
    doc.text('IF FOUND, KINDLY RETURN TO:', 43.8, yPos, { align: 'center' });
    yPos += 3;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#89B7E5');
    doc.text('CAREFLUX HOSPITAL', 43.8, yPos, { align: 'center' });
    yPos += 3;

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text('No 35 Lamido Crescent, Kano State', 43.8, yPos, { align: 'center' });
    yPos += 2.5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#E53E3E');
    doc.text('Emergency: +234 706 916 3505', 43.8, yPos, { align: 'center' });
    yPos += 2.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a5568');
    doc.text('www.carefluxhospital.com', 43.8, yPos, { align: 'center' });

    // QR code placeholder (bottom right)
    doc.setFillColor(240, 240, 240);
    doc.rect(70, 40, 10, 10, 'F');
    doc.setDrawColor('#CBD5E0');
    doc.rect(70, 40, 10, 10);
    doc.setFontSize(4);
    doc.text('QR', 75, 45.5, { align: 'center' });
}