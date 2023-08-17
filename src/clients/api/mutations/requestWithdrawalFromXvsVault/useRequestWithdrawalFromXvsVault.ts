import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import {
  RequestWithdrawalFromXvsVaultInput,
  RequestWithdrawalFromXvsVaultOutput,
  queryClient,
  requestWithdrawalFromXvsVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import { useAnalytics } from 'context/Analytics';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedRequestWithdrawalFromXvsVaultInput = Omit<
  RequestWithdrawalFromXvsVaultInput,
  'xvsVaultContract'
>;
type Options = MutationObserverOptions<
  RequestWithdrawalFromXvsVaultOutput,
  Error,
  TrimmedRequestWithdrawalFromXvsVaultInput
>;

const useRequestWithdrawalFromXvsVault = (options?: Options) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    (input: TrimmedRequestWithdrawalFromXvsVaultInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        requestWithdrawalFromXvsVault({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { poolIndex, amountWei } = onSuccessParams[1];

        captureAnalyticEvent('Token withdrawal requested from XVS vault', {
          poolIndex,
          rewardTokenSymbol: TOKENS.xvs.symbol,
          tokenAmountTokens: convertWeiToTokens({
            token: TOKENS.vai,
            valueWei: amountWei,
          }).toNumber(),
        });

        const accountAddress = await xvsVaultContract?.signer.getAddress();

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
          { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRequestWithdrawalFromXvsVault;
