import { QueryObserverOptions, useQuery } from 'react-query';

import { getVaiRepayAmountWithInterests } from 'clients/api';
import { useGetUniqueContractAddress } from 'clients/contracts';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

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

  const handleGetVaiRepayAmountWithInterests = async () => {
    if (!vaiControllerContractAddress) {
      logError('Contract infos missing for getVaiRepayAmountWithInterests query function call');
      return undefined;
    }

    return getVaiRepayAmountWithInterests({
      multicall,
      accountAddress,
      vaiControllerContractAddress,
    });
  };

  return useQuery(
    [
      FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS,
      {
        accountAddress,
      },
    ],
    handleGetVaiRepayAmountWithInterests,
    options,
  );
};

export default useGetVaiRepayAmountWithInterests;
