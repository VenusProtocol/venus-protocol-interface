import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { getVaiRepayAmountWithInterests } from 'clients/api';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

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
  {
    accountAddress,
  }: Omit<GetVaiRepayAmountWithInterestsInput, 'multicall' | 'vaiControllerContractAddress'>,
  options?: Options,
) => {
  const multicall = useMulticall();
  const vaiControllerContractAddress = useGetUniqueContractAddress({
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
      callOrThrow({ vaiControllerContractAddress }, params =>
        getVaiRepayAmountWithInterests({
          multicall,
          accountAddress,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVaiRepayAmountWithInterests;
