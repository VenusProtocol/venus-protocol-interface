import { getPublicClient } from '@wagmi/core';
import { useConfig } from 'wagmi';

import type { ChainId } from 'types';
import type { PublicClient } from 'viem';

export const usePublicClients = ({ chainIds }: { chainIds: ChainId[] }) => {
  const config = useConfig();

  const publicClients = chainIds.reduce<Partial<Record<ChainId, PublicClient>>>(
    (acc, chainId) => ({
      ...acc,
      [chainId]: getPublicClient(config, { chainId }) as PublicClient | undefined,
    }),
    {},
  );

  return { publicClients };
};
