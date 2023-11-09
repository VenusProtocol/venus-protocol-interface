import localConfig from 'config';
import { type Chain, bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';

const getSupportedChains = (): Chain[] => {
  if (localConfig.isOnTestnet) {
    return [bscTestnet, sepolia];
  }

  if (localConfig.environment === 'preview') {
    return [bsc, mainnet];
  }

  return [bsc];
};

// Note: the first chain listed will be used as the default chain
export const chains = getSupportedChains();
