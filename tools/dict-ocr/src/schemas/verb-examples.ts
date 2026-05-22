import { z } from 'zod';

export const VerbExampleSchema = z.object({
  ru: z.string().describe('Russian sentence (left column)'),
  translit: z.string().describe('Latin transliteration (middle column)'),
  he: z.string().describe('Hebrew sentence with nikkud (right column)'),
});

export const VerbExamplesEntrySchema = z.object({
  headword_he: z
    .string()
    .describe('Hebrew verb headword with nikkud as printed at the top of the block'),
  headword_he_normalized: z
    .string()
    .describe('Same headword without nikkud (U+0591..U+05C7 stripped)'),
  headword_translation_ru: z
    .string()
    .describe('Russian translation of the headword'),
  conjugation_pattern: z
    .string()
    .describe(
      'Binyan / pattern label as printed near the headword: פעל / פיעל / נפעל / הפעיל / etc.',
    ),
  examples: z
    .array(VerbExampleSchema)
    .describe(
      'Parallel rows. Each row is one sentence in three languages aligned by line.',
    ),
});

export const VerbExamplesPageSchema = z.object({
  entries: z.array(VerbExamplesEntrySchema),
});

export type VerbExamplesEntry = z.infer<typeof VerbExamplesEntrySchema>;
export type VerbExamplesPage = z.infer<typeof VerbExamplesPageSchema>;

export const verbExamplesResponseSchema = {
  type: 'object',
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          headword_he: { type: 'string' },
          headword_he_normalized: { type: 'string' },
          headword_translation_ru: { type: 'string' },
          conjugation_pattern: { type: 'string' },
          examples: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                ru: { type: 'string' },
                translit: { type: 'string' },
                he: { type: 'string' },
              },
              required: ['ru', 'translit', 'he'],
            },
          },
        },
        required: [
          'headword_he',
          'headword_he_normalized',
          'headword_translation_ru',
          'conjugation_pattern',
          'examples',
        ],
      },
    },
  },
  required: ['entries'],
} as const;
