import { LayeredValues, TokenIconWithSymbol } from 'components';
import { convertMantissaToTokens, formatCentsToReadableValue } from 'utilities';
import type { ExternalRewardsGroup, InternalRewardsGroup } from '../types';
import { groupPendingRewardsByToken } from './groupPendingRewardsByToken';

export interface RewardGroupContentProps {
  rightTitleComponent: React.ReactNode;
  group: InternalRewardsGroup | ExternalRewardsGroup;
}

export const RewardGroupContent: React.FC<RewardGroupContentProps> = ({
  rightTitleComponent,
  group,
}: RewardGroupContentProps) => {
  const pendingRewards = groupPendingRewardsByToken({ pendingRewards: group.pendingRewards });

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
