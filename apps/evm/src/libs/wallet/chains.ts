import { type Chain, bsc, bscTestnet, mainnet, opBNBTestnet, sepolia } from 'wagmi/chains';

import localConfig from 'config';

const getSupportedChains = (): Chain[] => {
  if (localConfig.isOnTestnet) {
    return [bscTestnet, opBNBTestnet, sepolia];
  }

  return [bsc, mainnet];
};

export const governanceChain = localConfig.isOnTestnet ? bscTestnet : bsc;

export const chains = getSupportedChains();

export const defaultChain = chains[0];
