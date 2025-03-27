import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getVaiControllerContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from '.';

export type UseGetVaiTreasuryPercentageQueryKey = [
  FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVaiTreasuryPercentageOutput | undefined,
  Error,
  GetVaiTreasuryPercentageOutput | undefined,
  GetVaiTreasuryPercentageOutput | undefined,
  UseGetVaiTreasuryPercentageQueryKey
>;

export const useGetVaiTreasuryPercentage = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const vaiControllerAddress = getVaiControllerContractAddress({
    chainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_TREASURY_PERCENTAGE, { chainId }],
    queryFn: () =>
      callOrThrow({ publicClient, vaiControllerAddress }, params =>
        getVaiTreasuryPercentage({ ...params }),
      ),
    ...options,
  });
};
