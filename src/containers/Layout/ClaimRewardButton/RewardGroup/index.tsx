/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Checkbox, CheckboxProps, LayeredValues, TokenIcon } from 'components';
import React from 'react';
import { convertWeiToTokens, formatCentsToReadableValue } from 'utilities';

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
          <div css={styles.rewardToken}>
            <TokenIcon token={pendingReward.rewardToken} css={styles.rewardTokenIcon} />
            <Typography css={styles.rewardTokenSymbol}>
              {pendingReward.rewardToken.symbol}
            </Typography>
          </div>

          <LayeredValues
            css={styles.layeredValues}
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
