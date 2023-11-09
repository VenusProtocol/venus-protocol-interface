import { Checkbox, CheckboxProps, LayeredValues, TokenIconWithSymbol } from 'components';
import { useMemo } from 'react';
import { convertWeiToTokens, formatCentsToReadableValue } from 'utilities';

import { Group, PendingReward } from '../types';

export interface RewardGroupProps {
  group: Group;
  onCheckChange: (newIsChecked: boolean) => void;
}

export const RewardGroup: React.FC<RewardGroupProps> = ({ group, onCheckChange }) => {
  const handleOnCheckChange: CheckboxProps['onChange'] = event =>
    onCheckChange(event.currentTarget.checked);

  // Group pending rewards by reward token
  const pendingRewards = useMemo(() => {
    const pendingRewardMapping = new Map<string, PendingReward>([]);

    group.pendingRewards.forEach(pendingReward => {
      const groupedPendingReward = pendingRewardMapping.get(pendingReward.rewardToken.address);
      pendingRewardMapping.set(pendingReward.rewardToken.address, {
        rewardToken: pendingReward.rewardToken,
        rewardAmountWei: pendingReward.rewardAmountWei.plus(
          groupedPendingReward?.rewardAmountWei || 0,
        ),
        rewardAmountCents: pendingReward.rewardAmountCents?.plus(
          groupedPendingReward?.rewardAmountCents || 0,
        ),
      });
    });

    return Array.from(pendingRewardMapping.values());
  }, [group.pendingRewards]);

  return (
    <div className="mb-4 border-b border-lightGrey pb-4 last:border-none last:pb-0">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-lg">{group.name}</p>

          {!group.isDisabled && <Checkbox onChange={handleOnCheckChange} value={group.isChecked} />}
        </div>

        {group.warningMessage && <p className="mt-2 text-orange">{group.warningMessage}</p>}
      </div>

      {pendingRewards.map(pendingReward => (
        <div
          className="mb-4 flex items-center justify-between last:mb-0"
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
            bottomValue={convertWeiToTokens({
              valueWei: pendingReward.rewardAmountWei,
              token: pendingReward.rewardToken,
              returnInReadableFormat: true,
            })}
          />
        </div>
      ))}
    </div>
  );
};
