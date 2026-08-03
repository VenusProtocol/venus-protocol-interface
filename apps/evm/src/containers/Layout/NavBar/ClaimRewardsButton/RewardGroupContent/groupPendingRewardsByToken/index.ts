import type { PendingReward } from '../../types';

export const groupPendingRewardsByToken = ({
  pendingRewards,
}: {
  pendingRewards: PendingReward[];
}) => {
  const pendingRewardMapping = new Map<string, PendingReward>([]);

  pendingRewards.forEach(pendingReward => {
    const groupedPendingReward = pendingRewardMapping.get(pendingReward.rewardToken.address);
    pendingRewardMapping.set(pendingReward.rewardToken.address, {
      rewardToken: pendingReward.rewardToken,
      rewardAmountMantissa: pendingReward.rewardAmountMantissa.plus(
        groupedPendingReward?.rewardAmountMantissa || 0,
      ),
      rewardAmountCents: pendingReward.rewardAmountCents?.plus(
        groupedPendingReward?.rewardAmountCents || 0,
      ),
    });
  });

  return Array.from(pendingRewardMapping.values());
};
