import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import { BorrowInput, BorrowOutput, borrow, queryClient } from 'clients/api';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<BorrowOutput, Error, Omit<BorrowInput, 'vTokenContract'>>;

const useBorrow = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const vTokenContract = useVTokenContract(vToken);

  return useMutation(
    FunctionKey.BORROW,
    params =>
      borrow({
        vTokenContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await vTokenContract.signer.getAddress();

        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            vTokenAddress: vToken.address,
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useBorrow;
