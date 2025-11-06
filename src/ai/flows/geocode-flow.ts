'use server';
/**
 * @fileOverview A flow for geocoding location names.
 *
 * - geocode - A function that converts a location name into coordinates.
 * - GeocodeInput - The input type for the geocode function.
 * - GeocodeOutput - The return type for the geocode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeocodeInputSchema = z.object({
  location: z.string().describe('The name of the location to geocode, e.g., "Paris, France".'),
});
export type GeocodeInput = z.infer<typeof GeocodeInputSchema>;

const GeocodeOutputSchema = z.object({
  lat: z.number().describe('The latitude of the location.'),
  lng: z.number().describe('The longitude of the location.'),
});
export type GeocodeOutput = z.infer<typeof GeocodeOutputSchema>;

export async function geocode(input: GeocodeInput): Promise<GeocodeOutput> {
  return geocodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'geocodePrompt',
  input: { schema: GeocodeInputSchema },
  output: { schema: GeocodeOutputSchema },
  prompt: `You are a geocoding expert. Convert the following location name into its precise latitude and longitude.

Location: {{{location}}}`,
});

const geocodeFlow = ai.defineFlow(
  {
    name: 'geocodeFlow',
    inputSchema: GeocodeInputSchema,
    outputSchema: GeocodeOutputSchema,
  },
  async (input) => {
    if (!input.location) {
        return { lat: 0, lng: 0 };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
