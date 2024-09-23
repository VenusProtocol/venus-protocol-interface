import { type RepayInput, queryClient, repay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetMaximillionContract, useGetNativeTokenGatewayContract } from 'libs/contracts';
import { useAccountAddress, useChainId, useSigner } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedRepayInput = Omit<
  RepayInput,
  'signer' | 'vToken' | 'maximillionContract' | 'nativeTokenGatewayContract'
>;
type Options = UseSendTransactionOptions<TrimmedRepayInput>;

const useRepay = (
  {
    vToken,
    poolName,
    poolComptrollerAddress,
  }: { vToken: VToken; poolName: string; poolComptrollerAddress: string },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { signer } = useSigner();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  const maximillionContract = useGetMaximillionContract({
    passSigner: true,
  });

  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    passSigner: true,
    comptrollerContractAddress: poolComptrollerAddress,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.REPAY],
    // @ts-expect-error this should accept the NativeTokenGateway, Maximiillion and VToken contracts
    fn: (input: TrimmedRepayInput) =>
      callOrThrow({ signer }, params =>
        repay({
          ...params,
          ...input,
          vToken,
          maximillionContract,
          nativeTokenGatewayContract,
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
        repaidFullLoan: input.repayFullLoan || false,
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_LEGACY_CORE_POOL_MARKETS],
      });
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_LEGACY_POOL],
      });
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_ISOLATED_POOLS],
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

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: vToken.underlyingToken.address,
            accountAddress,
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

      if (input.wrap && vToken.underlyingToken.tokenWrapped) {
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

export default useRepay;
