import wrapTokensAndRepay, {
  WrapTokensAndRepayInput,
} from 'clients/api/mutations/wrapTokensAndRepay';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetNativeTokenGatewayContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedWrapTokensAndRepayInput = Omit<WrapTokensAndRepayInput, 'nativeTokenGatewayContract'>;
type Options = UseSendTransactionOptions<TrimmedWrapTokensAndRepayInput>;

const useWrapTokensAndRepay = (
  {
    vToken,
    poolComptrollerAddress,
    accountAddress,
  }: { vToken: VToken; poolComptrollerAddress: string; accountAddress: string },
  options?: Options,
) => {
  const { chainId } = useChainId();
  const nativeToken = vToken.underlyingToken.tokenWrapped;
  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    passSigner: true,
    comptrollerContractAddress: poolComptrollerAddress,
  });

  return useSendTransaction({
    fnKey: FunctionKey.WRAP_TOKENS_AND_SUPPLY,
    fn: (input: TrimmedWrapTokensAndRepayInput) =>
      callOrThrow({ nativeTokenGatewayContract }, params =>
        wrapTokensAndRepay({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async () => {
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: vToken.underlyingToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId,
          tokenAddress: vToken.underlyingToken.address,
          accountAddress,
          spenderAddress: nativeTokenGatewayContract?.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: nativeToken?.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useWrapTokensAndRepay;
