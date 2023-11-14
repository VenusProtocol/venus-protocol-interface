import { useAnalytics } from 'packages/analytics';
import { useGetXvsVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import {
  RequestWithdrawalFromXvsVaultInput,
  queryClient,
  requestWithdrawalFromXvsVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedRequestWithdrawalFromXvsVaultInput = Omit<
  RequestWithdrawalFromXvsVaultInput,
  'xvsVaultContract'
>;
type Options = UseSendTransactionOptions<TrimmedRequestWithdrawalFromXvsVaultInput>;

const useRequestWithdrawalFromXvsVault = (options?: Options) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    fn: (input: TrimmedRequestWithdrawalFromXvsVaultInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        requestWithdrawalFromXvsVault({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const { poolIndex, amountWei } = input;

      if (xvs) {
        captureAnalyticEvent('Token withdrawal requested from XVS vault', {
          poolIndex,
          rewardTokenSymbol: xvs.symbol,
          tokenAmountTokens: convertWeiToTokens({
            token: xvs,
            value: amountWei,
          }).toNumber(),
        });

        const accountAddress = await xvsVaultContract?.signer.getAddress();

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          { accountAddress, rewardTokenAddress: xvs.address, poolIndex },
        ]);

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
          { accountAddress, rewardTokenAddress: xvs.address, poolIndex },
        ]);
      }
    },
    options,
  });
};

export default useRequestWithdrawalFromXvsVault;
