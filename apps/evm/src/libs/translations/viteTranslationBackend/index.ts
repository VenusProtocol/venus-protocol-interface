import type { BackendModule } from 'i18next';

import { loadTranslations } from '../loadTranslations';

export const viteTranslationBackend: BackendModule = {
  type: 'backend',
  init: () => {},
  read: (language, namespace, callback) => {
    if (namespace !== 'translation') {
      callback(null, {});
      return;
    }

    loadTranslations(language)
      .then(translations => callback(null, translations))
      .catch(error => callback(error, false));
  },
};
