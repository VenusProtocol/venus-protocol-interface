import { providers } from '@0xsequence/multicall';
import { providers as ethersProviders } from 'ethers';
import type { Chain, Client, HttpTransport, Transport } from 'viem';

import { addresses } from 'libs/contracts/generated/addresses';
import { logError } from 'libs/errors';
import { RotationProvider } from './rotationProvider';

const MULTICALL_BATCH_SIZE = 100;

// Convert a viem Public Client to an ethers.js Provider
export const getProvider = ({
  client,
}: {
  client: Client<Transport, Chain>;
}) => {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const ethersProvider =
    transport.type === 'fallback'
      ? new RotationProvider(
          (transport.transports as ReturnType<HttpTransport>[]).reduce<string[]>(
            (acc, { value }) => {
              const url = value?.url;

              if (!url) {
                return acc;
              }

              return [...acc, url];
            },
            [],
          ),
          network.chainId,
        )
      : new ethersProviders.StaticJsonRpcProvider(transport.url, network);

  // We can't use the getter function for the 0xsequence multicall contract here because that
  // creates a dependency cycle
  const xsequenceMulticallAddress =
    addresses.uniques.XsequenceMulticall[
      network.chainId as keyof typeof addresses.uniques.XsequenceMulticall
    ];

  if (!xsequenceMulticallAddress) {
    logError(`0xsequence multicall contract address missing on chain with ID ${network.chainId}`);
    return ethersProvider;
  }

  // Wrap with multicall provider
  return new providers.MulticallProvider(ethersProvider, {
    contract: xsequenceMulticallAddress,
    batchSize: MULTICALL_BATCH_SIZE,
  });
};
