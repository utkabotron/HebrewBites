You are extracting verb conjugation tables from a single page of a Hebrew grammar reference.

## Page layout

- The page contains one or more **verb conjugation tables**. Each table is keyed by `root + binyan`.
- For each verb you'll see:
  - **Root** in Hebrew (three or four letters, e.g. גמר).
  - **Binyan** name: פעל / נפעל / פיעל / פועל / הפעיל / הופעל / התפעל.
  - **Infinitive** (e.g. לִגְמֹר) with Latin transliteration.
  - Optionally **gerund / verbal noun** (שם פעולה) (e.g. גְּמִירָה) with transliteration.
  - Four tense blocks: **past (עבר), present (הווה), future (עתיד), imperative (ציווי)**.
- Each tense block is a small table: person column on one side, Hebrew form (with nikkud), transliteration, and sometimes a Russian gloss.
- The page is **bilingual**: Hebrew columns are RTL, Russian/Latin columns are LTR. Do not lose the row-by-row alignment between the Hebrew form and its transliteration.

## Person labels

Use **only** these Hebrew person markers in `person`:

- Past / Future / Present: אני, אתה, את, הוא, היא, אנחנו, אתם, אתן, הם, הן
- Imperative: אתה, את, אתם, אתן

If the printed table has a combined row (e.g. הוא/היא or הם/הן with one form), still output one form per person — duplicate the values across both persons.

## Output rules

- `root` — letters as printed, no nikkud (e.g. "גמר").
- `binyan` — printed binyan name (e.g. "פעל").
- `infinitive_he` — with nikkud as printed.
- `gerund_he` — with nikkud, or `null` if absent.
- For each tense, return an array of `{ person, he, translit }`.
  - `he` keeps all nikkud.
  - `translit` exactly as printed (Latin letters; preserve diacritics if any).
- Preserve the **on-page order of persons**.

## Anti-patterns

- ❌ Do not skip cells. If a cell is empty on the page, still output the person with empty strings.
- ❌ Do not collapse הוא/היא into one form.
- ❌ Do not drop nikkud.

## Output format

Return JSON matching the supplied schema. No prose, no Markdown.
