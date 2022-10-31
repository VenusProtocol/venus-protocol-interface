import { MutationObserverOptions, useMutation } from 'react-query';

import { BorrowVTokenInput, BorrowVTokenOutput, borrowVToken, queryClient } from 'clients/api';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  BorrowVTokenOutput,
  Error,
  Omit<BorrowVTokenInput, 'vTokenContract'>
>;

const useBorrowVToken = ({ vTokenId }: { vTokenId: string }, options?: Options) => {
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
        const { fromAccountAddress } = onSuccessParams[1];

        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress: fromAccountAddress,
            vTokenId,
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BORROW_BALANCE,
          {
            accountAddress: fromAccountAddress,
            vTokenId,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useBorrowVToken;
