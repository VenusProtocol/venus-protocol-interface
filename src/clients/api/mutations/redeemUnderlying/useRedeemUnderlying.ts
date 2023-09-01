import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { queryClient } from 'clients/api';
import redeemUnderlying, {
  RedeemUnderlyingInput,
  RedeemUnderlyingOutput,
} from 'clients/api/mutations/redeemUnderlying';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import useGetVTokenContract from 'hooks/useGetVTokenContract';

type TrimmedRedeemUnderlyingInput = Omit<
  RedeemUnderlyingInput,
  'vTokenContract' | 'accountAddress'
>;
type Options = MutationObserverOptions<RedeemUnderlyingOutput, Error, TrimmedRedeemUnderlyingInput>;

const useRedeemUnderlying = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract({ vToken, passSigner: true });

  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.REDEEM_UNDERLYING,
    (input: TrimmedRedeemUnderlyingInput) =>
      callOrThrow({ vTokenContract }, params =>
        redeemUnderlying({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { amountWei } = onSuccessParams[1];

        captureAnalyticEvent('Tokens withdrawn', {
          poolName,
          tokenSymbol: vToken.underlyingToken.symbol,
          tokenAmountTokens: convertWeiToTokens({
            token: vToken.underlyingToken,
            valueWei: amountWei,
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
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRedeemUnderlying;
