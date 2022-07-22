import { MutationObserverOptions, useMutation } from 'react-query';

import { EnterMarketsInput, EnterMarketsOutput, enterMarkets, queryClient } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useEnterMarkets = (
  options?: MutationObserverOptions<
    EnterMarketsOutput,
    // @TODO: use custom error type (see https://app.clickup.com/t/2rvwhnt)
    Error,
    Omit<EnterMarketsInput, 'comptrollerContract'>
  >,
) => {
  const comptrollerContract = useComptrollerContract();

  return useMutation(
    FunctionKey.ENTER_MARKETS,
    (params: Omit<EnterMarketsInput, 'comptrollerContract'>) =>
      enterMarkets({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useEnterMarkets;
