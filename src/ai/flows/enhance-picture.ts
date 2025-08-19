import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const enhancePictureSchema = z.object({
  enhancedImageUrl: z.string().describe('The enhanced image with white background'),
  success: z.boolean().describe('Whether the enhancement was successful'),
  message: z.string().describe('Status message about the enhancement process')
});

type EnhancePictureInput = {
  imageUrl: string;
  patientName: string;
};

export async function enhancePatientPicture(input: EnhancePictureInput) {
  try {
    const { enhancedImageUrl, success, message } = await generateObject({
      model: openai('gpt-4o'),
      schema: enhancePictureSchema,
      prompt: `
You are an AI image enhancement specialist for medical ID cards. Your task is to enhance a patient photograph for use in a professional medical ID card.

Patient Information:
- Name: ${input.patientName}
- Image URL: ${input.imageUrl}

Requirements for enhancement:
1. Create a clean, professional white background
2. Maintain the patient's facial features and identity
3. Ensure proper lighting and contrast for ID card use
4. Remove any distracting background elements
5. Optimize for small ID card photo size (passport photo style)
6. Maintain appropriate resolution for PDF printing

Image Enhancement Goals:
- Professional medical ID appearance
- Clear facial recognition
- White/neutral background
- Proper exposure and contrast
- Centered composition

Please process the image and provide:
1. Enhanced image URL with white background
2. Success status
3. Brief message about the enhancement process

Note: This is for legitimate medical ID card purposes in a healthcare management system.
      `,
    });

    return {
      enhancedImageUrl,
      success,
      message
    };
  } catch (error) {
    console.error('Error enhancing patient picture:', error);
    return {
      enhancedImageUrl: input.imageUrl, // Fallback to original
      success: false,
      message: 'Failed to enhance image, using original'
    };
  }
}

// Helper function to convert image to base64 for PDF embedding
export async function imageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}