import BigNumber from 'bignumber.js';
import { Token } from 'types';

export interface PendingReward {
  rewardToken: Token;
  rewardAmountWei: BigNumber;
}

export interface Group {
  name: string;
  pendingRewards: PendingReward[];
  isChecked: boolean;
}
