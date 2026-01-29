import { Checkbox, type CheckboxProps } from 'components';

import { RewardGroupContent } from '../RewardGroupContent';
import type { InternalRewardsGroup } from '../types';

export interface RewardGroupProps {
  group: InternalRewardsGroup;
  onCheckChange?: (newIsChecked: boolean) => void;
}

export const InternalRewardGroup: React.FC<RewardGroupProps> = ({ group, onCheckChange }) => {
  const handleOnCheckChange: CheckboxProps['onChange'] = event =>
    onCheckChange?.(event.currentTarget.checked);

  return (
    <RewardGroupContent
      rightTitleComponent={
        !group.isDisabled && <Checkbox onChange={handleOnCheckChange} value={group.isChecked} />
      }
      group={group}
    />
  );
};
