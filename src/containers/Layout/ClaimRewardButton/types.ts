import BigNumber from 'bignumber.js';

import { Claim } from 'clients/api';
import { Token } from 'types';

export interface PendingReward {
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface Group {
  id: string;
  name: string;
  isChecked: boolean;
  pendingRewards: PendingReward[];
  claims: Claim[];
  isDisabled?: boolean;
  warningMessage?: string;
}
