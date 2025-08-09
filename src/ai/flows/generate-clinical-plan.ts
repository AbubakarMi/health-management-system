
'use server';

/**
 * @fileOverview An AI agent for generating a comprehensive clinical plan for a patient.
 *
 * - generateClinicalPlan - Generates prescriptions, follow-up, and lifestyle advice.
 * - GenerateClinicalPlanInput - The input type for the function.
 * - GenerateClinicalPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClinicalPlanInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe('A summary of the patient\'s past and present medical conditions and treatments.'),
  currentCondition: z.string().describe('The patient\'s current condition or reason for the latest visit.'),
});
export type GenerateClinicalPlanInput = z.infer<typeof GenerateClinicalPlanInputSchema>;

const RecommendationSchema = z.object({
    id: z.string().describe("A unique identifier for the suggestion, e.g., 'diet-1'."),
    suggestion: z.string().describe('The specific, actionable recommendation for the patient.'),
    category: z.enum(['Diet', 'Lifestyle', 'General Health']).describe('The category of the recommendation.'),
});

const PrescriptionSuggestionSchema = z.object({
    id: z.string().describe("A unique identifier for the prescription, e.g., 'presc-1'."),
    medicine: z.string().describe('The name of the suggested medication.'),
    dosage: z.string().describe('The suggested dosage for the medication (e.g., "10mg daily").'),
});

const FollowUpSuggestionSchema = z.object({
    id: z.string().describe("A unique identifier for the follow-up, e.g., 'fu-1'."),
    timing: z.string().describe('The suggested timing for the follow-up appointment (e.g., "2 weeks", "1 month").'),
    reason: z.string().describe('A brief reason for the follow-up appointment.'),
});


const GenerateClinicalPlanOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of health and lifestyle recommendations for the patient.'),
  prescriptionSuggestions: z.array(PrescriptionSuggestionSchema).describe('A list of suggested prescriptions.'),
  followUpSuggestion: FollowUpSuggestionSchema.optional().describe('A suggestion for a follow-up appointment.'),
});
export type GenerateClinicalPlanOutput = z.infer<typeof GenerateClinicalPlanOutputSchema>;

export async function generateClinicalPlan(input: GenerateClinicalPlanInput): Promise<GenerateClinicalPlanOutput> {
  return generateClinicalPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateClinicalPlanPrompt',
  input: {schema: GenerateClinicalPlanInputSchema},
  output: {schema: GenerateClinicalPlanOutputSchema},
  prompt: `You are an expert AI medical assistant providing decision support to a doctor.
Your task is to analyze the patient's data and generate a concise, actionable clinical plan.

The plan should include:
1.  **Prescription Suggestions**: 1-2 suggested medications appropriate for the patient's condition.
2.  **Follow-up Suggestion**: A recommended timeframe for a follow-up visit (e.g., "2 weeks", "1 month", "3 months") if necessary.
3.  **Lifestyle/Dietary Recommendations**: 2-3 easy-to-understand recommendations for the patient.

Patient's Current Condition:
{{currentCondition}}

Patient's Medical History:
{{{medicalHistory}}}

Based on this information, provide a clear, safe, and relevant clinical plan.
- For a patient with new hypertension, you might suggest an antihypertensive like Lisinopril, a follow-up in 1 month, and dietary advice to reduce sodium.
- For a simple infection, you might suggest an antibiotic, no follow-up, and advice to rest and hydrate.
- If the history is minimal, provide general wellness advice and safe, common prescriptions for the stated condition.
`,
});

const generateClinicalPlanFlow = ai.defineFlow(
  {
    name: 'generateClinicalPlanFlow',
    inputSchema: GenerateClinicalPlanInputSchema,
    outputSchema: GenerateClinicalPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
