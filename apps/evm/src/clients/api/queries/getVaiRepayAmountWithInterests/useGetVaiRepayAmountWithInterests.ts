import { QueryObserverOptions, useQuery } from 'react-query';

import { getVaiRepayAmountWithInterests } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

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
  options?: Options,
) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [
      FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
      {
        accountAddress,
        chainId,
      },
    ],
    () =>
      callOrThrow({ vaiControllerContract }, params =>
        getVaiRepayAmountWithInterests({
          accountAddress,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVaiRepayAmountWithInterests;
