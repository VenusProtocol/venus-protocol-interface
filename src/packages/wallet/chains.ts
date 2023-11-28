import { type Chain, bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';

import localConfig from 'config';

const getSupportedChains = (): Chain[] => {
  if (localConfig.isOnTestnet) {
    return [bscTestnet, sepolia];
  }

  if (localConfig.environment === 'preview') {
    return [bsc, mainnet];
  }

  return [bsc];
};

export const governanceChain = localConfig.isOnTestnet ? bscTestnet : bsc;

export const chains = getSupportedChains();

export const defaultChain = chains[0];
