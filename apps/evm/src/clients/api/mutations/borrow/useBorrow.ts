import { type BorrowInput, borrow, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedBorrowInput = Omit<BorrowInput, 'vTokenContract'>;
type Options = UseSendTransactionOptions<TrimmedBorrowInput>;

const useBorrow = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract({ vToken, passSigner: true });
  const { captureAnalyticEvent } = useAnalytics();
  const { chainId } = useChainId();

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
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
      });

      const accountAddress = await vTokenContract?.signer.getAddress();

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          vTokenAddress: vToken.address,
        },
      ]);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useBorrow;
