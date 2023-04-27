import { MAINNET_TOKENS } from 'constants/tokens';

export const DISABLED_TOKENS = [
  MAINNET_TOKENS.ust,
  MAINNET_TOKENS.luna,
  MAINNET_TOKENS.sxp,
  MAINNET_TOKENS.trxold,
  MAINNET_TOKENS.beth,
];

export const isAssetEnabled = (assetId: string) =>
  !DISABLED_TOKENS.some(disabledToken => disabledToken.id === assetId);
