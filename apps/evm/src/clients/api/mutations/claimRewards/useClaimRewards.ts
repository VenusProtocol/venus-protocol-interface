import { type ClaimRewardsInput, claimRewards, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetMulticall3Contract,
  useGetPrimeContractAddress,
  useGetVaiVaultContractAddress,
  useGetXvsVaultContractAddress,
} from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedClaimRewardsInput = Omit<
  ClaimRewardsInput,
  | 'multicallContract'
  | 'legacyPoolComptrollerContractAddress'
  | 'vaiVaultContractAddress'
  | 'xvsVaultContractAddress'
>;

type Options = UseSendTransactionOptions<TrimmedClaimRewardsInput>;

const useClaimRewards = (options?: Options) => {
  const { chainId } = useChainId();
  const multicallContract = useGetMulticall3Contract({
    passSigner: true,
  });

  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();
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
          xvsVaultContractAddress,
        },
        params =>
          claimRewards({
            primeContractAddress,
            legacyPoolComptrollerContractAddress,
            vaiVaultContractAddress,
            ...params,
            ...input,
          }),
      ),
    onConfirmed: ({ input }) => {
      input.claims.forEach(claim => {
        if (claim.contract === 'legacyPoolComptroller') {
          captureAnalyticEvent('Pool reward claimed', {
            comptrollerAddress: legacyPoolComptrollerContractAddress || '',
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

      queryClient.invalidateQueries([
        FunctionKey.GET_PENDING_REWARDS,
        { accountAddress: input.accountAddress, chainId },
      ]);
    },
    options,
  });
};

export default useClaimRewards;
