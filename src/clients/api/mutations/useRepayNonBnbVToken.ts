import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  repayNonBnbVToken,
  IRepayNonBnbVTokenInput,
  RepayBnbOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  RepayBnbOutput,
  Error,
  Omit<IRepayNonBnbVTokenInput, 'vTokenContract'>
>;

const useRepayNonBnbVToken = (
  { vTokenId }: { vTokenId: Exclude<VTokenId, 'bnb'> },
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
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries([FunctionKey.GET_V_TOKEN_BORROW_BALANCE, vTokenId]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayNonBnbVToken;
