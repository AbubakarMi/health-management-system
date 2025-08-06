
'use server';

/**
 * @fileOverview An AI agent for generating formal patient referral letters.
 *
 * - generateReferralLetter - Expands a doctor's brief notes into a formal referral letter.
 * - GenerateReferralLetterInput - The input type for the function.
 * - GenerateReferralLetterOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReferralLetterInputSchema = z.object({
  doctorNotes: z
    .string()
    .describe("A doctor's brief, clinical notes on why the patient is being referred."),
  patientName: z.string().describe("The full name of the patient being referred."),
  referringDoctor: z.string().describe("The name of the doctor making the referral."),
  receivingEntity: z.string().describe("The name of the hospital, clinic, or specialist the patient is being referred to."),
});
export type GenerateReferralLetterInput = z.infer<typeof GenerateReferralLetterInputSchema>;


const GenerateReferralLetterOutputSchema = z.object({
  formalLetter: z.string().describe('A formal, structured, and comprehensive referral letter suitable for inter-hospital communication.'),
});
export type GenerateReferralLetterOutput = z.infer<typeof GenerateReferralLetterOutputSchema>;

export async function generateReferralLetter(input: GenerateReferralLetterInput): Promise<GenerateReferralLetterOutput> {
  return generateReferralLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReferralLetterPrompt',
  input: {schema: GenerateReferralLetterInputSchema},
  output: {schema: GenerateReferralLetterOutputSchema},
  prompt: `You are an expert AI medical scribe tasked with writing a formal and comprehensive referral letter. Your response must be professional, medically appropriate, and expand significantly on the doctor's brief notes.

The final letter should be structured professionally, including a clear introduction, a summary of the patient's condition, the specific reason for referral, and a polite closing.

**Patient's Name:** {{patientName}}
**Referring Doctor:** {{referringDoctor}}
**Referred To:** {{receivingEntity}}

**Doctor's Clinical Notes for Referral:**
"{{doctorNotes}}"

Based on these notes, generate a full, formal referral letter.

The letter structure should be as follows:
1.  **Recipient's Details:** "To the attention of {{receivingEntity}},"
2.  **Patient Introduction:** "Re: Referral of {{patientName}}"
3.  **Opening Paragraph:** Formally introduce the patient and the purpose of the letter.
4.  **Body Paragraphs:** Detail the patient's condition, relevant history, and the specific reason for the referral. Elaborate on why the specialized care at {{receivingEntity}} is required.
5.  **Closing Paragraph:** Summarize the request and offer to provide any further information needed.
6.  **Formal Closing:** "Sincerely," followed by the referring doctor's name.

Example Tone and Content:
"Dear colleagues at {{receivingEntity}},

I am writing to formally refer my patient, {{patientName}}, for specialist consultation and management at your facility.

The patient has been under my care for [condition]. Recently, [describe recent events from notes]. Given the complexity of the case and the need for specialized diagnostic tools available at your institution, I believe the patient would greatly benefit from your expertise.

[Elaborate on the specific question to be answered or treatment required as per the doctor's notes].

I have attached the patient's relevant medical records for your review. Please do not hesitate to contact me if you require any further information. I look forward to our collaboration in the care of this patient.

Sincerely,
{{referringDoctor}}"
`,
});

const generateReferralLetterFlow = ai.defineFlow(
  {
    name: 'generateReferralLetterFlow',
    inputSchema: GenerateReferralLetterInputSchema,
    outputSchema: GenerateReferralLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
