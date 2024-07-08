import { providers } from '@0xsequence/multicall';
import { providers as ethersProviders } from 'ethers';
import type { Chain, Client, HttpTransport, Transport } from 'viem';

import addresses from 'libs/contracts/generated/infos/addresses';
import { logError } from 'libs/errors';

const MULTICALL_BATCH_SIZE = 100;

// Convert a viem Public Client to an ethers.js Provider
export const getProvider = ({ client }: { client: Client<Transport, Chain> }) => {
  const { chain, transport } = client;
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
  const zeroXSequenceMulticallAddress =
    addresses.ZeroXSequenceMulticall[chain.id as keyof typeof addresses.ZeroXSequenceMulticall];

  if (!zeroXSequenceMulticallAddress) {
    logError(`0xsequence multicall contract address missing on chain with ID ${chain.id}`);
    return ethersProvider;
  }

  // Wrap with multicall provider
  return new providers.MulticallProvider(ethersProvider, {
    contract: zeroXSequenceMulticallAddress,
    batchSize: MULTICALL_BATCH_SIZE,
  });
};
