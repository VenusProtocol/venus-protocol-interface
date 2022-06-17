import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  stakeWeiInXvsVault,
  IStakeWeiInXvsVaultInput,
  StakeWeiInXvsVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  StakeWeiInXvsVaultOutput,
  Error,
  Omit<IStakeWeiInXvsVaultInput, 'xvsVaultContract'>
>;

const useStakeWeiInXvsVault = (options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_VAULT_REWARD,
    (params: Omit<IStakeWeiInXvsVaultInput, 'xvsVaultContract'>) =>
      stakeWeiInXvsVault({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        queryClient.resetQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          fromAccountAddress,
          XVS_TOKEN_ADDRESS,
          poolIndex,
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeWeiInXvsVault;
