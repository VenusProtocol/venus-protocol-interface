import BigNumber from 'bignumber.js';

export interface User {
  Token: string;
}

export interface Asset {
  id: string;
  name: string;
  tokenPrice: string;
  symbol: string;
  borrowBalance: BigNumber;
  decimals: number;
  walletBalance: BigNumber;
  isEnabled: boolean;
  vtokenAddress: string;
  borrowApy: BigNumber;
  xvsBorrowApy: BigNumber;
  img: string;
  borrowCaps: BigNumber;
  totalBorrows: BigNumber;
  liquidity: BigNumber;
  xvsSupplyApy: BigNumber;
  supplyApy: BigNumber;
  collateralFactor: number;
  collateral: boolean;
  supplyBalance: BigNumber;
}

export interface Setting {
  marketType?: string; // 'supply'
  withXVS?: boolean;
  pendingInfo: {
    type: string; // 'Borrow'
    status: boolean;
    symbol: string;
    amount: string | number;
  };
  vaultVaiStaked?: BigNumber.Value | null;
  vaiAPY?: number | string;
}

export interface Action {
  title: string;
}

enum ProposalState {
  pending = 'Pending',
  active = 'Active',
  succeeded = 'Succeeded',
  queued = 'Queued',
  executed = 'Executed',
  canceled = 'Canceled',
  defeated = 'Defeated',
  expired = 'Expired',
}
export interface ProposalInfo {
  id: string;
  description: string;
  actions: Action[];
  startTimestamp?: number;
  createdTimestamp?: number;
  queuedTimestamp?: number;
  executedTimestamp?: number;
  endTimestamp?: number;
  cancelTimestamp?: number;
  updatedAt?: number;
  state: ProposalState;
  proposer: string;
}

export interface Proposal {
  forVotes: number;
  againstVotes: number;
  description: string;
  id: string;
  state: string;
  createdAt: string;
}

export interface IPool {
  poolId: BigNumber;
  stakedToken: string;
  rewardToken: string;
  userStakedAmount: BigNumber;
  pendingReward: BigNumber;
  lockPeriodSecond: BigNumber;
  apr: BigNumber;
  totalStaked: BigNumber;
  dailyEmission: BigNumber;
}
