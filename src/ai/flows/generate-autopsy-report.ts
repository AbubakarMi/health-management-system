
'use server';

/**
 * @fileOverview An AI agent for expanding brief autopsy findings into a formal report.
 *
 * - generateAutopsyReport - Expands a pathologist's brief notes into a formal autopsy report.
 * - GenerateAutopsyReportInput - The input type for the function.
 * - GenerateAutopsyReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAutopsyReportInputSchema = z.object({
  pathologistNotes: z
    .string()
    .describe("A pathologist's brief, clinical notes and findings from an autopsy."),
  deceasedName: z.string().describe("The full name of the deceased individual."),
});
export type GenerateAutopsyReportInput = z.infer<typeof GenerateAutopsyReportInputSchema>;


const GenerateAutopsyReportOutputSchema = z.object({
  formalReport: z.string().describe('A formal, structured, and comprehensive autopsy report suitable for official records.'),
});
export type GenerateAutopsyReportOutput = z.infer<typeof GenerateAutopsyReportOutputSchema>;

export async function generateAutopsyReport(input: GenerateAutopsyReportInput): Promise<GenerateAutopsyReportOutput> {
  return generateAutopsyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutopsyReportPrompt',
  input: {schema: GenerateAutopsyReportInputSchema},
  output: {schema: GenerateAutopsyReportOutputSchema},
  prompt: `You are an expert AI medical scribe specializing in pathology. Your task is to write a comprehensive and formal autopsy report by expanding on the pathologist's brief clinical findings. The report must be detailed, structured, use appropriate medical terminology, and contain no bold formatting.

Deceased's Name: {{deceasedName}}
Pathologist's Clinical Findings:
"{{pathologistNotes}}"

Based on these notes, generate a full, formal autopsy report.

The report should be structured with the following sections:
1.  Introduction: A formal opening statement confirming the post-mortem examination.
2.  External Examination: A description of the external findings based on the notes.
3.  Internal Examination: Detailed descriptions of the findings for major organ systems (Cardiovascular, Respiratory, etc.) as mentioned in the notes.
4.  Pathological Findings: A summary of the key pathological discoveries.
5.  Conclusion / Cause of Death: A clear and concise statement of the final diagnosis and determined cause of death.

Example Structure:
"A post-mortem examination was performed on the body of {{deceasedName}} on today's date.

External Examination:
[Expand on any external findings from notes, e.g., 'The body is that of a well-nourished adult male. There were no signs of external injury...']

Internal Examination:
-   Cardiovascular System: [Expand on heart/vessel findings, e.g., 'The heart weighed 450 grams and showed significant left ventricular hypertrophy...']
-   Respiratory System: [Expand on lung findings, e.g., 'The lungs were heavy and edematous, with evidence of pulmonary congestion...']
-   [Other systems as mentioned in notes]

Pathological Findings:
[Summarize the most critical findings, e.g., 'Significant coronary artery disease with 90% stenosis of the left anterior descending artery.']

Conclusion:
Based on the findings of this post-mortem examination, the cause of death is determined to be [Specific clinical cause from notes].'"
`,
});

const generateAutopsyReportFlow = ai.defineFlow(
  {
    name: 'generateAutopsyReportFlow',
    inputSchema: GenerateAutopsyReportInputSchema,
    outputSchema: GenerateAutopsyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
