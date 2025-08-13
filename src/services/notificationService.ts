
'use server';

import { communicationManager, detailedPatients, Communication } from '@/lib/constants';

// --- IMPORTANT ---
// This service file now contains example code for sending REAL messages.
// To make it work, you need to:
// 1. Sign up for Twilio and SendGrid.
// 2. Get your API keys and credentials.
// 3. Add them to your .env file.
// 4. Uncomment the relevant code blocks below.

// Example using Twilio for SMS
import Twilio from 'twilio';
const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Example using SendGrid for Email
// import sgMail from '@sendgrid/mail';
// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

interface SendNotificationResult {
    success: boolean;
    message: string;
}

/**
 * Simulates OR sends a notification (SMS or Email) to a patient.
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
        if (communication.method === 'SMS') {
            // --- REAL TWILIO SMS IMPLEMENTATION ---
            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_MESSAGING_SERVICE_SID) {
                throw new Error("Twilio SMS credentials are not configured in .env file.");
            }
            await twilioClient.messages.create({
                body: communication.message,
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                to: patient.phone, // Ensure patient.phone is in E.164 format (e.g., +2348012345678)
            });
        } else if (communication.method === 'WhatsApp') {
             // --- REAL TWILIO WHATSAPP IMPLEMENTATION ---
            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_FROM) {
                throw new Error("Twilio WhatsApp credentials are not configured in .env file.");
            }
            await twilioClient.messages.create({
                body: communication.message,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
                to: `whatsapp:${patient.phone}`,
            });

        } else if (communication.method === 'Email') {
            // --- REAL SENDGRID IMPLEMENTATION (UNCOMMENT TO USE) ---
            /*
            if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_VERIFIED_SENDER) {
                 throw new Error("SendGrid credentials are not configured in .env file.");
            }
            const msg = {
                to: patient.email,
                from: process.env.SENDGRID_VERIFIED_SENDER,
                subject: `Update from Careflux Hospital regarding ${communication.type}`,
                text: communication.message,
                html: `<p>${communication.message}</p>`,
            };
            await sgMail.send(msg);
            */
            console.log(`--- SIMULATION ---`);
            console.log(`Email to ${patient.email} with subject "Update from Careflux Hospital": "${communication.message}"`);
            console.log(`------------------`);
        }

        // After sending (or simulating), mark it as sent in our system.
        communicationManager.markAsSent(communication.id);

        return { success: true, message: `Message successfully sent via ${communication.method}.` };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Failed to send notification:', errorMessage);
        return { success: false, message: `Failed to send notification: ${errorMessage}` };
    }
}
