import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { BorrowInput, BorrowOutput, borrow, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import useGetVTokenContract from 'hooks/useGetVTokenContract';

type TrimmedBorrowInput = Omit<BorrowInput, 'vTokenContract'>;
type Options = MutationObserverOptions<BorrowOutput, Error, TrimmedBorrowInput>;

const useBorrow = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract(vToken);
  const { captureAnalyticEvent } = useAnalytics();

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
        const { amountWei } = onSuccessParams[1];

        captureAnalyticEvent('Tokens borrowed', {
          poolName,
          tokenSymbol: vToken.underlyingToken.symbol,
          tokenAmountTokens: convertWeiToTokens({
            token: vToken.underlyingToken,
            valueWei: amountWei,
          }).toNumber(),
        });

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
