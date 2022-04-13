import { useMutation, MutationObserverOptions } from 'react-query';

import { queryClient, enterMarkets, IEnterMarketsInput, EnterMarketsOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

const useEnterMarkets = (
  options?: MutationObserverOptions<
    EnterMarketsOutput,
    // @TODO: use custom error type (see https://app.clickup.com/t/2rvwhnt)
    Error,
    Omit<IEnterMarketsInput, 'comptrollerContract'>
  >,
) => {
  const comptrollerContract = useComptrollerContract();

  // @TODO: invalidate related queries on success
  return useMutation(
    FunctionKey.ENTER_MARKETS,
    (params: Omit<IEnterMarketsInput, 'comptrollerContract'>) =>
      enterMarkets({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (
        data: void,
        variables: Omit<IEnterMarketsInput, 'comptrollerContract'>,
        context: unknown,
      ) => {
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        if (options?.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      },
    },
  );
};

export default useEnterMarkets;
