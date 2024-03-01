import { RepayVaiInput, queryClient, repayVai } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedRepayVaiInput = Omit<RepayVaiInput, 'vaiControllerContract'>;
type Options = UseSendTransactionOptions<TrimmedRepayVaiInput>;

const useRepayVai = (options?: Options) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract({
    passSigner: true,
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  return useSendTransaction({
    fnKey: FunctionKey.REPAY_VAI,
    fn: (input: TrimmedRepayVaiInput) =>
      callOrThrow(
        {
          vaiControllerContract,
        },
        params =>
          repayVai({
            ...params,
            ...input,
          }),
      ),
    onConfirmed: async () => {
      const accountAddress = await vaiControllerContract?.signer.getAddress();
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS);
      queryClient.invalidateQueries(FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT);

      if (vai) {
        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: vai.address,
            accountAddress,
            spenderAddress: vaiControllerContract?.address,
          },
        ]);
      }
    },
    options,
  });
};

export default useRepayVai;
