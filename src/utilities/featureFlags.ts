import { TOKENS } from 'constants/tokens';

export const DISABLED_TOKENS = [TOKENS.ust, TOKENS.luna, TOKENS.sxp];

export const isAssetEnabled = (assetId: string) =>
  !DISABLED_TOKENS.some(disabledToken => disabledToken.id === assetId);
