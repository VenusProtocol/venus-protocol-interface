import { queryClient } from 'clients/api';
import withdraw, { type WithdrawInput } from 'clients/api/mutations/withdraw';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetNativeTokenGatewayContract, useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedRedeemInput = Omit<WithdrawInput, 'tokenContract' | 'accountAddress'>;
type Options = UseSendTransactionOptions<TrimmedRedeemInput>;

const useWithdraw = (
  {
    vToken,
    poolName,
    poolComptrollerAddress,
  }: { vToken: VToken; poolName: string; poolComptrollerAddress: string },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    comptrollerContractAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const tokenContract = useGetVTokenContract({
    vToken,
    passSigner: true,
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: [FunctionKey.WITHDRAW],
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
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        withdrewFullSupply: false,
      });

      const accountAddress = await tokenContract?.signer.getAddress();

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_MAIN_MARKETS] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_LEGACY_POOL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_ISOLATED_POOLS] });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            chainId,
            accountAddress,
            vTokenAddress: vToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: vToken.underlyingToken.address,
          },
        ],
      });

      if (input.unwrap && vToken.underlyingToken.tokenWrapped?.isNative) {
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId,
              accountAddress,
              tokenAddress: vToken.underlyingToken.tokenWrapped.address,
            },
          ],
        });
      }
    },
    options,
  });
};

export default useWithdraw;
