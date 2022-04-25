import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  claimXvsReward,
  IClaimXvsRewardInput,
  ClaimXvsRewardOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract, useVenusLensContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  ClaimXvsRewardOutput,
  Error,
  Omit<IClaimXvsRewardInput, 'comptrollerContract' | 'venusLensContract'>
>;

const useClaimXvsReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();
  const venusLensContract = useVenusLensContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_REWARD,
    (params: Omit<IClaimXvsRewardInput, 'comptrollerContract' | 'venusLensContract'>) =>
      claimXvsReward({
        comptrollerContract,
        venusLensContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        // Trigger refetch of XVS reward
        await Promise.all([
          queryClient.resetQueries(FunctionKey.GET_VENUS_VAI_MINTER_INDEX),
          queryClient.resetQueries(FunctionKey.GET_VENUS_VAI_STATE),
          queryClient.resetQueries(FunctionKey.GET_VENUS_ACCRUED),
          queryClient.resetQueries(FunctionKey.GET_MINTED_VAI),
          queryClient.resetQueries(FunctionKey.GET_VENUS_INITIAL_INDEX),
        ]);

        queryClient.resetQueries(FunctionKey.GET_XVS_REWARD);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimXvsReward;
