import redeemAndUnwrap, { RedeemAndUnwrapInput } from 'clients/api/mutations/redeemAndUnwrap';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetNativeTokenGatewayContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedRedeemAndUnwrapInput = Omit<RedeemAndUnwrapInput, 'nativeTokenGatewayContract'>;
type Options = UseSendTransactionOptions<TrimmedRedeemAndUnwrapInput>;

const useRedeemAndUnwrap = (
  { vToken, poolComptrollerAddress }: { vToken: VToken; poolComptrollerAddress: string },
  options?: Options,
) => {
  const { chainId } = useChainId();
  const nativeToken = vToken.underlyingToken.tokenWrapped;
  const nativeTokenGatewayContract = useGetNativeTokenGatewayContract({
    passSigner: true,
    comptrollerContractAddress: poolComptrollerAddress,
  });

  return useSendTransaction({
    fnKey: FunctionKey.REDEEM_AND_UNWRAP,
    fn: (input: TrimmedRedeemAndUnwrapInput) =>
      callOrThrow({ nativeTokenGatewayContract }, params =>
        redeemAndUnwrap({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async () => {
      const accountAddress = await nativeTokenGatewayContract?.signer.getAddress();

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          vTokenAddress: vToken.address,
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
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useRedeemAndUnwrap;
