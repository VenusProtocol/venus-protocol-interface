import { type BorrowInput, borrow, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetNativeTokenGatewayContract, useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedBorrowInput = Omit<BorrowInput, 'vTokenContract' | 'nativeTokenGatewayContract'>;
type Options = UseSendTransactionOptions<TrimmedBorrowInput>;

const useBorrow = (
  {
    vToken,
    poolName,
    poolComptrollerAddress,
  }: { vToken: VToken; poolName: string; poolComptrollerAddress?: string },
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract({ vToken, passSigner: true });
  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    passSigner: true,
    comptrollerContractAddress: poolComptrollerAddress || '',
  });
  const { captureAnalyticEvent } = useAnalytics();
  const { chainId } = useChainId();

  return useSendTransaction({
    fnKey: [FunctionKey.BORROW, { vToken }],
    fn: (input: TrimmedBorrowInput) =>
      callOrThrow({ vTokenContract }, params =>
        borrow({
          ...params,
          ...input,
          nativeTokenGatewayContract,
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

      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

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
          vTokenAddress: vToken.underlyingToken.address,
        },
      ]);

      if (input.unwrap && vToken.underlyingToken.tokenWrapped) {
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

export default useBorrow;
