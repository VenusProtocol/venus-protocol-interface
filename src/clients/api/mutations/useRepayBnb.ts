import { MutationObserverOptions, useMutation } from 'react-query';

import { TOKENS } from 'constants/tokens';
import { useWeb3 } from 'clients/web3';
import { queryClient, repayBnb, IRepayBnbInput, RepayBnbOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<RepayBnbOutput, Error, Omit<IRepayBnbInput, 'web3'>>;

const useRepayNonBnbVToken = (options?: Options) => {
  const web3 = useWeb3();

  return useMutation(
    FunctionKey.REPAY_BNB,
    params =>
      repayBnb({
        web3,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1];

        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BORROW_BALANCE,
          {
            accountAddress: fromAccountAddress,
            vTokenId: TOKENS.bnb.id,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayNonBnbVToken;
