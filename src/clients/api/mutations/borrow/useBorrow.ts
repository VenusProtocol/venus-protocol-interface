import { useAnalytics } from 'packages/analytics';
import { useGetVTokenContract } from 'packages/contracts';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { BorrowInput, borrow, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedBorrowInput = Omit<BorrowInput, 'vTokenContract'>;
type Options = UseSendTransactionOptions<TrimmedBorrowInput>;

const useBorrow = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract({ vToken, passSigner: true });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: [FunctionKey.BORROW, { vToken }],
    fn: (input: TrimmedBorrowInput) =>
      callOrThrow({ vTokenContract }, params =>
        borrow({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens borrowed', {
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertWeiToTokens({
          token: vToken.underlyingToken,
          valueWei: input.amountWei,
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
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useBorrow;
