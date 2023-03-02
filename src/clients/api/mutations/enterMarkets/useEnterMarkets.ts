import { MutationObserverOptions, useMutation } from 'react-query';

import { EnterMarketsInput, EnterMarketsOutput, enterMarkets, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';

const useEnterMarkets = (
  options?: MutationObserverOptions<EnterMarketsOutput, Error, EnterMarketsInput>,
) =>
  useMutation(FunctionKey.ENTER_MARKETS, enterMarkets, {
    ...options,
    onSuccess: (...onSuccessParams) => {
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_ASSETS_IN_ACCOUNT);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });

export default useEnterMarkets;
