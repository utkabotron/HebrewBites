# dict-ocr — Hebrew Dictionary OCR Quality Test

Standalone Node-скрипт, изолирован от RN-приложения. Проверяет, насколько точно Gemini переносит структуру и содержание трёх разных типов словарных страниц (в `TAL/dictionary/`).

Это **не production-pipeline**. Цель — за один прогон оценить качество извлечения на 3 сэмплах и понять, можно ли строить массовый импорт.

## Что тестируется

| Тип | PDF | Что внутри |
|---|---|---|
| `alphabetical` | `CCF_000567.pdf` стр. 1 | 2 колонки, ~80 коротких статей: слово, перевод, грамм. теги, пометы курсивом, коллокации |
| `conjugation` | `CCF_000569.pdf` стр. 1 | Сетка спряжений: корень+биньян → инфинитив, отглагольное сущ-е, времена × лица |
| `verb-examples` | `CCF_000570.pdf` стр. 1 | Заголовок-глагол + 5–7 параллельных предложений в 3 колонки (рус / транслит / иврит) |

## Установка

```bash
cd tools/dict-ocr
npm install
cp .env.example .env
# Открой .env. GEMINI_API_KEY и LLM_MODEL подсматриваем у vibe-kp:
#   /Users/pavelbrick/Projects/07_Vibe/vibe-kp/.env
# Берём GEMINI_API_KEY как есть и копируем GEMINI_MODEL в LLM_MODEL.
```

> **Важно.** На момент написания плана в `vibe-kp/.env` лежал плейсхолдер
> (`AIzaSyDj_your_key_here`) — настоящий ключ нужно вписать вручную.
> Реквизиты не комитим: `.env` в `.gitignore`.

## Ground truth (ручные эталоны)

Прогон сравнивает вывод Gemini с **частичным** эталоном. Эталон покрывает только начало страницы — этого достаточно для оценки структуры.

Перед первым прогоном заполни:

| Файл | Что должно быть |
|---|---|
| `fixtures/ground-truth/alphabetical.json` | Первые 15 словарных статей со стр. 1 файла 567 |
| `fixtures/ground-truth/conjugation.md` | Полная таблица спряжений глагола גמר |
| `fixtures/ground-truth/verb-examples.json` | 1–2 глагола (אבד פעל + אבד פיעל) с 5–7 примерами в каждом |

В каждом файле уже лежит шаблон-заглушка с нужной структурой и комментарием TODO.

## Запуск

```bash
npm run test:dict
```

Прогонит 3 страницы последовательно. Промежуточные артефакты:

```
fixtures/images/        ← PNG-рендеры (gitignored)
output/extractions/     ← сырой JSON от Gemini (gitignored)
output/reports/         ← Markdown-отчёты ✅ КОММИТИМ
  ├── alphabetical.md
  ├── conjugation.md
  ├── verb-examples.md
  └── summary.md        ← сводная таблица метрик
```

Один тип можно прогнать отдельно:

```bash
npm run test:dict:one -- alphabetical
```

## Что значат метрики

| Метрика | Смысл |
|---|---|
| **coverage** | `matched_entries / ground_truth_entries`. Сколько эталонных записей нашлось в выводе LLM (по identity-полю). |
| **field_accuracy** | Для каждого поля эталона: % точных совпадений на множестве matched_entries. |
| **hebrew_with_nikkud_accuracy** | Строгое совпадение по символам, включая огласовки (U+0591..U+05C7). Для словаря огласовки критичны. |
| **hebrew_normalized_accuracy** | Совпадение после `strip-nikkud` и нормализации финальных букв. Показывает, «понимает» ли модель слово, даже если теряет nikkud. |
| **hallucinations** | Записи в выводе LLM, которым нет соответствия в эталоне (учитываются только в пределах диапазона эталона — т.е. первые N записей по позиции). |
| **structure_errors** | Для `conjugation` — пропущенные / перепутанные ячейки таблицы. Для `verb-examples` — рассинхрон параллельных строк рус/транслит/иврит. |

В per-page отчёте есть таблица расхождений с подсветкой ✅ / ⚠️ (совпало после нормализации, но не строго) / ❌ (не совпало), плюс side-by-side для проблемных записей.

## Identity-маппинг

Чтобы сопоставить «эта запись в выводе» с «той записью в эталоне»:

| Тип | Identity |
|---|---|
| `alphabetical` | `headword_he_normalized` (иврит без огласовок) |
| `conjugation` | `root` + `binyan` |
| `verb-examples` | `headword_he_normalized` + `conjugation_pattern` (биньян) |

## Конфиг и переключатели

В `.env`:

- `LLM_MODEL` — модель Gemini. Дефолт `gemini-3-flash-preview` (то же, что в vibe-kp). Поменять на `gemini-2.5-pro` для сравнения.
- `GEMINI_USE_NATIVE_PDF=true` — отправить PDF-страницу напрямую без рендера в PNG (vibe-kp так делает для файлов <50MB). Дефолт `false` — для теста мы используем PNG, чтобы было что глазами проверять в `fixtures/images/`.
- `PDF_ZOOM_LEVEL` — множитель рендера (vibe-kp: 2.0).
- `PDF_MAX_IMAGE_SIZE` — крышка на максимальный размер по большей стороне (vibe-kp: 2048).

## Куда смотреть при отладке

| Симптом | Где править |
|---|---|
| LLM путает структуру (notes попали в translations) | `src/prompts/<type>.md` |
| LLM возвращает поля, не описанные в схеме | `src/schemas/<type>.ts` |
| 429 / timeout | `src/extractors/gemini.ts` — `GEMINI_MAX_RETRIES`, backoff |
| Иврит не совпадает из-за невидимых символов (U+200E, U+200F, финальные буквы) | `src/diff/normalize-hebrew.ts` |
| Все 3 отчёта 0% accuracy | Проверь эталон в `fixtures/ground-truth/` |

## Что НЕ делает этот тул

- Не пишет в БД, не интегрируется в RN-приложение.
- Не трогает vibe-kp (используется только API-ключ).
- Не запускает массовый импорт всей книги — это следующий этап после валидации качества.
