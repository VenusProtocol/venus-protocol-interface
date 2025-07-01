import { ChainId, MainnetChainId, TestnetChainId } from '@venusprotocol/chains';
import {
  type Chain,
  arbitrum as arbitrumOne,
  arbitrumSepolia,
  base,
  baseSepolia,
  berachain,
  berachainBepolia,
  bsc as bscMainnet,
  bscTestnet,
  mainnet as ethereum,
  opBNB as opBNBMainnet,
  opBNBTestnet,
  optimism as optimismMainnet,
  optimismSepolia,
  sepolia,
  unichain,
  unichainSepolia,
  zksync as zksyncMainnet,
  zksyncSepoliaTestnet,
} from 'wagmi/chains';

import localConfig from 'config';
import { extractEnumValues } from 'utilities/extractEnumValues';

export const chainMapping = {
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
  [ChainId.OPTIMISM_MAINNET]: optimismMainnet,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepolia,
  [ChainId.BASE_MAINNET]: base,
  [ChainId.BASE_SEPOLIA]: baseSepolia,
  [ChainId.UNICHAIN_MAINNET]: unichain,
  [ChainId.UNICHAIN_SEPOLIA]: unichainSepolia,
  [ChainId.BERACHAIN_MAINNET]: berachain,
  [ChainId.BERACHAIN_BEPOLIA]: berachainBepolia,
} as const satisfies Record<ChainId, Chain>;

const getSupportedChains = () => {
  const chainIds =
    localConfig.network === 'testnet'
      ? extractEnumValues(TestnetChainId)
      : extractEnumValues(MainnetChainId);

  const chains: Chain[] = chainIds.map(chainId => chainMapping[chainId]);

  return chains;
};

export const governanceChain =
  chainMapping[localConfig.network === 'testnet' ? ChainId.BSC_TESTNET : ChainId.BSC_MAINNET];

export const chains = getSupportedChains();

export const defaultChain = chains[0];
