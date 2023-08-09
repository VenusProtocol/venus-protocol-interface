import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import { BorrowInput, BorrowOutput, borrow, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import useGetVTokenContract from 'hooks/useGetVTokenContract';

type TrimmedBorrowInput = Omit<BorrowInput, 'vTokenContract'>;
type Options = MutationObserverOptions<BorrowOutput, Error, TrimmedBorrowInput>;

const useBorrow = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const vTokenContract = useGetVTokenContract(vToken);

  return useMutation(
    [FunctionKey.BORROW, { vToken }],
    (input: TrimmedBorrowInput) =>
      callOrThrow({ vTokenContract }, params =>
        borrow({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await vTokenContract?.signer.getAddress();

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
