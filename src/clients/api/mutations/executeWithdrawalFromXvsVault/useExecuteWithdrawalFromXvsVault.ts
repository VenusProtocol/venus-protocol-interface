import { useGetXvsVaultContract } from 'packages/contractsNew';
import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

import {
  ExecuteWithdrawalFromXvsVaultInput,
  ExecuteWithdrawalFromXvsVaultOutput,
  executeWithdrawalFromXvsVault,
  queryClient,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import useGetToken from 'hooks/useGetToken';

type TrimmedExecuteWithdrawalFromXvsVaultInput = Omit<
  ExecuteWithdrawalFromXvsVaultInput,
  'xvsVaultContract'
>;
type Options = MutationObserverOptions<
  ExecuteWithdrawalFromXvsVaultOutput,
  Error,
  TrimmedExecuteWithdrawalFromXvsVaultInput
>;

const useExecuteWithdrawalFromXvsVault = (
  { stakedToken }: { stakedToken: Token },
  options?: Options,
) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    (input: TrimmedExecuteWithdrawalFromXvsVaultInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        executeWithdrawalFromXvsVault({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { poolIndex } = onSuccessParams[1];
        const accountAddress = await xvsVaultContract?.signer.getAddress();

        if (xvs) {
          captureAnalyticEvent('Token withdrawals executed from XVS vault', {
            poolIndex,
            rewardTokenSymbol: xvs.symbol,
          });

          // Invalidate cached user info
          queryClient.invalidateQueries([
            FunctionKey.GET_XVS_VAULT_USER_INFO,
            { accountAddress, rewardTokenAddress: xvs.address, poolIndex },
          ]);

          // Invalidate cached user withdrawal requests
          queryClient.invalidateQueries([
            FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
            {
              rewardTokenAddress: xvs.address,
              poolIndex,
              accountAddress,
            },
          ]);

          queryClient.invalidateQueries([
            FunctionKey.GET_XVS_VAULT_POOL_INFOS,
            { rewardTokenAddress: xvs.address, poolIndex },
          ]);
        }

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: stakedToken.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: xvsVaultContract?.address,
            tokenAddress: stakedToken.address,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useExecuteWithdrawalFromXvsVault;
