import {
  type MultichainSmartAccount,
  createMeeClient,
  toMultichainNexusAccount,
} from '@biconomy/abstractjs';
import { http, useWalletClient } from 'wagmi';

import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import config from 'config';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError } from 'libs/errors';
import { chainMapping } from 'libs/wallet/chains';
import type { ChainId } from 'types';
import { useAccountAddress } from '../useAccountAddress';
import { useChainId } from '../useChainId';

type UseMeeClientQueryKey = [
  'mee-client',
  {
    chainId: ChainId;
  },
];

interface UseMeeClientOutput {
  meeClient: Awaited<ReturnType<typeof createMeeClient>>;
  nexusAccount: MultichainSmartAccount;
}

type Options = QueryObserverOptions<
  UseMeeClientOutput,
  Error,
  UseMeeClientOutput,
  UseMeeClientOutput,
  UseMeeClientQueryKey
>;

export const useMeeClient = (input?: { chainId: ChainId }, options?: Partial<Options>) => {
  const { accountAddress } = useAccountAddress();
  const { data: walletClient } = useWalletClient({ account: accountAddress });
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;

  const isImportPositionsFeatureEnabled = useIsFeatureEnabled({
    name: 'importPositions',
  });

  return useQuery({
    queryKey: ['mee-client', { chainId }],
    queryFn: async () => {
      if (!walletClient) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const transport = http(config.rpcUrls[chainId][0]);
      const chain = chainMapping[chainId];

      const nexusAccount = await toMultichainNexusAccount({
        chains: [chain],
        transports: [transport],
        signer: walletClient,
      });

      const meeClient = await createMeeClient({
        account: nexusAccount,
        apiKey: config.biconomyApiKey,
      });

      return { meeClient, nexusAccount };
    },
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!walletClient &&
      isImportPositionsFeatureEnabled,
  });
};
