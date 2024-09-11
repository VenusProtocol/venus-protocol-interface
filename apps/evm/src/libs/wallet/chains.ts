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

const getSupportedChains = (): [Chain, ...Chain[]] => {
  if (localConfig.isOnTestnet) {
    return [bscTestnet, opBNBTestnet, sepolia, arbitrumSepolia, zksyncSepoliaTestnet];
  }

  return [bscMainnet, ethereum, opBNBMainnet, arbitrumOne, zksyncMainnet];
};

export const governanceChain = localConfig.isOnTestnet ? bscTestnet : bscMainnet;

export const chains = getSupportedChains();

export const defaultChain = chains[0];
