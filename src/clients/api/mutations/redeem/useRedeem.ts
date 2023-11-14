import { useAnalytics } from 'packages/analytics';
import { useGetVTokenContract } from 'packages/contracts';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { queryClient } from 'clients/api';
import redeem, { RedeemInput } from 'clients/api/mutations/redeem';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedRedeemInput = Omit<RedeemInput, 'tokenContract' | 'accountAddress'>;
type Options = UseSendTransactionOptions<TrimmedRedeemInput>;

const useRedeem = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const tokenContract = useGetVTokenContract({
    vToken,
    passSigner: true,
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.REDEEM,
    fn: (input: TrimmedRedeemInput) =>
      callOrThrow({ tokenContract }, params =>
        redeem({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens withdrawn', {
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertWeiToTokens({
          token: vToken.underlyingToken,
          value: input.amountWei,
        }).toNumber(),
        withdrewFullSupply: false,
      });

      const accountAddress = await tokenContract?.signer.getAddress();

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

export default useRedeem;
