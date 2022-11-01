import { MutationObserverOptions, useMutation } from 'react-query';

import {
  RepayBnbOutput,
  RepayNonBnbVTokenInput,
  queryClient,
  repayNonBnbVToken,
} from 'clients/api';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  RepayBnbOutput,
  Error,
  Omit<RepayNonBnbVTokenInput, 'vTokenContract'>
>;

const useRepayNonBnbVToken = (
  { vTokenId }: { vTokenId: Exclude<string, 'bnb'> },
  options?: Options,
) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useMutation(
    FunctionKey.REPAY_NON_BNB_V_TOKEN,
    params =>
      repayNonBnbVToken({
        vTokenContract,
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
          { accountAddress: fromAccountAddress, vTokenId },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayNonBnbVToken;
