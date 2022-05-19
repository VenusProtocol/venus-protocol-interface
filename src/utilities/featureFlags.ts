import { TokenId } from 'types';

export const DISABLED_TOKENS = ['luna', 'ust'];

export const isTokenEnabled = (assetId: TokenId) => !DISABLED_TOKENS.includes(assetId);
