import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import { RepayInput, RepayOutput, queryClient, repay } from 'clients/api';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<RepayOutput, Error, Omit<RepayInput, 'web3' | 'vToken'>>;

const useRepay = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const web3 = useWeb3();

  return useMutation(
    FunctionKey.REPAY,
    params =>
      repay({
        web3,
        vToken,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { accountAddress } = onSuccessParams[1];

        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BORROW_BALANCE,
          {
            accountAddress,
            vTokenAddress: vToken.address,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepay;
