import { ChainId, type VTokenIconUrlMapping } from '../../types';
import { vTokenIconUrls as arbitrumOneVTokenIconUrls } from './arbitrumOne';
import { vTokenIconUrls as arbitrumSepoliaVTokenIconUrls } from './arbitrumSepolia';
import { vTokenIconUrls as baseMainnetVTokenIconUrls } from './baseMainnet';
import { vTokenIconUrls as baseSepoliaVTokenIconUrls } from './baseSepolia';
import { vTokenIconUrls as bscMainnetVTokenIconUrls } from './bscMainnet';
import { vTokenIconUrls as bscTestnetVTokenIconUrls } from './bscTestnet';
import { vTokenIconUrls as ethereumVTokenIconUrls } from './ethereum';
import { vTokenIconUrls as opBnbMainnetVTokenIconUrls } from './opBnbMainnet';
import { vTokenIconUrls as opBnbTestnetVTokenIconUrls } from './opBnbTestnet';
import { vTokenIconUrls as optimismMainnetVTokenIconUrls } from './optimismMainnet';
import { vTokenIconUrls as optimismSepoliaVTokenIconUrls } from './optimismSepolia';
import { vTokenIconUrls as sepoliaVTokenIconUrls } from './sepolia';
import { vTokenIconUrls as unichainMainnetVTokenIconUrls } from './unichainMainnet';
import { vTokenIconUrls as unichainSepoliaVTokenIconUrls } from './unichainSepolia';
import { vTokenIconUrls as zkSyncMainnetVTokenIconUrls } from './zkSyncMainnet';
import { vTokenIconUrls as zkSyncSepoliaVTokenIconUrls } from './zkSyncSepolia';

export const vTokens: Record<ChainId, VTokenIconUrlMapping> = {
  [ChainId.BSC_MAINNET]: bscMainnetVTokenIconUrls,
  [ChainId.BSC_TESTNET]: bscTestnetVTokenIconUrls,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetVTokenIconUrls,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetVTokenIconUrls,
  [ChainId.ETHEREUM]: ethereumVTokenIconUrls,
  [ChainId.SEPOLIA]: sepoliaVTokenIconUrls,
  [ChainId.ARBITRUM_ONE]: arbitrumOneVTokenIconUrls,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepoliaVTokenIconUrls,
  [ChainId.ZKSYNC_MAINNET]: zkSyncMainnetVTokenIconUrls,
  [ChainId.ZKSYNC_SEPOLIA]: zkSyncSepoliaVTokenIconUrls,
  [ChainId.OPTIMISM_MAINNET]: optimismMainnetVTokenIconUrls,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepoliaVTokenIconUrls,
  [ChainId.BASE_MAINNET]: baseMainnetVTokenIconUrls,
  [ChainId.BASE_SEPOLIA]: baseSepoliaVTokenIconUrls,
  [ChainId.UNICHAIN_MAINNET]: unichainMainnetVTokenIconUrls,
  [ChainId.UNICHAIN_SEPOLIA]: unichainSepoliaVTokenIconUrls,
};
