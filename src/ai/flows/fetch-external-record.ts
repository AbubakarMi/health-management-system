
'use server';

/**
 * @fileOverview An AI agent for fetching patient records from a simulated external health database.
 *
 * - fetchExternalRecord - Searches for a patient's record based on their name and DOB.
 * - FetchExternalRecordInput - The input type for the function.
 * - FetchExternalRecordOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchExternalRecordInputSchema = z.object({
  patientName: z.string().describe("The full name of the patient to search for."),
  dateOfBirth: z.string().describe("The patient's date of birth in YYYY-MM-DD format."),
});
export type FetchExternalRecordInput = z.infer<typeof FetchExternalRecordInputSchema>;


const FetchExternalRecordOutputSchema = z.object({
  recordFound: z.boolean().describe('Whether a matching patient record was found in the external database.'),
  clinicalSummary: z.string().optional().describe("A summary of the patient's medical history and conditions."),
  allergies: z.string().optional().describe("A list of known patient allergies."),
  medications: z.string().optional().describe("A list of current medications the patient is taking."),
});
export type FetchExternalRecordOutput = z.infer<typeof FetchExternalRecordOutputSchema>;

export async function fetchExternalRecord(input: FetchExternalRecordInput): Promise<FetchExternalRecordOutput> {
  return fetchExternalRecordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fetchExternalRecordPrompt',
  input: {schema: FetchExternalRecordInputSchema},
  output: {schema: FetchExternalRecordOutputSchema},
  prompt: `You are an AI gateway to a secure, simulated national Health Information Exchange (HIE).
Your task is to search for a patient's record in the HIE database based on their name and date of birth.

The following is the complete, simulated HIE database. Only use the data provided here.

--- HIE DATABASE START ---

1.  **Patient Name:** Binta Ibrahim
    **Date of Birth:** 1988-09-12
    **Clinical Summary:** History of mild asthma, managed with Albuterol inhaler as needed. Otherwise healthy.
    **Allergies:** Penicillin
    **Medications:** Albuterol Inhaler

2.  **Patient Name:** Chinedu Okoro
    **Date of Birth:** 1975-03-21
    **Clinical Summary:** Patient has Type 2 Diabetes, diagnosed in 2015. Well-controlled with diet and Metformin. Also has a history of hypertension.
    **Allergies:** No Known Allergies
    **Medications:** Metformin 500mg daily, Lisinopril 10mg daily

3.  **Patient Name:** Fatima Yusuf
    **Date of Birth:** 1995-11-01
    **Clinical Summary:** Patient had an appendectomy in 2020. No chronic conditions. Fully recovered.
    **Allergies:** Sulfa drugs
    **Medications:** None

--- HIE DATABASE END ---

Now, search for the following patient:
**Patient Name:** {{patientName}}
**Date of Birth:** {{dateOfBirth}}

- If you find an exact match for BOTH the name and date of birth in the HIE database, set 'recordFound' to true and populate the output fields with the exact data from the database.
- If no exact match is found, set 'recordFound' to false and leave the other fields empty. Do not guess or create data.
`,
});

const fetchExternalRecordFlow = ai.defineFlow(
  {
    name: 'fetchExternalRecordFlow',
    inputSchema: FetchExternalRecordInputSchema,
    outputSchema: FetchExternalRecordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
