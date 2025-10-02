import { ChainId, type Token } from '../../types';

import { tokens as arbitrumOneTokens } from './arbitrumOne';
import { tokens as arbitrumSepoliaTokens } from './arbitrumSepolia';
import { tokens as baseMainnetTokens } from './baseMainnet';
import { tokens as baseSepoliaTokens } from './baseSepolia';
import { tokens as bscMainnetTokens } from './bscMainnet';
import { tokens as bscTestnetTokens } from './bscTestnet';
import { tokens as ethereumTokens } from './ethereum';
import { tokens as opBnbMainnetTokens } from './opBnbMainnet';
import { tokens as opBnbTestnetTokens } from './opBnbTestnet';
import { tokens as optimismMainnetTokens } from './optimismMainnet';
import { tokens as optimismSepoliaTokens } from './optimismSepolia';
import { tokens as sepoliaTokens } from './sepolia';
import { tokens as unichainMainnetTokens } from './unichainMainnet';
import { tokens as unichainSepoliaTokens } from './unichainSepolia';
import { tokens as zkSyncMainnetTokens } from './zkSyncMainnet';
import { tokens as zkSyncSepoliaTokens } from './zkSyncSepolia';

export const tokens: {
  [chainId in ChainId]: Token[];
} = {
  [ChainId.BSC_MAINNET]: bscMainnetTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetTokens,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetTokens,
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.SEPOLIA]: sepoliaTokens,
  [ChainId.ARBITRUM_ONE]: arbitrumOneTokens,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepoliaTokens,
  [ChainId.ZKSYNC_MAINNET]: zkSyncMainnetTokens,
  [ChainId.ZKSYNC_SEPOLIA]: zkSyncSepoliaTokens,
  [ChainId.OPTIMISM_MAINNET]: optimismMainnetTokens,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepoliaTokens,
  [ChainId.BASE_MAINNET]: baseMainnetTokens,
  [ChainId.BASE_SEPOLIA]: baseSepoliaTokens,
  [ChainId.UNICHAIN_MAINNET]: unichainMainnetTokens,
  [ChainId.UNICHAIN_SEPOLIA]: unichainSepoliaTokens,
};
