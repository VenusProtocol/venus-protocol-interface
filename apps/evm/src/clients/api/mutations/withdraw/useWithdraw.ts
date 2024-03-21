import { queryClient } from 'clients/api';
import withdraw, { type WithdrawInput } from 'clients/api/mutations/withdraw';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetNativeTokenGatewayContract, useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { Pool, VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedRedeemInput = Omit<WithdrawInput, 'tokenContract' | 'accountAddress'>;
type Options = UseSendTransactionOptions<TrimmedRedeemInput>;

const useWithdraw = ({ vToken, pool }: { vToken: VToken; pool: Pool }, options?: Options) => {
  const { chainId } = useChainId();
  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    comptrollerContractAddress: pool.comptrollerAddress,
    passSigner: true,
  });
  const tokenContract = useGetVTokenContract({
    vToken,
    passSigner: true,
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.WITHDRAW,
    fn: (input: TrimmedRedeemInput) =>
      callOrThrow({ tokenContract }, params =>
        withdraw({
          ...params,
          ...input,
          nativeTokenGatewayContract,
        }),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens withdrawn', {
        poolName: pool.name,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        withdrewFullSupply: false,
      });

      const accountAddress = await tokenContract?.signer.getAddress();

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      queryClient.invalidateQueries([
        FunctionKey.GET_V_TOKEN_BALANCE,
        {
          chainId,
          accountAddress,
          vTokenAddress: vToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: vToken.underlyingToken.address,
        },
      ]);

      if (input.unwrap && vToken.underlyingToken.tokenWrapped?.isNative) {
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: vToken.underlyingToken.tokenWrapped.address,
          },
        ]);
      }
    },
    options,
  });
};

export default useWithdraw;
