import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import { getVaiRepayAmountWithInterests } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

import type {
  GetVaiRepayAmountWithInterestsInput,
  GetVaiRepayAmountWithInterestsOutput,
} from './types';

type TrimmedGetVaiRepayAmountWithInterestsInput = Omit<
  GetVaiRepayAmountWithInterestsInput,
  'vaiControllerContract'
>;

export type UseGetVaiRepayAmountWithInterestsQueryKey = [
  FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
  TrimmedGetVaiRepayAmountWithInterestsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVaiRepayAmountWithInterestsOutput | undefined,
  Error,
  GetVaiRepayAmountWithInterestsOutput | undefined,
  GetVaiRepayAmountWithInterestsOutput | undefined,
  UseGetVaiRepayAmountWithInterestsQueryKey
>;

const useGetVaiRepayAmountWithInterests = (
  { accountAddress }: TrimmedGetVaiRepayAmountWithInterestsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery({
    queryKey: [
      FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
      {
        accountAddress,
        chainId,
      },
    ],

    queryFn: () =>
      callOrThrow({ vaiControllerContract }, params =>
        getVaiRepayAmountWithInterests({
          accountAddress,
          ...params,
        }),
      ),

    ...options,
  });
};

export default useGetVaiRepayAmountWithInterests;
