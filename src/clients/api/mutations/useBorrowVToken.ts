import { MutationObserverOptions, useMutation } from 'react-query';

import { queryClient, borrowVToken, IBorrowVTokenInput, BorrowVTokenOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  BorrowVTokenOutput,
  Error,
  Omit<IBorrowVTokenInput, 'vTokenContract'>
>;

const useBorrowVToken = ({ vTokenId }: { vTokenId: VTokenId }, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useMutation(
    FunctionKey.BORROW_V_TOKEN,
    params =>
      borrowVToken({
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

export default useBorrowVToken;
