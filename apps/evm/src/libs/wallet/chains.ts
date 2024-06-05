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
} from 'wagmi/chains';

import localConfig from 'config';

const getSupportedChains = (): Chain[] => {
  if (localConfig.isOnTestnet) {
    return [bscTestnet, opBNBTestnet, sepolia, arbitrumSepolia];
  }

  return [bscMainnet, ethereum, opBNBMainnet, arbitrumOne];
};

export const governanceChain = localConfig.isOnTestnet ? bscTestnet : bscMainnet;

export const chains = getSupportedChains();

export const defaultChain = chains[0];
