---
name: translation
description: Extract and complete i18n translations for the Venus EVM app. Use when asked to run yarn extract-translations, update locale JSON files under apps/evm/src/libs/translations/translations, and translate keys language-by-language using English (en.json) as the source of truth.
---

# Translation

Execute this workflow from repository root unless asked otherwise.

## 1) Refresh extracted keys

1. Run `yarn extract-translations` from repo root.
2. Confirm files changed under `apps/evm/src/libs/translations/translations`.

## 2) Treat English as source of truth

1. Open `apps/evm/src/libs/translations/translations/en.json`.
2. Treat every key and placeholder token (for example `{{amount}}`, `<LineBreak/>`, `<Link>`) as canonical.
3. Never change keys, object structure, or placeholder tokens in non-English locale files.

## 3) Translate locale files one-by-one

For each locale file (`<locale>.json`) under `apps/evm/src/libs/translations/translations`:

1. Compare against `en.json` and find keys where the locale value is exactly `TRANSLATION NEEDED` or identical to the raw fallback when translation is missing.
2. Translate each missing entry to the target language.
3. Preserve interpolation and markup tokens exactly as in English (`{{...}}`, `<Tag>...</Tag>`, self-closing tags).
4. Keep product names, symbols, acronyms, and chain names unchanged unless there is a clear localized convention.
5. Keep tone concise and product-UI appropriate.

## 4) Validate before handoff

1. Ensure every locale JSON remains valid JSON.
2. Ensure no English placeholders were broken or removed.
3. Report which locale files were updated and summarize notable terminology decisions.

## Execution notes

- Do not add new locales unless explicitly requested.
- If a source English string is ambiguous, ask for clarification before translating that key.
- Prefer deterministic edits: only touch translation files that need updates.
