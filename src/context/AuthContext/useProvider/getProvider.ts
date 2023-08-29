import { getPublicClient } from '@wagmi/core';
import { providers } from 'ethers';
import { type HttpTransport } from 'viem';

// Convert a viem Public Client to an ethers.js Provider
const getProvider = ({ chainId }: { chainId?: number } = {}) => {
  const publicClient = getPublicClient({ chainId });
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  }

  return new providers.JsonRpcProvider(transport.url, network);
};

export default getProvider;
