import { useAnalytics } from 'packages/analytics';
import {
  useGetMainPoolComptrollerContractAddress,
  useGetMulticall3Contract,
  useGetPrimeContractAddress,
  useGetVaiVaultContractAddress,
  useGetXvsVaultContractAddress,
} from 'packages/contracts';
import { callOrThrow } from 'utilities';

import { ClaimRewardsInput, claimRewards, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedClaimRewardsInput = Omit<
  ClaimRewardsInput,
  | 'multicallContract'
  | 'mainPoolComptrollerContractAddress'
  | 'vaiVaultContractAddress'
  | 'xvsVaultContractAddress'
>;

type Options = UseSendTransactionOptions<TrimmedClaimRewardsInput>;

const useClaimRewards = (options?: Options) => {
  const multicallContract = useGetMulticall3Contract({
    passSigner: true,
  });

  const mainPoolComptrollerContractAddress = useGetMainPoolComptrollerContractAddress();
  const vaiVaultContractAddress = useGetVaiVaultContractAddress();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();
  const primeContractAddress = useGetPrimeContractAddress();

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.CLAIM_REWARDS,
    fn: (input: TrimmedClaimRewardsInput) =>
      callOrThrow(
        {
          multicallContract,
          mainPoolComptrollerContractAddress,
          vaiVaultContractAddress,
          xvsVaultContractAddress,
        },
        params =>
          claimRewards({
            primeContractAddress,
            ...params,
            ...input,
          }),
      ),
    onConfirmed: ({ input }) => {
      input.claims.forEach(claim => {
        if (claim.contract === 'mainPoolComptroller') {
          captureAnalyticEvent('Pool reward claimed', {
            comptrollerAddress: mainPoolComptrollerContractAddress!,
            vTokenAddressesWithPendingReward: claim.vTokenAddressesWithPendingReward,
          });
        } else if (claim.contract === 'rewardsDistributor') {
          captureAnalyticEvent('Pool reward claimed', {
            comptrollerAddress: claim.comptrollerContractAddress,
            vTokenAddressesWithPendingReward: claim.vTokenAddressesWithPendingReward,
          });
        } else if (claim.contract === 'vaiVault') {
          captureAnalyticEvent('VAI vault reward claimed', undefined);
        } else if (claim.contract === 'xvsVestingVault') {
          captureAnalyticEvent('XVS vesting vault reward claimed', {
            poolIndex: claim.poolIndex,
            rewardTokenSymbol: claim.rewardToken.symbol,
          });
        }
      });

      queryClient.invalidateQueries([FunctionKey.GET_PENDING_REWARDS, input.accountAddress]);
    },
    options,
  });
};

export default useClaimRewards;
