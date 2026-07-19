---
name: sync-translations
description: Synchronize the Venus EVM locale JSON files from the English source of truth.
---

# Sync Translations

Synchronize `apps/evm/src/libs/translations/translations/*.json` while preserving the repository's
locale vocabulary, interpolation variables, and markup placeholders.

## Workflow

1. Run from the repository root.
2. Read `AGENTS.md` and every repository instruction file it references before editing.
3. Check for incomplete English translations:

   - If the prompt contains an `<ENGLISH_TRANSLATION_ERRORS>` block, display every listed key and
     value to the user.
   - Tell the user to complete those English translations, then run `/skill:sync-translations`
     again.
   - Return immediately. Do not inspect or update any other locale.

4. Prepare the English diff:

   - If the prompt contains an `<ENGLISH_DIFF>` block, use it. Translation extraction has already
     run.
   - If the block is missing, do not ask the user for it. Run `yarn extract-translations`, determine
     the comparison base with `git merge-base HEAD origin/HEAD`, then run:

     ```sh
     git diff <comparison-base> -- apps/evm/src/libs/translations/translations/en.json
     ```

   - Treat that command's output as the English diff. If it is empty, report that no English
     translation changes were detected and stop.
5. Use that diff as the scope and `en.json` as the source of truth:

   - Identify added and modified English entries from the diff.
   - Inspect the corresponding entries and plural variants in every other locale.
   - Translate `TRANSLATION NEEDED` values.
   - Decide whether existing translations need updating based on the meaning of the English change.
   - Do not rewrite a locale merely because its wording differs literally.
   - Reuse terminology and tone from nearby entries in the same locale.

6. Preserve the translation contract exactly:

   - Keep interpolation expressions such as `{{amount}}` and `{{ date, textual }}` unchanged.
   - Keep markup tokens such as `<Link>`, `</Link>`, and `<LineBreak/>` unchanged and balanced.
   - Keep product names, token symbols, URLs, and technical identifiers unchanged unless the locale
     already has an established equivalent.
   - Edit values only. Do not translate or rename JSON keys.
   - Keep the scope limited to English keys shown in the diff.

7. Validate the result:

   ```sh
   node -e 'const fs=require("fs");const d="apps/evm/src/libs/translations/translations";for(const f of fs.readdirSync(d).filter(f=>f.endsWith(".json")))JSON.parse(fs.readFileSync(`${d}/${f}`,"utf8"))'
   git diff --check
   ```

8. Format the translation files as the final mutating command:

   ```sh
   yarn workspace @venusprotocol/evm biome format --write src/libs/translations/translations
   ```

9. Inspect the final diff. Confirm that:

   - Every English entry shown by the diff was semantically checked in every locale variant.
   - No corresponding locale value still contains `TRANSLATION NEEDED`.
   - Interpolation and markup tokens still match the English source.
   - No unrelated locale entries changed.
