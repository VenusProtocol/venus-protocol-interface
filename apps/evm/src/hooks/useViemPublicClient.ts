import config from 'config';
import { chains } from 'libs/wallet';
import { useMemo } from 'react';
import type { ChainId } from 'types';
import { http, createPublicClient } from 'viem';

export function useViemPublicClient({
  chainId,
}: { chainId: ChainId }): ReturnType<typeof createPublicClient> | undefined {
  const clients = useMemo(
    () =>
      chains.map(chain =>
        createPublicClient({
          chain,
          transport: http(config.rpcUrls[chainId]),
        }),
      ),
    [chainId],
  );

  return clients.find(c => c.chain.id === chainId);
}
