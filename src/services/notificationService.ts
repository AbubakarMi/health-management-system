
'use server';

import { communicationManager, detailedPatients, users, Communication } from '@/lib/constants';

// --- IMPORTANT ---
// This is a SIMULATED service. In a real-world scenario, you would replace the
// commented-out sections with actual API calls to services like Twilio and SendGrid.
// You would need to install their SDKs (e.g., `npm install twilio @sendgrid/mail`)
// and manage API keys securely using environment variables.

// Example using Twilio for SMS
// import Twilio from 'twilio';
// const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Example using SendGrid for Email
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface SendNotificationResult {
    success: boolean;
    message: string;
}

/**
 * Simulates sending a notification (SMS or Email) to a patient.
 * @param communication - The communication object containing message details.
 * @returns A promise that resolves with the result of the operation.
 */
export async function sendNotification(communication: Communication): Promise<SendNotificationResult> {
    console.log(`Attempting to send notification for communication ID: ${communication.id}`);

    const patient = detailedPatients.find(p => p.name === communication.patientName);
    if (!patient) {
        console.error(`Patient not found: ${communication.patientName}`);
        return { success: false, message: 'Patient not found.' };
    }

    try {
        if (communication.method === 'SMS' || communication.method === 'WhatsApp') {
            // --- TWILIO SMS SIMULATION ---
            console.log(`Simulating SMS to ${patient.phone}: "${communication.message}"`);
            /*
            // REAL TWILIO IMPLEMENTATION EXAMPLE:
            await twilioClient.messages.create({
                body: communication.message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: patient.phone, // Ensure patient.phone is in E.164 format
            });
            */
            // --- END SIMULATION ---
        } else if (communication.method === 'Email') {
            // --- SENDGRID EMAIL SIMULATION ---
            console.log(`Simulating Email to ${patient.email}: "${communication.message}"`);
            /*
            // REAL SENDGRID IMPLEMENTATION EXAMPLE:
            const msg = {
                to: patient.email,
                from: 'no-reply@careflux.hospital', // Use a verified sender
                subject: `Update from Careflux Hospital regarding ${communication.type}`,
                text: communication.message,
                html: `<p>${communication.message}</p>`, // You can add HTML content
            };
            await sgMail.send(msg);
            */
            // --- END SIMULATION ---
        }

        // If the simulated sending is successful, mark it as sent in our system.
        communicationManager.markAsSent(communication.id);

        return { success: true, message: `Message successfully sent via ${communication.method}.` };

    } catch (error) {
        console.error('Failed to send notification:', error);
        return { success: false, message: `Failed to send notification: ${error}` };
    }
}
