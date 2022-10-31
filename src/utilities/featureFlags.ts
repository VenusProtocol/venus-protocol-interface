import { TOKENS } from 'constants/tokens';

export const DISABLED_TOKENS = [TOKENS.ust, TOKENS.luna];

export const isAssetEnabled = (assetId: string) =>
  !DISABLED_TOKENS.some(disabledToken => disabledToken.id === assetId);
