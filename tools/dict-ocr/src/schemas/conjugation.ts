import { z } from 'zod';

export const PersonForms = [
  'אני',
  'אתה',
  'את',
  'הוא',
  'היא',
  'אנחנו',
  'אתם',
  'אתן',
  'הם',
  'הן',
] as const;

export const ConjugatedFormSchema = z.object({
  person: z
    .string()
    .describe(
      'One of: אני / אתה / את / הוא / היא / אנחנו / אתם / אתן / הם / הן. ' +
        'For imperative use אתה / את / אתם / אתן.',
    ),
  he: z.string().describe('Conjugated form in Hebrew, with nikkud'),
  translit: z.string().describe('Latin transliteration as printed'),
  translation_ru: z
    .string()
    .nullable()
    .describe('Russian translation of the form, if printed in the book. Null otherwise.'),
});

export const ConjugationEntrySchema = z.object({
  root: z.string().describe('Three- or four-letter Hebrew root, e.g. "גמר"'),
  binyan: z
    .string()
    .describe(
      'Binyan name as printed: פעל / נפעל / פיעל / פועל / הפעיל / הופעל / התפעל',
    ),
  infinitive_he: z.string().describe('Infinitive with nikkud, e.g. "לִגְמֹר"'),
  infinitive_translit: z.string(),
  gerund_he: z
    .string()
    .nullable()
    .describe('Verbal noun (שם פעולה) with nikkud, e.g. "גְּמִירָה". Null if absent.'),
  gerund_translit: z.string().nullable(),
  tenses: z.object({
    past: z.array(ConjugatedFormSchema).describe('עבר'),
    present: z.array(ConjugatedFormSchema).describe('הווה'),
    future: z.array(ConjugatedFormSchema).describe('עתיד'),
    imperative: z.array(ConjugatedFormSchema).describe('ציווי'),
  }),
});

export const ConjugationPageSchema = z.object({
  entries: z.array(ConjugationEntrySchema),
});

export type ConjugationEntry = z.infer<typeof ConjugationEntrySchema>;
export type ConjugationPage = z.infer<typeof ConjugationPageSchema>;

const formItem = {
  type: 'object',
  properties: {
    person: { type: 'string' },
    he: { type: 'string' },
    translit: { type: 'string' },
    translation_ru: { type: 'string', nullable: true },
  },
  required: ['person', 'he', 'translit', 'translation_ru'],
};

export const conjugationResponseSchema = {
  type: 'object',
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          root: { type: 'string' },
          binyan: { type: 'string' },
          infinitive_he: { type: 'string' },
          infinitive_translit: { type: 'string' },
          gerund_he: { type: 'string', nullable: true },
          gerund_translit: { type: 'string', nullable: true },
          tenses: {
            type: 'object',
            properties: {
              past: { type: 'array', items: formItem },
              present: { type: 'array', items: formItem },
              future: { type: 'array', items: formItem },
              imperative: { type: 'array', items: formItem },
            },
            required: ['past', 'present', 'future', 'imperative'],
          },
        },
        required: [
          'root',
          'binyan',
          'infinitive_he',
          'infinitive_translit',
          'gerund_he',
          'gerund_translit',
          'tenses',
        ],
      },
    },
  },
  required: ['entries'],
} as const;
