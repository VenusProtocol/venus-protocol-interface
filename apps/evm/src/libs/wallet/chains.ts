import { ChainId, MainnetChainId, TestnetChainId } from '@venusprotocol/chains';
import {
  type Chain,
  arbitrum as arbitrumOne,
  arbitrumSepolia,
  bsc as bscMainnet,
  bscTestnet,
  mainnet as ethereum,
  opBNB as opBNBMainnet,
  opBNBTestnet,
  sepolia,
  zksync as zksyncMainnet,
  zksyncSepoliaTestnet,
} from 'wagmi/chains';

import localConfig from 'config';

const chainMapping = {
  [ChainId.BSC_MAINNET]: bscMainnet,
  [ChainId.BSC_TESTNET]: bscTestnet,
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.OPBNB_MAINNET]: opBNBMainnet,
  [ChainId.OPBNB_TESTNET]: opBNBTestnet,
  [ChainId.ARBITRUM_ONE]: arbitrumOne,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [ChainId.ZKSYNC_MAINNET]: zksyncMainnet,
  [ChainId.ZKSYNC_SEPOLIA]: zksyncSepoliaTestnet,
} as const satisfies Record<ChainId, Chain>;

const getSupportedChains = () => {
  const chainIds = localConfig.isOnTestnet ? TestnetChainId : MainnetChainId;

  const chains: Chain[] = Object.values(chainIds)
    .filter((value): value is TestnetChainId => !Number.isNaN(+value))
    .map(chainId => chainMapping[chainId]);

  return chains;
};

export const governanceChain =
  chainMapping[localConfig.isOnTestnet ? ChainId.BSC_TESTNET : ChainId.BSC_MAINNET];

export const chains = getSupportedChains();

export const defaultChain = chains[0];
