import { LayeredValues, TokenIconWithSymbol } from 'components';
import { useMemo } from 'react';
import { convertMantissaToTokens, formatCentsToReadableValue } from 'utilities';
import type { ExternalRewardsGroup, InternalRewardsGroup, PendingReward } from '../types';

export interface RewardGroupContentProps {
  rightTitleComponent: React.ReactNode;
  group: InternalRewardsGroup | ExternalRewardsGroup;
}

export const RewardGroupContent: React.FC<RewardGroupContentProps> = ({
  rightTitleComponent,
  group,
}: RewardGroupContentProps) => {
  const pendingRewards = useMemo(() => {
    const pendingRewardMapping = new Map<string, PendingReward>([]);

    group.pendingRewards.forEach(pendingReward => {
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
  }, [group.pendingRewards]);

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-lg">{group.name}</p>

          {rightTitleComponent}
        </div>

        {group.warningMessage}
      </div>

      <div className="space-y-3">
        {pendingRewards.map(pendingReward => (
          <div
            className="flex items-start justify-between"
            key={`reward-group-${group.name}-${pendingReward.rewardToken.address}`}
          >
            <div className="flex">
              <TokenIconWithSymbol token={pendingReward.rewardToken} />
            </div>

            <LayeredValues
              className="text-end"
              topValue={formatCentsToReadableValue({
                value: pendingReward.rewardAmountCents,
              })}
              bottomValue={convertMantissaToTokens({
                value: pendingReward.rewardAmountMantissa,
                token: pendingReward.rewardToken,
                returnInReadableFormat: true,
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
