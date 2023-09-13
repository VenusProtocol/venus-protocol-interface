import { ChainId } from 'types';

import { TokenMapping } from '../../types';
import { tokens as bscMainnetTokens, venusTokens as bscMainnetVenusTokens } from './bscMainnet';
import { tokens as bscTestnetTokens, venusTokens as bscTestnetVenusTokens } from './bscTestnet';

export const venusTokens: TokenMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetVenusTokens,
  [ChainId.BSC_TESTNET]: bscTestnetVenusTokens,
};

export const tokens: TokenMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
};
