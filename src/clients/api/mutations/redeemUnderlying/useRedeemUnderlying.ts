import { useAnalytics } from 'packages/analytics';
import { useGetVTokenContract } from 'packages/contracts';
import { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

import { queryClient } from 'clients/api';
import redeemUnderlying, { RedeemUnderlyingInput } from 'clients/api/mutations/redeemUnderlying';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedRedeemUnderlyingInput = Omit<
  RedeemUnderlyingInput,
  'vTokenContract' | 'accountAddress'
>;
type Options = UseSendTransactionOptions<TrimmedRedeemUnderlyingInput>;

const useRedeemUnderlying = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract({ vToken, passSigner: true });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.REDEEM_UNDERLYING,
    fn: (input: TrimmedRedeemUnderlyingInput) =>
      callOrThrow({ vTokenContract }, params =>
        redeemUnderlying({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens withdrawn', {
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        withdrewFullSupply: true,
      });

      const accountAddress = await vTokenContract?.signer.getAddress();

      queryClient.invalidateQueries([
        FunctionKey.GET_V_TOKEN_BALANCE,
        {
          accountAddress,
          vTokenAddress: vToken.address,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useRedeemUnderlying;
