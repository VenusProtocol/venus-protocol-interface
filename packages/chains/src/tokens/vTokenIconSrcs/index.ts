import { ChainId, type VTokenIconUrlMapping } from '../../types';
import { vTokenIconSrcs as arbitrumOnevTokenIconSrcs } from './arbitrumOne';
import { vTokenIconSrcs as arbitrumSepoliavTokenIconSrcs } from './arbitrumSepolia';
import { vTokenIconSrcs as baseMainnetvTokenIconSrcs } from './baseMainnet';
import { vTokenIconSrcs as baseSepoliavTokenIconSrcs } from './baseSepolia';
import { vTokenIconSrcs as bscMainnetvTokenIconSrcs } from './bscMainnet';
import { vTokenIconSrcs as bscTestnetvTokenIconSrcs } from './bscTestnet';
import { vTokenIconSrcs as ethereumvTokenIconSrcs } from './ethereum';
import { vTokenIconSrcs as opBnbMainnetvTokenIconSrcs } from './opBnbMainnet';
import { vTokenIconSrcs as opBnbTestnetvTokenIconSrcs } from './opBnbTestnet';
import { vTokenIconSrcs as optimismMainnetvTokenIconSrcs } from './optimismMainnet';
import { vTokenIconSrcs as optimismSepoliavTokenIconSrcs } from './optimismSepolia';
import { vTokenIconSrcs as sepoliavTokenIconSrcs } from './sepolia';
import { vTokenIconSrcs as unichainMainnetvTokenIconSrcs } from './unichainMainnet';
import { vTokenIconSrcs as unichainSepoliavTokenIconSrcs } from './unichainSepolia';
import { vTokenIconSrcs as zkSyncMainnetvTokenIconSrcs } from './zkSyncMainnet';
import { vTokenIconSrcs as zkSyncSepoliavTokenIconSrcs } from './zkSyncSepolia';

export const vTokens: Record<ChainId, VTokenIconUrlMapping> = {
  [ChainId.BSC_MAINNET]: bscMainnetvTokenIconSrcs,
  [ChainId.BSC_TESTNET]: bscTestnetvTokenIconSrcs,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetvTokenIconSrcs,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetvTokenIconSrcs,
  [ChainId.ETHEREUM]: ethereumvTokenIconSrcs,
  [ChainId.SEPOLIA]: sepoliavTokenIconSrcs,
  [ChainId.ARBITRUM_ONE]: arbitrumOnevTokenIconSrcs,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepoliavTokenIconSrcs,
  [ChainId.ZKSYNC_MAINNET]: zkSyncMainnetvTokenIconSrcs,
  [ChainId.ZKSYNC_SEPOLIA]: zkSyncSepoliavTokenIconSrcs,
  [ChainId.OPTIMISM_MAINNET]: optimismMainnetvTokenIconSrcs,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepoliavTokenIconSrcs,
  [ChainId.BASE_MAINNET]: baseMainnetvTokenIconSrcs,
  [ChainId.BASE_SEPOLIA]: baseSepoliavTokenIconSrcs,
  [ChainId.UNICHAIN_MAINNET]: unichainMainnetvTokenIconSrcs,
  [ChainId.UNICHAIN_SEPOLIA]: unichainSepoliavTokenIconSrcs,
};
