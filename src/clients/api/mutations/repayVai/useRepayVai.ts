import { MutationObserverOptions, useMutation } from 'react-query';

import { IRepayVaiOutput, RepayVaiInput, queryClient, repayVai } from 'clients/api';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

type Options = MutationObserverOptions<
  IRepayVaiOutput,
  Error,
  Omit<RepayVaiInput, 'vaiControllerContract'>
>;

const useRepayVai = (options?: Options) => {
  const vaiControllerContract = useVaiControllerContract();

  return useMutation(
    FunctionKey.REPAY_VAI,
    (params: Omit<RepayVaiInput, 'vaiControllerContract'>) =>
      repayVai({
        vaiControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await vaiControllerContract.signer.getAddress();
        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: TOKENS.vai,
            accountAddress,
            spenderAddress: vaiControllerContract.address,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRepayVai;
