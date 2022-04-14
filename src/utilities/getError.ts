import { t } from 'translation';

export const internalError = (errorMessage: string) =>
  new Error(t('errors.internal', { errorMessage }));
