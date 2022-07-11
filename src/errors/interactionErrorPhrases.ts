import { t } from 'translation';

export const interactionErrorPhrases = {
  collateralRequired: t('markets.errors.collateralRequired'),
  collateralEnableError: (args: { assetName: string }) =>
    t('markets.errors.collateralEnableError', args),
  collateralDisableError: (args: { assetName: string }) =>
    t('markets.errors.collateralDisableError', args),
  accountError: t('markets.errors.accountError'),
  createProposalFailed: t('vote.createProposalForm.submitError'),
  unsupportedWallet: t('wallets.errors.unsupportedWallet'),
  authorizeAccess: t('wallets.errors.authorizeAccess'),
  noProvider: t('wallets.errors.noProvider'),
};
