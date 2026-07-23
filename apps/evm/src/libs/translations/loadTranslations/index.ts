import type { ResourceLanguage } from 'i18next';

import enTranslations from '../translations/en.json';

const translationLoaders = import.meta.glob<{ default: ResourceLanguage }>([
  '../translations/*.json',
  '!../translations/en.json',
]);

export const loadTranslations = async (bcp47Tag: string): Promise<ResourceLanguage> => {
  const loader = translationLoaders[`../translations/${bcp47Tag}.json`];

  if (!loader) {
    return enTranslations;
  }

  const translationsModule = await loader();

  return translationsModule.default;
};

export { enTranslations };
