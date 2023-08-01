import { VError } from 'errors';
import { MutationObserverOptions, useMutation } from 'react-query';

import { IRepayVaiOutput, RepayVaiInput, queryClient, repayVai } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import { logError } from 'context/ErrorLogger';

type HandleRepayVai = Omit<RepayVaiInput, 'vaiControllerContract'>;
type Options = MutationObserverOptions<IRepayVaiOutput, Error, HandleRepayVai>;

const useRepayVai = (options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  const handleRepayVai = async (params: HandleRepayVai) => {
    if (!vaiControllerContract) {
      logError('Contract infos missing for repayVai mutation function call');
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return repayVai({
      vaiControllerContract,
      ...params,
    });
  };

  return useMutation(FunctionKey.REPAY_VAI, handleRepayVai, {
    ...options,
    onSuccess: async (...onSuccessParams) => {
      const accountAddress = await vaiControllerContract?.signer.getAddress();
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);
      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          tokenAddress: TOKENS.vai,
          accountAddress,
          spenderAddress: vaiControllerContract?.address,
        },
      ]);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });
};

export default useRepayVai;
