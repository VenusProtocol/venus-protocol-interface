import { t } from 'libs/translations';

export const customErrorPhrases: Record<string, string> = {
  ActionPaused: t('contractErrors.actionPaused'),
  MarketNotListed: t('contractErrors.marketNotListed'),
  TokenInsufficientBalance: t('contractErrors.tokenInsufficientBalance'),
  TokenInsufficientCash: t('contractErrors.tokenInsufficientCash'),
};
