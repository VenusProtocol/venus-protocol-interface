import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

import i18nextParserConfig from '../../../apps/evm/i18next-parser.config.js';

const syncTranslationsCommand = '/skill:sync-translations';
const englishTranslationsPath = 'apps/evm/src/libs/translations/translations/en.json';

export default function syncTranslations(pi: ExtensionAPI) {
  pi.on('input', async (event, ctx) => {
    const [command] = event.text.trim().split(/\s+/);

    if (command !== syncTranslationsCommand) {
      return { action: 'continue' };
    }

    ctx.ui.setStatus('sync-translations', 'Preparing English translation diff');

    try {
      const extractionResult = await pi.exec('yarn', ['extract-translations'], {
        cwd: ctx.cwd,
      });

      if (extractionResult.code !== 0) {
        const message =
          extractionResult.stderr.trim() ||
          extractionResult.stdout.trim() ||
          `exited with status ${extractionResult.code}`;

        ctx.ui.notify(`Translation extraction failed: ${message}`, 'error');
        return { action: 'handled' };
      }

      const validationResult = await pi.exec(
        'git',
        ['grep', '-n', i18nextParserConfig.defaultValue, '--', englishTranslationsPath],
        { cwd: ctx.cwd },
      );

      if (validationResult.code === 0) {
        return {
          action: 'transform',
          text: `${
            event.text
          }\n\n<ENGLISH_TRANSLATION_ERRORS>\n${validationResult.stdout.trim()}\n</ENGLISH_TRANSLATION_ERRORS>`,
        };
      }

      if (validationResult.code !== 1) {
        const message =
          validationResult.stderr.trim() ||
          validationResult.stdout.trim() ||
          `exited with status ${validationResult.code}`;

        ctx.ui.notify(`Could not validate the English translations: ${message}`, 'error');
        return { action: 'handled' };
      }

      const baseResult = await pi.exec('git', ['merge-base', 'HEAD', 'origin/HEAD'], {
        cwd: ctx.cwd,
      });

      if (baseResult.code !== 0) {
        const message =
          baseResult.stderr.trim() ||
          baseResult.stdout.trim() ||
          `exited with status ${baseResult.code}`;

        ctx.ui.notify(`Could not determine the comparison base: ${message}`, 'error');
        return { action: 'handled' };
      }

      const baseCommit = baseResult.stdout.trim();
      const diffResult = await pi.exec('git', ['diff', baseCommit, '--', englishTranslationsPath], {
        cwd: ctx.cwd,
      });

      if (diffResult.code !== 0) {
        const message =
          diffResult.stderr.trim() ||
          diffResult.stdout.trim() ||
          `exited with status ${diffResult.code}`;

        ctx.ui.notify(`Could not prepare the English diff: ${message}`, 'error');
        return { action: 'handled' };
      }

      const englishDiff = diffResult.stdout.trim() || 'No English translation changes detected.';

      return {
        action: 'transform',
        text: `${event.text}\n\n<ENGLISH_DIFF>\n${englishDiff}\n</ENGLISH_DIFF>`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      ctx.ui.notify(`Could not prepare the English diff: ${message}`, 'error');
      return { action: 'handled' };
    } finally {
      ctx.ui.setStatus('sync-translations', undefined);
    }
  });
}
