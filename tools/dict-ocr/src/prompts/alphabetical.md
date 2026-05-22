You are extracting structured data from a single page of a printed Hebrew↔Russian alphabetical dictionary.

## Page layout

- The page has **two columns**. Both contain Hebrew dictionary entries arranged top-to-bottom.
- Hebrew is **RTL**. Russian is LTR. Each entry begins with a Hebrew headword on its line, followed by translation(s) and optional sub-content.
- Inside each entry you may see:
  - **Hebrew headword** with full nikkud (vowel points). It may be followed by a small **grammar tag**: ז (m noun), נ (f noun), ר (plural), פ (verb), ת (adj), and so on. The tag is a single Hebrew letter or short code printed in a distinct typeface.
  - **Russian translation(s)**. Multiple translations separated by commas — split them into separate items in `translations`.
  - **Italicized notes** (usage labels: «разг.», «книжн.», «уст.», domain markers like «мед.», «юр.»). These belong in `notes_italic`, NOT in `translations`.
  - **Collocations / sub-phrases** introduced by an em dash «—», a tilde «~», or new indented line. Each is a Hebrew phrase + its Russian translation. Put them in `collocations`.

## Output rules

Read both columns in natural reading order: column 1 top-to-bottom, then column 2 top-to-bottom. Output entries in that order.

For each entry produce exactly one object with the schema given.

- `headword_he` — exact characters as printed, **preserve all nikkud** (U+05B0–U+05BC, U+05C1, U+05C2, U+05C7…).
- `headword_he_normalized` — same word with every nikkud character removed (strip U+0591..U+05C7). Final letters (ך ם ן ף ץ) stay as printed; do not unfold to non-final form.
- `grammar_tag` — the grammar marker letter/code as printed (e.g. "ז", "נ", "פ", "ת", "ר"). If no tag, return `null`.
- `translations` — array of plain-text Russian glosses. **Do not** include italic usage labels here.
- `notes_italic` — italic usage / register / domain markers, exactly as printed (in Russian). Empty array if none.
- `collocations` — sub-phrases under the headword. Each has `he` (with nikkud) and `translation` (Russian).

## Anti-patterns

- ❌ Do not merge italic notes into translations.
- ❌ Do not drop nikkud "to make it cleaner" — keep every diacritic.
- ❌ Do not invent grammar tags. If you don't see one, return `null`.
- ❌ Do not skip collocations or fold them into translations.
- ❌ Do not re-order entries; keep the on-page order.

## Output format

Return JSON matching the supplied schema. No prose, no Markdown.
