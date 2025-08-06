
'use server';

/**
 * @fileOverview An AI agent for generating patient health recommendations.
 *
 * - generateRecommendations - A function that generates lifestyle and dietary advice.
 * - GenerateRecommendationsInput - The input type for the function.
 * - GenerateRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationsInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe('A summary of the patient\'s past and present medical conditions and treatments.'),
  currentCondition: z.string().describe('The patient\'s current condition or reason for the latest visit.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const RecommendationSchema = z.object({
    id: z.string().describe("A unique identifier for the suggestion, e.g., 'diet-1'."),
    suggestion: z.string().describe('The specific, actionable recommendation for the patient.'),
    category: z.enum(['Diet', 'Lifestyle', 'General Health']).describe('The category of the recommendation.'),
});

const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of health and lifestyle recommendations for the patient.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an expert AI medical assistant providing decision support to a doctor.
Your task is to analyze the patient's data and generate a short list of 2-3 concise, actionable health recommendations.

The recommendations should be easy for a patient to understand and follow.
Categorize each recommendation as 'Diet', 'Lifestyle', or 'General Health'.

Patient's Current Condition:
{{currentCondition}}

Patient's Medical History:
{{{medicalHistory}}}

Based on this information, provide clear, safe, and relevant recommendations. For example, if a patient has hypertension, suggest reducing sodium intake. If they are pre-diabetic, suggest regular exercise.

IMPORTANT: If the provided history is minimal or lacks specific details, provide general wellness recommendations that are safe and suitable for any patient (e.g., maintain a balanced diet, stay hydrated, engage in regular physical activity).
`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
