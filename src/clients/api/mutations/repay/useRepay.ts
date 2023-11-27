import { useAnalytics } from 'packages/analytics';
import { useGetMaximillionContract } from 'packages/contracts';
import { useAccountAddress, useSigner } from 'packages/wallet';
import { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

import { RepayInput, queryClient, repay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedRepayInput = Omit<RepayInput, 'signer' | 'vToken' | 'maximillionContract'>;
type Options = UseSendTransactionOptions<TrimmedRepayInput>;

const useRepay = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const { signer } = useSigner();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const maximillionContract = useGetMaximillionContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: FunctionKey.REPAY,
    fn: (input: TrimmedRepayInput) =>
      callOrThrow({ signer }, params =>
        repay({
          ...params,
          ...input,
          vToken,
          maximillionContract,
        }),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens repaid', {
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        repaidFullLoan: input.isRepayingFullLoan,
      });

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          tokenAddress: vToken.underlyingToken.address,
          accountAddress,
        },
      ]);
    },
    options,
  });
};

export default useRepay;
