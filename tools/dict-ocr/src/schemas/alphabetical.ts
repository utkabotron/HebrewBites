import { z } from 'zod';

export const CollocationSchema = z.object({
  he: z.string().describe('Hebrew phrase, may include nikkud'),
  translation: z.string().describe('Russian translation of the phrase'),
});

export const AlphabeticalEntrySchema = z.object({
  headword_he: z
    .string()
    .describe('Hebrew headword WITH nikkud as printed in the dictionary'),
  headword_he_normalized: z
    .string()
    .describe(
      'Same headword with all nikkud stripped (U+0591..U+05C7 removed). Final letters kept as printed.',
    ),
  grammar_tag: z
    .string()
    .nullable()
    .describe(
      'Grammar marker printed near the headword: ז (m noun), נ (f noun), פ (verb), ת (adj), etc. Null if absent.',
    ),
  translations: z
    .array(z.string())
    .describe(
      'Plain-text Russian translations. Each comma-separated meaning becomes its own item.',
    ),
  notes_italic: z
    .array(z.string())
    .describe(
      'Italicized notes / usage labels (style, register, domain). Empty array if none.',
    ),
  collocations: z
    .array(CollocationSchema)
    .describe(
      'Sub-phrases under the headword (lines following an em dash, idioms, set expressions). Empty array if none.',
    ),
});

export const AlphabeticalPageSchema = z.object({
  entries: z.array(AlphabeticalEntrySchema),
});

export type AlphabeticalEntry = z.infer<typeof AlphabeticalEntrySchema>;
export type AlphabeticalPage = z.infer<typeof AlphabeticalPageSchema>;

// Plain-JSON schema for Gemini responseSchema (no zod-specific types).
export const alphabeticalResponseSchema = {
  type: 'object',
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          headword_he: { type: 'string' },
          headword_he_normalized: { type: 'string' },
          grammar_tag: { type: 'string', nullable: true },
          translations: { type: 'array', items: { type: 'string' } },
          notes_italic: { type: 'array', items: { type: 'string' } },
          collocations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                he: { type: 'string' },
                translation: { type: 'string' },
              },
              required: ['he', 'translation'],
            },
          },
        },
        required: [
          'headword_he',
          'headword_he_normalized',
          'grammar_tag',
          'translations',
          'notes_italic',
          'collocations',
        ],
      },
    },
  },
  required: ['entries'],
} as const;
