import { MAINNET_TOKENS } from '../common/mainnet';
import { MAINNET_PANCAKE_SWAP_TOKENS } from './mainnetPancakeSwapTokens';

// Temporary fix to exclude TUSD as liquidities are low in PancakeSwap V2
const {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  tusd: _tusd,
  ...filteredPancakeSwapTokens
} = {
  ...MAINNET_PANCAKE_SWAP_TOKENS,
  ...MAINNET_TOKENS,
};

export const MAINNET_SWAP_TOKENS = filteredPancakeSwapTokens;
