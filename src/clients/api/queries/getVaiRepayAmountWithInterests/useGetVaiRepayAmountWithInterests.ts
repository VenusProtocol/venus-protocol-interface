import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { getVaiRepayAmountWithInterests } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

type Options = QueryObserverOptions<
  GetVaiRepayAmountWithInterestsOutput | undefined,
  Error,
  GetVaiRepayAmountWithInterestsOutput | undefined,
  GetVaiRepayAmountWithInterestsOutput | undefined,
  [
    FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
    {
      accountAddress: string;
    },
  ]
>;

const useGetVaiRepayAmountWithInterests = (
  { accountAddress }: Omit<GetVaiRepayAmountWithInterestsInput, 'vaiControllerContract'>,
  options?: Options,
) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  return useQuery(
    [
      FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
      {
        accountAddress,
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
