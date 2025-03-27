import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { zyFiWalletAddresses } from 'constants/gasLess';
import { getZyFiVaultContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetPaymasterInfoOutput, getPaymasterInfo } from '.';

type UseGetPaymasterInfoInput = {
  chainId: ChainId;
};

export type UseGetPaymasterInfoQueryKey = [
  FunctionKey.GET_PAYMASTER_INFO,
  UseGetPaymasterInfoInput,
];

type Options = QueryObserverOptions<
  GetPaymasterInfoOutput,
  Error,
  GetPaymasterInfoOutput,
  GetPaymasterInfoOutput,
  UseGetPaymasterInfoQueryKey
>;

export const useGetPaymasterInfo = (
  { chainId }: UseGetPaymasterInfoInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient({ chainId });
  const zyFiVaultContractAddress = getZyFiVaultContractAddress({ chainId });
  const zyFiWalletAddress = zyFiWalletAddresses[chainId];

  return useQuery({
    queryKey: [FunctionKey.GET_PAYMASTER_INFO, { chainId }],
    queryFn: () =>
      callOrThrow({ zyFiVaultContractAddress, zyFiWalletAddress }, params =>
        getPaymasterInfo({
          publicClient,
          ...params,
        }),
      ),
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!zyFiVaultContractAddress &&
      !!zyFiWalletAddress,
  });
};
