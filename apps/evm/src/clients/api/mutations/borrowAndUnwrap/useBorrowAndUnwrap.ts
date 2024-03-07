import borrowAndUnwrap, { BorrowAndUnwrapInput } from 'clients/api/mutations/borrowAndUnwrap';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetNativeTokenGatewayContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedBorrowAndUnwrapInput = Omit<BorrowAndUnwrapInput, 'nativeTokenGatewayContract'>;
type Options = UseSendTransactionOptions<TrimmedBorrowAndUnwrapInput>;

const useBorrowAndUnwrap = (
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
    fnKey: FunctionKey.BORROW_AND_UNWRAP,
    fn: (input: TrimmedBorrowAndUnwrapInput) =>
      callOrThrow({ nativeTokenGatewayContract }, params =>
        borrowAndUnwrap({
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

export default useBorrowAndUnwrap;
