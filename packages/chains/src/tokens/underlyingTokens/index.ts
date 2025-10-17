import { ChainId, type Token } from '../../types';

import { arbitrumOne } from './arbitrumOne';
import { arbitrumSepolia } from './arbitrumSepolia';
import { baseMainnet } from './baseMainnet';
import { baseSepolia } from './baseSepolia';
import { bscMainnet } from './bscMainnet';
import { bscTestnet } from './bscTestnet';
import { ethereum } from './ethereum';
import { opBnbMainnet } from './opBnbMainnet';
import { opBnbTestnet } from './opBnbTestnet';
import { optimismMainnet } from './optimismMainnet';
import { optimismSepolia } from './optimismSepolia';
import { sepolia } from './sepolia';
import { unichainMainnet } from './unichainMainnet';
import { unichainSepolia } from './unichainSepolia';
import { zkSyncMainnet } from './zkSyncMainnet';
import { zkSyncSepolia } from './zkSyncSepolia';

export const tokens: {
  [chainId in ChainId]: Token[];
} = {
  [ChainId.BSC_MAINNET]: bscMainnet,
  [ChainId.BSC_TESTNET]: bscTestnet,
  [ChainId.OPBNB_MAINNET]: opBnbMainnet,
  [ChainId.OPBNB_TESTNET]: opBnbTestnet,
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.ARBITRUM_ONE]: arbitrumOne,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [ChainId.ZKSYNC_MAINNET]: zkSyncMainnet,
  [ChainId.ZKSYNC_SEPOLIA]: zkSyncSepolia,
  [ChainId.OPTIMISM_MAINNET]: optimismMainnet,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepolia,
  [ChainId.BASE_MAINNET]: baseMainnet,
  [ChainId.BASE_SEPOLIA]: baseSepolia,
  [ChainId.UNICHAIN_MAINNET]: unichainMainnet,
  [ChainId.UNICHAIN_SEPOLIA]: unichainSepolia,
};
