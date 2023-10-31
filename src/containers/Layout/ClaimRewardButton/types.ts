import BigNumber from 'bignumber.js';
import { Token } from 'types';

import { Claim } from 'clients/api';

export interface PendingReward {
  rewardToken: Token;
  rewardAmountWei: BigNumber;
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
