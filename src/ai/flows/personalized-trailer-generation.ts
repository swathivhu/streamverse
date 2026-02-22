'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized trailer snippets
 * based on user viewing history for the StreamVerse application.
 *
 * - generatePersonalizedTrailer - A function that triggers the trailer generation process.
 * - PersonalizedTrailerGenerationInput - The input type for the trailer generation.
 * - PersonalizedTrailerGenerationOutput - The return type for the trailer generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTrailerGenerationInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting the trailer.'),
  viewingHistory:
    z.array(z.string()).describe('A list of movie titles or genres previously watched by the user.'),
});
export type PersonalizedTrailerGenerationInput = z.infer<
  typeof PersonalizedTrailerGenerationInputSchema
>;

const PersonalizedTrailerGenerationOutputSchema = z.object({
  trailerDescription:
    z.string().describe('A textual description of the generated trailer snippet.'),
  isPersonalized:
    z.boolean().describe('True if the trailer was personalized based on viewing history, false otherwise.'),
  reasoning:
    z.string().describe('Explanation for why the trailer was personalized or generic.'),
});
export type PersonalizedTrailerGenerationOutput = z.infer<
  typeof PersonalizedTrailerGenerationOutputSchema
>;

export async function generatePersonalizedTrailer(
  input: PersonalizedTrailerGenerationInput
): Promise<PersonalizedTrailerGenerationOutput> {
  return personalizedTrailerGenerationFlow(input);
}

const trailerPrompt = ai.definePrompt({
  name: 'personalizedTrailerPrompt',
  input: {schema: PersonalizedTrailerGenerationInputSchema},
  output: {schema: PersonalizedTrailerGenerationOutputSchema},
  prompt: `You are an AI assistant for a streaming service called StreamVerse. Your task is to generate short, engaging trailer snippets for movies or TV shows.

User ID: {{{userId}}}

Viewing History:
{{#if viewingHistory.length}}
  {{#each viewingHistory}}
  - {{{this}}}
  {{/each}}
{{else}}
  No viewing history available.
{{/if}}

Based on the provided viewing history, decide if you can generate a personalized trailer snippet.
If the viewing history contains at least 3 items, consider it sufficient for personalization.
Otherwise, generate a generic, exciting trailer for a popular, high-quality movie/show.

Rules:
- Keep the trailer snippet concise and enticing.
- Do not mention "viewing history" or "personalization" directly in the trailer description itself.
- Ensure the 'isPersonalized' field is set to true if the trailer was generated using the viewing history, and false if it's generic.
- Provide a clear 'reasoning' for your decision (e.g., "Personalized based on diverse viewing history." or "Generic trailer due to insufficient viewing history.").

Generate a trailer snippet in JSON format:
`,
});

const personalizedTrailerGenerationFlow = ai.defineFlow(
  {
    name: 'personalizedTrailerGenerationFlow',
    inputSchema: PersonalizedTrailerGenerationInputSchema,
    outputSchema: PersonalizedTrailerGenerationOutputSchema,
  },
  async input => {
    const {output} = await trailerPrompt(input);
    return output!;
  }
);
