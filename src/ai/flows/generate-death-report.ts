
'use server';

/**
 * @fileOverview An AI agent for expanding brief notes into a formal death report.
 *
 * - generateDeathReport - Expands a doctor's brief notes into a formal summary for a death certificate.
 * - GenerateDeathReportInput - The input type for the function.
 * - GenerateDeathReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeathReportInputSchema = z.object({
  doctorNotes: z
    .string()
    .describe("A doctor's brief, clinical notes on the cause and circumstances of a patient's death."),
  patientName: z.string().describe("The full name of the deceased patient."),
});
export type GenerateDeathReportInput = z.infer<typeof GenerateDeathReportInputSchema>;


const GenerateDeathReportOutputSchema = z.object({
  formalReport: z.string().describe('A formal, compassionate, and structured summary of the patient\'s passing, suitable for an official death certificate.'),
});
export type GenerateDeathReportOutput = z.infer<typeof GenerateDeathReportOutputSchema>;

export async function generateDeathReport(input: GenerateDeathReportInput): Promise<GenerateDeathReportOutput> {
  return generateDeathReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDeathReportPrompt',
  input: {schema: GenerateDeathReportInputSchema},
  output: {schema: GenerateDeathReportOutputSchema},
  prompt: `You are an expert AI medical scribe tasked with writing a comprehensive and formal summary for a patient's death certificate. Your response must be compassionate, professional, and medically appropriate, expanding significantly on the doctor's brief notes.

The final report should be detailed and structured into several paragraphs covering the full context of the patient's passing.

**Patient's Name:** {{patientName}}
**Doctor's Clinical Notes:**
"{{doctorNotes}}"

Based on these notes, generate a full, formal report. The tone should be official but gentle.

The report should include:
1.  A formal opening statement confirming the patient's passing.
2.  A brief summary of the circumstances leading to their death, mentioning their condition and the care provided.
3.  A clear statement of the immediate cause of death as indicated in the notes.
4.  Mention any contributing factors if they are present in the notes.
5.  A professional concluding sentence.

Example Structure:
"It is with great sadness that we confirm the passing of [Patient Name] on [Date, if inferable]. The patient had been under our care for [condition, if inferable].

Despite all medical efforts and comprehensive care provided by our team, the patient's condition unfortunately deteriorated. The clinical team worked diligently to manage the patient's symptoms and provide comfort throughout their final days.

The immediate cause of death was determined to be [Specific clinical cause from notes]. Contributing factors included [contributing factors, if mentioned].

The patient passed peacefully. We extend our deepest condolences to the family and loved ones during this difficult time."
`,
});

const generateDeathReportFlow = ai.defineFlow(
  {
    name: 'generateDeathReportFlow',
    inputSchema: GenerateDeathReportInputSchema,
    outputSchema: GenerateDeathReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
