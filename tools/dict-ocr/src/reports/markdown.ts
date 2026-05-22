import type { PageDiff, FieldCheck, EntryDiff } from '../diff/json-diff.js';

const ICON = {
  match: '✅',
  normalized: '⚠️',
  mismatch: '❌',
  missing: '❌',
} as const;

function fenceJson(value: unknown): string {
  return '```json\n' + JSON.stringify(value, null, 2) + '\n```';
}

function fmtValue(v: unknown): string {
  if (v === null || v === undefined) return '`null`';
  if (typeof v === 'string') return '`' + v.replace(/`/g, '​`') + '`';
  return '`' + JSON.stringify(v) + '`';
}

function renderEntry(entry: EntryDiff): string {
  if (entry.status === 'missing-from-llm') {
    return [
      `### ❌ MISSING (id: ${entry.id})`,
      '',
      'LLM did not produce this entry.',
      '',
      '**Expected:**',
      fenceJson(entry.expected),
      '',
    ].join('\n');
  }
  if (entry.status === 'hallucination') {
    return [
      `### ⚠️ HALLUCINATION (id: ${entry.id})`,
      '',
      'LLM produced this entry, but ground truth has no match within its window.',
      '',
      '**Actual:**',
      fenceJson(entry.actual),
      '',
    ].join('\n');
  }

  const fieldRows = entry.fields
    .map((f) => `| ${ICON[f.status]} | \`${f.field}\` | ${fmtValue(f.expected)} | ${fmtValue(f.actual)} |`)
    .join('\n');

  const hasMismatch = entry.fields.some((f) => f.status !== 'match');
  const headerIcon = hasMismatch
    ? entry.fields.some((f) => f.status === 'mismatch')
      ? '❌'
      : '⚠️'
    : '✅';

  return [
    `### ${headerIcon} MATCHED (id: ${entry.id})`,
    '',
    '| | field | expected | actual |',
    '|---|---|---|---|',
    fieldRows,
    '',
  ].join('\n');
}

export function renderPageReport(diff: PageDiff): string {
  const lines: string[] = [];

  lines.push(`# OCR Quality — ${diff.type}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---|');
  lines.push(`| Ground truth entries | ${diff.total_gt_entries} |`);
  lines.push(`| Matched | ${diff.matched_entries} |`);
  lines.push(`| Coverage | **${diff.coverage}%** |`);
  lines.push(`| Hebrew accuracy (with nikkud) | **${diff.hebrew_with_nikkud_accuracy}%** |`);
  lines.push(`| Hebrew accuracy (normalized) | **${diff.hebrew_normalized_accuracy}%** |`);
  lines.push(`| Hallucinations | ${diff.hallucinations} |`);
  lines.push(`| Missing | ${diff.missing} |`);
  lines.push(`| Structure errors | ${diff.structure_errors} |`);
  lines.push('');

  lines.push('## Field accuracy');
  lines.push('');
  lines.push('| Field | Strict | Normalized | Total |');
  lines.push('|---|---|---|---|');
  for (const [field, s] of Object.entries(diff.field_accuracy)) {
    const strictPct = s.total === 0 ? 0 : Math.round((s.strict / s.total) * 10000) / 100;
    const normPct = s.total === 0 ? 0 : Math.round((s.normalized / s.total) * 10000) / 100;
    lines.push(`| \`${field}\` | ${strictPct}% (${s.strict}/${s.total}) | ${normPct}% (${s.normalized}/${s.total}) | ${s.total} |`);
  }
  lines.push('');

  lines.push('## Entries');
  lines.push('');
  for (const entry of diff.entries) {
    lines.push(renderEntry(entry));
  }

  return lines.join('\n');
}

export function renderSummary(diffs: PageDiff[]): string {
  const lines: string[] = [];
  lines.push('# Dictionary OCR — Summary');
  lines.push('');
  lines.push('| Type | Coverage | Hebrew (nikkud) | Hebrew (normalized) | Hallucinations | Missing | Structure errors |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const d of diffs) {
    lines.push(
      `| **${d.type}** | ${d.coverage}% | ${d.hebrew_with_nikkud_accuracy}% | ${d.hebrew_normalized_accuracy}% | ${d.hallucinations} | ${d.missing} | ${d.structure_errors} |`,
    );
  }
  lines.push('');
  lines.push('See per-type report for the detailed diff.');
  return lines.join('\n');
}
