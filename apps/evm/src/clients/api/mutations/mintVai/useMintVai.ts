import { type MintVaiInput, mintVai, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetVaiControllerContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedClaimRewardsInput = Omit<MintVaiInput, 'vaiControllerContract'>;
type Options = UseSendTransactionOptions<TrimmedClaimRewardsInput>;

const useMintVai = (options?: Partial<Options>) => {
  const vaiControllerContract = useGetVaiControllerContract({
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.MINT_VAI],
    fn: (input: TrimmedClaimRewardsInput) =>
      callOrThrow(
        {
          vaiControllerContract,
        },
        params =>
          mintVai({
            ...params,
            ...input,
          }),
      ),
    onConfirmed: () => {
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_USER_VAI_BORROW_BALANCE],
      });
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
      });
    },
    options,
  });
};

export default useMintVai;
