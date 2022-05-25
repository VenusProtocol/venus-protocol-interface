import { TokenId } from 'types';

export const DISABLED_TOKENS = ['luna', 'ust'];

export const isAssetEnabled = (assetId: TokenId) => !DISABLED_TOKENS.includes(assetId);
