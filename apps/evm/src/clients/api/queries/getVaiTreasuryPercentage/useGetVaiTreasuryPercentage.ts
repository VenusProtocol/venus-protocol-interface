import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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

const useGetVaiTreasuryPercentage = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_TREASURY_PERCENTAGE, { chainId }],
    queryFn: () => callOrThrow({ vaiControllerContract }, getVaiTreasuryPercentage),
    ...options,
  });
};

export default useGetVaiTreasuryPercentage;
