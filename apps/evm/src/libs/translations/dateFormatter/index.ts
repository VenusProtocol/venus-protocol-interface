import { format as formatDate, formatDistanceStrict, isDate } from 'date-fns';
import type { FormatterModule } from 'i18next';

import { supportedLanguages } from '../constants';
import { resolveDateFormat } from '../resolveDateFormat';

export const dateFormatter: FormatterModule = {
  type: 'formatter',
  init: () => {},
  add: () => {},
  addCached: () => {},
  format: (value, format, tag) => {
    if (!isDate(value)) {
      return value;
    }

    const language =
      supportedLanguages.find(language => language.bcp47Tag === tag) ?? supportedLanguages[0];
    const options = { locale: language.locale };
    const resolvedFormat = resolveDateFormat(language, format);

    if (resolvedFormat === 'distanceToNow') {
      return formatDistanceStrict(value, new Date(), options);
    }

    return formatDate(value, resolvedFormat, options);
  },
};
