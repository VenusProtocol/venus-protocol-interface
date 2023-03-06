import BigNumber from 'bignumber.js';
import { Token } from 'types';

import { Claim } from 'clients/api';

export interface PendingReward {
  rewardToken: Token;
  rewardAmountWei: BigNumber;
}

export interface Group {
  name: string;
  pendingRewards: PendingReward[];
  isChecked: boolean;
  claims: Claim[];
}
