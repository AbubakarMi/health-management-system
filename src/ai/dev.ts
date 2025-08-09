
import { config } from 'dotenv';
config();

import '@/ai/flows/health-risk-assessment.ts';
import '@/ai/flows/identify-patient.ts';
import '@/ai/flows/generate-clinical-plan.ts';
import '@/ai/flows/generate-medical-note.ts';
import '@/ai/flows/generate-death-report.ts';
import '@/ai/flows/generate-referral-letter.ts';
import '@/ai/flows/generate-autopsy-report.ts';
import '@/ai/flows/fetch-external-record.ts';
import '@/ai/flows/generate-voice-response.ts';

