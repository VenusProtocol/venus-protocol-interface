/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { convertWeiToTokens } from 'utilities';

import { Checkbox, CheckboxProps } from '../../../Checkbox';
import { TokenIcon } from '../../../TokenIcon';
import { Group } from '../types';
import { useStyles } from './styles';

export interface RewardGroupProps {
  group: Group;
  onCheckChange: (newIsChecked: boolean) => void;
}

export const RewardGroup: React.FC<RewardGroupProps> = ({ group, onCheckChange }) => {
  const styles = useStyles();

  const handleOnCheckChange: CheckboxProps['onChange'] = event =>
    onCheckChange(event.currentTarget.checked);

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <Typography component="h4" variant="h4">
          {group.name}
        </Typography>

        <Checkbox onChange={handleOnCheckChange} value={group.isChecked} />
      </div>

      {group.pendingRewards.map(pendingReward => (
        <div
          css={styles.groupItem}
          key={`reward-group-${group.name}-${pendingReward.rewardToken.address}`}
        >
          <TokenIcon token={pendingReward.rewardToken} css={styles.rewardTokenIcon} />

          <Typography css={styles.rewardAmount}>
            {convertWeiToTokens({
              valueWei: pendingReward.rewardAmountWei,
              token: pendingReward.rewardToken,
              returnInReadableFormat: true,
            })}
          </Typography>
        </div>
      ))}
    </div>
  );
};
