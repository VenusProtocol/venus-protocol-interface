import type { LocalizedText } from 'types';

// Current locale if present, otherwise English (required by the API)
export const getLocalizedText = (text: LocalizedText | undefined, locale: string) =>
  text?.[locale] ?? text?.en ?? '';
