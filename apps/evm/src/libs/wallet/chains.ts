import {
  type Chain,
  arbitrum as arbitrumOne,
  arbitrumSepolia,
  bsc as bscMainnet,
  bscTestnet,
  mainnet as ethereum,
  opBNB as opBNBMainnet,
  opBNBTestnet,
  optimism as optimismMainnet,
  optimismSepolia,
  sepolia,
  zksync as zksyncMainnet,
  zksyncSepoliaTestnet,
} from 'wagmi/chains';

import localConfig from 'config';

const getSupportedChains = (): [Chain, ...Chain[]] => {
  if (localConfig.network === 'testnet') {
    return [
      bscTestnet,
      opBNBTestnet,
      sepolia,
      arbitrumSepolia,
      zksyncSepoliaTestnet,
      optimismSepolia,
    ];
  }

  return [bscMainnet, ethereum, opBNBMainnet, arbitrumOne, zksyncMainnet, optimismMainnet];
};

export const governanceChain = localConfig.network === 'testnet' ? bscTestnet : bscMainnet;

export const chains = getSupportedChains();

export const defaultChain = chains[0];
