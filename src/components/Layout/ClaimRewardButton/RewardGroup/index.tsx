/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { convertWeiToTokens, formatCentsToReadableValue } from 'utilities';

import { Checkbox, CheckboxProps } from '../../../Checkbox';
import { TokenIconWithSymbol } from '../../../TokenIconWithSymbol';
import { PendingRewardGroup } from '../types';
import { useStyles } from './styles';

export interface RewardGroupProps {
  pendingRewardGroup: PendingRewardGroup;
  isChecked: boolean;
  onCheckChange: (newIsChecked: boolean) => void;
}

export const RewardGroup: React.FC<RewardGroupProps> = ({
  pendingRewardGroup,
  isChecked,
  onCheckChange,
}) => {
  const styles = useStyles();

  const handleOnCheckChange: CheckboxProps['onChange'] = event =>
    onCheckChange(event.currentTarget.checked);

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <Typography component="h4" variant="h4">
          {pendingRewardGroup.groupName}
        </Typography>

        <Checkbox onChange={handleOnCheckChange} value={isChecked} />
      </div>

      {pendingRewardGroup.pendingRewardTokens.map(pendingRewardToken => (
        <div
          css={styles.groupItem}
          key={`reward-group-${pendingRewardGroup.groupName}-${pendingRewardToken.token.address}`}
        >
          <TokenIconWithSymbol token={pendingRewardToken.token} />

          <div>
            <Typography css={styles.rewardAmountDollars}>
              {formatCentsToReadableValue({
                value: pendingRewardToken.amountCents,
              })}
            </Typography>

            {pendingRewardToken.pendingRewards.map(pendingReward => (
              <Typography
                variant="small2"
                component="p"
                key={`reward-group-item-${pendingRewardGroup.groupName}-${pendingRewardToken.token.address}-${pendingReward.rewardToken.address}`}
              >
                {convertWeiToTokens({
                  valueWei: pendingReward.amountWei,
                  token: pendingReward.rewardToken,
                  returnInReadableFormat: true,
                })}
              </Typography>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
