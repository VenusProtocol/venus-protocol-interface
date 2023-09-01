import { providers } from '@0xsequence/multicall';
import { PublicClient } from '@wagmi/core';
import { providers as ethersProviders } from 'ethers';
import { type HttpTransport } from 'viem';

// Convert a viem Public Client to an ethers.js Provider
const getProvider = ({ publicClient }: { publicClient: PublicClient }) => {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const ethersProvider =
    transport.type === 'fallback'
      ? new ethersProviders.FallbackProvider(
          (transport.transports as ReturnType<HttpTransport>[]).map(
            ({ value }) => new ethersProviders.JsonRpcProvider(value?.url, network),
          ),
        )
      : new ethersProviders.JsonRpcProvider(transport.url, network);

  // Wrap with multicall provider
  return new providers.MulticallProvider(ethersProvider);
};

export default getProvider;
