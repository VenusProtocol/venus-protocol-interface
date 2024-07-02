import { ChainId } from 'types';

export const zeroXApiUrl = {
  [ChainId.BSC_MAINNET]: 'https://bsc.api.0x.org/',
  [ChainId.ETHEREUM]: 'https://api.0x.org/',
  [ChainId.SEPOLIA]: 'https://sepolia.api.0x.org/',
  [ChainId.ARBITRUM_ONE]: 'https://arbitrum.api.0x.org/',
};

export const SLIPPAGE_TOLERANCE_PERCENTAGE = 0.5;
export const HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE = 5;
export const MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE = 10;
