import BigNumber from 'bignumber.js';
import { TOKENS, VBEP_TOKENS } from 'constants/tokens';

export interface User {
  Token: string;
}

export interface Asset {
  id: TokenId;
  tokenPrice: BigNumber;
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
  collateralFactor: BigNumber;
  collateral: boolean;
  supplyBalance: BigNumber;
  hypotheticalLiquidity: [string, string, string];
  key: number;
  percentOfLimit: string;
  tokenAddress: string;
  treasuryBalance: BigNumber;
  vimg: string | undefined;
  vsymbol: string;
}

export type TokenId = keyof typeof TOKENS;
export type VTokenId = keyof typeof VBEP_TOKENS;

export interface IToken {
  id: TokenId;
  symbol: Uppercase<TokenId>;
  decimals: number;
  address: string | '';
  asset: string;
  vasset: string;
}

export interface IVBepToken {
  id: VTokenId;
  symbol: `v${Uppercase<VTokenId>}`;
  address: string | '';
  decimals: number;
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
  stakedToken: TokenId;
  rewardToken: TokenId;
  userStakedAmount: BigNumber;
  pendingReward: BigNumber;
  lockPeriodSecond: BigNumber;
  apr: BigNumber;
  totalStaked: BigNumber;
  dailyEmission: BigNumber;
}

export interface Transaction {
  support: boolean;
  type: 'vote';
  blockTimestamp: number;
  amount: string;
  to: string;
  votes: string;
}

export interface Market {
  address: string;
  borrowApy: number;
  borrowCaps: string;
  borrowRatePerBlock: string;
  borrowVenusApy: string;
  borrowerCount: number;
  borrowerDailyVenus: string;
  cash: string;
  collateralFactor: string;
  exchangeRate: string;
  lastCalculatedBlockNumber: number;
  liquidity: string;
  name: string;
  reserveFactor: string;
  supplierCount: number;
  supplierDailyVenus: string;
  supplyApy: string;
  supplyRatePerBlock: string;
  supplyVenusApy: string;
  symbol: string;
  tokenPrice: string;
  totalBorrows: string;
  totalBorrows2: string;
  totalBorrowsUsd: string;
  totalDistributed: string;
  totalDistributed2: string;
  totalReserves: string;
  totalSupply: string;
  totalSupply2: string;
  totalSupplyUsd: string;
  underlyingAddress: string;
  underlyingDecimal: number;
  underlyingName: string;
  underlyingPrice: string;
  underlyingSymbol: string;
  venusBorrowIndex: string;
  venusSpeeds: string;
  venusSupplyIndex: string;
}
