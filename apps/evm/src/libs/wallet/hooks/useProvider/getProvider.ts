import { providers } from '@0xsequence/multicall';
import { PublicClient } from '@wagmi/core';
import { providers as ethersProviders } from 'ethers';
import { type HttpTransport } from 'viem';

import addresses from 'libs/contracts/generated/infos/addresses';
import { logError } from 'libs/errors';

const MULTICALL_BATCH_SIZE = 100;

// Convert a viem Public Client to an ethers.js Provider
export const getProvider = ({ publicClient }: { publicClient: PublicClient }) => {
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

  // We can't use the getter function for the 0xsequence multicall contract here because that
  // creates a dependency cycle
  const xsequenceMulticallAddress =
    addresses.XsequenceMulticall[chain.id as keyof typeof addresses.XsequenceMulticall];

  if (!xsequenceMulticallAddress) {
    logError(`0xsequence multicall contract address missing on chain with ID ${chain.id}`);
    return ethersProvider;
  }

  // Wrap with multicall provider
  return new providers.MulticallProvider(ethersProvider, {
    contract: xsequenceMulticallAddress,
    batchSize: MULTICALL_BATCH_SIZE,
  });
};
