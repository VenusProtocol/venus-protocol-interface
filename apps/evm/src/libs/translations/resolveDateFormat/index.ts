import type { DateFormatType, SupportedLanguage } from '../constants';

export const resolveDateFormat = (language: SupportedLanguage, format?: string) => {
  const normalizedFormat = format?.trim();

  if (!normalizedFormat) {
    return language.dateFormats.textual;
  }

  if (normalizedFormat === 'distanceToNow') {
    return normalizedFormat;
  }

  if (normalizedFormat in language.dateFormats) {
    return language.dateFormats[normalizedFormat as DateFormatType];
  }

  return normalizedFormat;
};
