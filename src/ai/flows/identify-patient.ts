
'use server';
/**
 * @fileOverview A patient identification AI agent.
 *
 * - identifyPatient - A function that handles patient identification from a photo.
 * - IdentifyPatientInput - The input type for the identifyPatient function.
 * - IdentifyPatientOutput - The return type for the identifyPatient function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientRecordSchema = z.object({
    id: z.string().describe("The patient's unique ID."),
    name: z.string().describe("The patient's full name."),
    avatarUrl: z.string().describe("A URL to the patient's photo for comparison.")
});

const IdentifyPatientInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  patientDatabase: z.array(PatientRecordSchema).describe("A list of existing patient records to compare against."),
});
export type IdentifyPatientInput = z.infer<typeof IdentifyPatientInputSchema>;

const IdentifyPatientOutputSchema = z.object({
  matchFound: z.boolean().describe('Whether a matching patient was found in the database.'),
  patientId: z.string().optional().describe('The ID of the matched patient, if any.'),
});
export type IdentifyPatientOutput = z.infer<typeof IdentifyPatientOutputSchema>;

export async function identifyPatient(input: IdentifyPatientInput): Promise<IdentifyPatientOutput> {
  return identifyPatientFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPatientPrompt',
  input: {schema: IdentifyPatientInputSchema},
  output: {schema: IdentifyPatientOutputSchema},
  prompt: `You are an AI-powered facial recognition system for a hospital. Your task is to compare a new photo of a person's face with a database of existing patient photos to find a match.

Analyze the face in the provided photo:
Photo to identify: {{media url=photoDataUri}}

Now, compare it against the following patient records. Each record has an ID, name, and a URL to their existing photo for a visual comparison.

{{#each patientDatabase}}
Patient ID: {{this.id}}
Patient Name: {{this.name}}
Existing Photo: {{media url=this.avatarUrl}}
---
{{/each}}

Based on a visual facial comparison, determine if the face in the "Photo to identify" matches any of the faces in the patient database.

- If you find a clear match, set 'matchFound' to true and provide the 'patientId' of the matching record.
- If there is no clear match, set 'matchFound' to false and omit the 'patientId'.
- Prioritize accuracy. It is better to return no match than an incorrect one.
`,
});

const identifyPatientFlow = ai.defineFlow(
  {
    name: 'identifyPatientFlow',
    inputSchema: IdentifyPatientInputSchema,
    outputSchema: IdentifyPatientOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
