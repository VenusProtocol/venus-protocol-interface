import { ChainId } from '@venusprotocol/chains';

import { tokens as bscMainnetTokens } from 'generated/pancakeSwapTokens/bscMainnet';
import type { TokenMapping } from 'types';

import { tokens as arbitrumOneTokens } from './arbitrumOne';
import { tokens as arbitrumSepoliaTokens } from './arbitrumSepolia';
import { tokens as bscTestnetTokens } from './bscTestnet';
import { tokens as ethereumTokens } from './ethereum';
import { tokens as opBnbMainnetTokens } from './opBnbMainnet';
import { tokens as opBnbTestnetTokens } from './opBnbTestnet';
import { tokens as sepoliaTokens } from './sepolia';

export const pancakeSwapTokens: TokenMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetTokens,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetTokens,
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.SEPOLIA]: sepoliaTokens,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepoliaTokens,
  [ChainId.ARBITRUM_ONE]: arbitrumOneTokens,
};
