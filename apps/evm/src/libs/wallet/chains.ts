import {
  type Chain,
  arbitrumSepolia,
  bsc,
  bscTestnet,
  mainnet,
  opBNB,
  opBNBTestnet,
  sepolia,
} from 'wagmi/chains';

import localConfig from 'config';

const getSupportedChains = (): Chain[] => {
  if (localConfig.isOnTestnet) {
    return [bscTestnet, opBNBTestnet, sepolia, arbitrumSepolia];
  }

  return [bsc, mainnet, opBNB];
};

export const governanceChain = localConfig.isOnTestnet ? bscTestnet : bsc;

export const chains = getSupportedChains();

export const defaultChain = chains[0];
