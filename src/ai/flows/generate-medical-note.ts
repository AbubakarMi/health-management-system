
'use server';

/**
 * @fileOverview An AI agent for expanding brief medical notes into detailed entries.
 *
 * - generateMedicalNote - Expands a doctor's brief notes into a full medical record entry.
 * - GenerateMedicalNoteInput - The input type for the function.
 * - GenerateMedicalNoteOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMedicalNoteInputSchema = z.object({
  briefNote: z
    .string()
    .describe('A brief, shorthand note from a doctor about a patient visit.'),
});
export type GenerateMedicalNoteInput = z.infer<typeof GenerateMedicalNoteInputSchema>;


const GenerateMedicalNoteOutputSchema = z.object({
  detailedNote: z.string().describe('A detailed, well-structured medical note suitable for patient records.'),
});
export type GenerateMedicalNoteOutput = z.infer<typeof GenerateMedicalNoteOutputSchema>;

export async function generateMedicalNote(input: GenerateMedicalNoteInput): Promise<GenerateMedicalNoteOutput> {
  return generateMedicalNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMedicalNotePrompt',
  input: {schema: GenerateMedicalNoteInputSchema},
  output: {schema: GenerateMedicalNoteOutputSchema},
  prompt: `You are an expert AI medical scribe. Your task is to take a doctor's brief, shorthand notes and expand them into a formal, detailed clinical note for a patient's medical record.

The expanded note should be clear, professional, and well-structured. Use appropriate medical terminology but ensure the note is understandable.

Doctor's Brief Note:
"{{briefNote}}"

Based on this, generate a comprehensive note covering the patient's subjective complaints, objective findings, assessment, and plan (SOAP format if applicable, but not strictly required).
`,
});

const generateMedicalNoteFlow = ai.defineFlow(
  {
    name: 'generateMedicalNoteFlow',
    inputSchema: GenerateMedicalNoteInputSchema,
    outputSchema: GenerateMedicalNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
