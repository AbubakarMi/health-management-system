
'use server';

/**
 * @fileOverview A health risk assessment AI agent.
 *
 * - assessHealthRisk - A function that handles the health risk assessment process.
 * - AssessHealthRiskInput - The input type for the assessHealthRisk function.
 * - AssessHealthRiskOutput - The return type for the assessHealthRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessHealthRiskInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe('The medical history of the patient.'),
  lifestyleFactors: z
    .string()
    .describe('The lifestyle factors of the patient, such as diet and exercise.'),
  familyHistory: z
    .string()
    .describe('The family history of the patient.'),
});
export type AssessHealthRiskInput = z.infer<typeof AssessHealthRiskInputSchema>;

const AssessHealthRiskOutputSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The risk level of the patient.'),
  riskFactors: z.string().describe('The risk factors of the patient.'),
  recommendations: z.string().describe('The lifestyle and preventative recommendations for the patient.'),
  treatmentSuggestion: z.string().describe('Specific treatment plans or medications that could be considered for the identified risks.'),
});
export type AssessHealthRiskOutput = z.infer<typeof AssessHealthRiskOutputSchema>;

export async function assessHealthRisk(input: AssessHealthRiskInput): Promise<AssessHealthRiskOutput> {
  return assessHealthRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessHealthRiskPrompt',
  input: {schema: AssessHealthRiskInputSchema},
  output: {schema: AssessHealthRiskOutputSchema},
  prompt: `You are an AI health risk assessment tool for medical professionals.

You will use the following information to assess the patient's health risk.

Medical History: {{{medicalHistory}}}
Lifestyle Factors: {{{lifestyleFactors}}}
Family History: {{{familyHistory}}}

You will make a determination as to the patient's risk level (low, medium, or high), and what the risk factors are, and set the riskLevel and riskFactors output fields appropriately.

You will also provide lifestyle and preventative recommendations for the patient.

Finally, based on the assessment, provide a suggestion for a potential treatment plan or specific medications that a doctor might consider.
`,
});

const assessHealthRiskFlow = ai.defineFlow(
  {
    name: 'assessHealthRiskFlow',
    inputSchema: AssessHealthRiskInputSchema,
    outputSchema: AssessHealthRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
