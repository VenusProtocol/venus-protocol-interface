import type BigNumber from 'bignumber.js';

import type { Claim } from 'clients/api';
import type { Token } from 'types';

export interface PendingReward {
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

interface RewardsGroup {
  id: string;
  name: string;
  pendingRewards: PendingReward[];
  warningMessage?: string | React.ReactNode;
}

export interface InternalRewardsGroup extends RewardsGroup {
  isChecked: boolean;
  claims: Claim[];
  isDisabled?: boolean;
}

export interface ExternalRewardsGroup extends RewardsGroup {
  claimUrl: string;
  campaignName: string;
  appName: string;
}

export type Group = InternalRewardsGroup | ExternalRewardsGroup;
