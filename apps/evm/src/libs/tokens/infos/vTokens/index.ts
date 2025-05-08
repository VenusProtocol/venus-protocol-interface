import type { VTokenAssets } from 'libs/tokens/types';
import { ChainId } from 'types';
import { vTokenAssets as arbitrumOneVTokenAssets } from './arbitrumOne';
import { vTokenAssets as arbitrumSepoliaVTokenAssets } from './arbitrumSepolia';
import { vTokenAssets as baseMainnetVTokenAssets } from './baseMainnet';
import { vTokenAssets as baseSepoliaVTokenAssets } from './baseSepolia';
import { vTokenAssets as berachainBepoliaVTokenAssets } from './berachainBepolia';
import { vTokenAssets as berachainMainnetVTokenAssets } from './berachainMainnet';
import { vTokenAssets as bscMainnetVTokenAssets } from './bscMainnet';
import { vTokenAssets as bscTestnetVTokenAssets } from './bscTestnet';
import { vTokenAssets as ethereumVTokenAssets } from './ethereum';
import { vTokenAssets as opBnbMainnetVTokenAssets } from './opBnbMainnet';
import { vTokenAssets as opBnbTestnetVTokenAssets } from './opBnbTestnet';
import { vTokenAssets as optimismMainnetVTokenAssets } from './optimismMainnet';
import { vTokenAssets as optimismSepoliaVTokenAssets } from './optimismSepolia';
import { vTokenAssets as sepoliaVTokenAssets } from './sepolia';
import { vTokenAssets as unichainMainnetVTokenAssets } from './unichainMainnet';
import { vTokenAssets as unichainSepoliaVTokenAssets } from './unichainSepolia';
import { vTokenAssets as zkSyncMainnetVTokenAssets } from './zkSyncMainnet';
import { vTokenAssets as zkSyncSepoliaVTokenAssets } from './zkSyncSepolia';

export const vTokenAssetsPerChainId: Record<ChainId, VTokenAssets> = {
  [ChainId.BSC_MAINNET]: bscMainnetVTokenAssets,
  [ChainId.BSC_TESTNET]: bscTestnetVTokenAssets,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetVTokenAssets,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetVTokenAssets,
  [ChainId.ETHEREUM]: ethereumVTokenAssets,
  [ChainId.SEPOLIA]: sepoliaVTokenAssets,
  [ChainId.ARBITRUM_ONE]: arbitrumOneVTokenAssets,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepoliaVTokenAssets,
  [ChainId.ZKSYNC_MAINNET]: zkSyncMainnetVTokenAssets,
  [ChainId.ZKSYNC_SEPOLIA]: zkSyncSepoliaVTokenAssets,
  [ChainId.OPTIMISM_MAINNET]: optimismMainnetVTokenAssets,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepoliaVTokenAssets,
  [ChainId.BASE_MAINNET]: baseMainnetVTokenAssets,
  [ChainId.BASE_SEPOLIA]: baseSepoliaVTokenAssets,
  [ChainId.UNICHAIN_MAINNET]: unichainMainnetVTokenAssets,
  [ChainId.UNICHAIN_SEPOLIA]: unichainSepoliaVTokenAssets,
  [ChainId.BERACHAIN_MAINNET]: berachainMainnetVTokenAssets,
  [ChainId.BERACHAIN_BEPOLIA]: berachainBepoliaVTokenAssets,
};
