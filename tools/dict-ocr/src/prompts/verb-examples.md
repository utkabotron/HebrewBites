You are extracting verb usage examples from a single page of a Hebrew dictionary.

## Page layout

- The page has **vertical blocks**, each headed by one Hebrew verb. Multiple verbs (each with a different `binyan`) may sit on the same page.
- Inside each block you'll see **5–7 example sentences** arranged in **three parallel columns**:
  - **Left column:** Russian sentence.
  - **Middle column:** Latin transliteration.
  - **Right column:** Hebrew sentence (RTL), with nikkud.
- The three columns are **aligned line-by-line** — row N in each column is the same sentence in a different writing system. Preserve this alignment.

## Output rules

- `headword_he` — Hebrew verb headword with nikkud, exactly as printed.
- `headword_he_normalized` — same word with nikkud (U+0591..U+05C7) stripped.
- `headword_translation_ru` — Russian translation of the headword (printed next to or above it).
- `conjugation_pattern` — binyan label printed near the headword: פעל / פיעל / נפעל / הפעיל / etc.
- `examples` — array of rows. Each row is `{ ru, translit, he }`. **Each row must correspond to a single horizontal line across all three columns.**

## Alignment rule (critical)

If a sentence in one column wraps onto two physical lines on the page, treat it as ONE row — merge the wrapped lines so each `examples[i]` is a single complete sentence. **Never split one sentence into two rows** just because of visual wrapping.

## Order

Read verbs top-to-bottom on the page. Within each verb, read examples top-to-bottom.

## Anti-patterns

- ❌ Do not swap ru/translit/he columns. The Hebrew column is on the right (RTL).
- ❌ Do not skip rows or invent rows.
- ❌ Do not drop nikkud from `he`.
- ❌ Do not split a wrapped sentence into two rows.
- ❌ Do not merge two different sentences into one row.

## Output format

Return JSON matching the supplied schema. No prose, no Markdown.
