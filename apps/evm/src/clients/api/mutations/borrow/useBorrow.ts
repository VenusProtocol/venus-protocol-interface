import { type BorrowInput, borrow, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetNativeTokenGatewayContract, useGetVTokenContract } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

type TrimmedBorrowInput = Omit<
  BorrowInput,
  'vTokenContract' | 'nativeTokenGatewayContract' | 'vToken' | 'publicClient'
>;
type Options = UseSendTransactionOptions<TrimmedBorrowInput>;

const useBorrow = (
  {
    vToken,
    poolName,
    poolComptrollerAddress,
  }: { vToken: VToken; poolName: string; poolComptrollerAddress: Address },
  options?: Partial<Options>,
) => {
  const vTokenContract = useGetVTokenContract({ vToken, passSigner: true });
  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    passSigner: true,
    comptrollerContractAddress: poolComptrollerAddress,
  });
  const { captureAnalyticEvent } = useAnalytics();
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  return useSendTransaction({
    fnKey: [FunctionKey.BORROW, { vToken }],
    // @ts-expect-error this should accept both the NativeTokenGateway and VToken contracts
    fn: (input: TrimmedBorrowInput) =>
      callOrThrow({ vTokenContract }, params =>
        borrow({
          ...params,
          ...input,
          vToken,
          nativeTokenGatewayContract,
          publicClient,
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
            vTokenAddress: vToken.underlyingToken.address,
          },
        ],
      });

      if (input.unwrap && vToken.underlyingToken.tokenWrapped) {
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

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options,
  });
};

export default useBorrow;
