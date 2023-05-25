import { MAINNET_TOKENS } from '../common/mainnet';
import { MAINNET_PANCAKE_SWAP_TOKENS } from './mainnetPancakeSwapTokens';

export const MAINNET_SWAP_TOKENS = {
  ...MAINNET_PANCAKE_SWAP_TOKENS,
  ...MAINNET_TOKENS,
};
