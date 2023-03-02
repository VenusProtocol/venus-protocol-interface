import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import { RepayInput, RepayOutput, queryClient, repay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type Options = MutationObserverOptions<RepayOutput, Error, Omit<RepayInput, 'signer' | 'vToken'>>;

const useRepay = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const { signer } = useAuth();

  return useMutation(
    FunctionKey.REPAY,
    params =>
      repay({
        signer,
        vToken,
        ...params,
      }),
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
      },
    },
  );
};

export default useRepay;
