import { QueryObserverOptions, useQuery } from 'react-query';

import { getVaiRepayAmountWithInterests } from 'clients/api';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

type Options = QueryObserverOptions<
  GetVaiRepayAmountWithInterestsOutput,
  Error,
  GetVaiRepayAmountWithInterestsOutput,
  GetVaiRepayAmountWithInterestsOutput,
  [
    FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
    {
      accountAddress: string;
    },
  ]
>;

const useGetVaiRepayAmountWithInterests = (
  { accountAddress }: Omit<GetVaiRepayAmountWithInterestsInput, 'multicall'>,
  options?: Options,
) => {
  const multicall = useMulticall();

  return useQuery(
    [
      FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
      {
        accountAddress,
      },
    ],
    () => getVaiRepayAmountWithInterests({ multicall, accountAddress }),
    options,
  );
};

export default useGetVaiRepayAmountWithInterests;
