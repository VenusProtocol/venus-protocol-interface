import BigNumber from 'bignumber.js';
import { Token } from 'types';

export interface PendingReward {
  rewardToken: Token;
  amountWei: BigNumber;
}

export interface PendingRewardToken {
  token: Token;
  amountCents: number;
  pendingRewards: PendingReward[];
}

export interface PendingRewardGroup {
  groupName: string;
  pendingRewardTokens: PendingRewardToken[];
}
