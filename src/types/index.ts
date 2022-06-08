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
  vtokenAddress: string;
  borrowApy: BigNumber;
  xvsBorrowApy: BigNumber;
  img: string;
  borrowCaps: BigNumber;
  liquidity: BigNumber;
  xvsSupplyApy: BigNumber;
  supplyApy: BigNumber;
  collateralFactor: BigNumber;
  collateral: boolean;
  supplyBalance: BigNumber;
  key: number;
  percentOfLimit: string;
  tokenAddress: string;
  treasuryBalance: BigNumber;
  vimg: string | undefined;
  vsymbol: string;
  treasuryTotalBorrowsCents: BigNumber;
  treasuryTotalSupplyCents: BigNumber;
  treasuryTotalSupply: BigNumber;
  treasuryTotalBorrows: BigNumber;
  xvsPerDay: BigNumber;
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

export type ProposalState =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Queued'
  | 'Executed'
  | 'Canceled'
  | 'Defeated'
  | 'Expired';

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

export interface VoteTransaction {
  support: boolean;
  type: 'vote';
  blockTimestamp: number;
  amount: string;
  to: string;
  votes: string;
}

export interface Market {
  id: string;
  address: string;
  borrowApy: BigNumber;
  borrowCaps: string;
  borrowRatePerBlock: string;
  borrowVenusApy: BigNumber;
  borrowerCount: number;
  borrowerDailyVenus: string;
  cash: string;
  collateralFactor: string;
  exchangeRate: string;
  lastCalculatedBlockNumber: number;
  liquidity: BigNumber;
  name: string;
  reserveFactor: string;
  supplierCount: number;
  supplierDailyVenus: string;
  supplyApy: BigNumber;
  supplyRatePerBlock: string;
  supplyVenusApy: BigNumber;
  symbol: string;
  tokenPrice: BigNumber;
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
  treasuryTotalBorrowsCents: BigNumber;
  treasuryTotalSupplyCents: BigNumber;
}

export interface MarketSnapshot {
  asset: string;
  blockNumber: number;
  blockTimestamp: number;
  borrowApy: string;
  borrowVenusApy: string;
  createdAt: string;
  exchangeRate: string;
  id: string;
  priceUSD: string;
  supplyApy: string;
  supplyVenusApy: string;
  totalBorrow: string;
  totalSupply: string;
  updatedAt: string;
}

export type TransactionEvent =
  | 'Mint'
  | 'Transfer'
  | 'Borrow'
  | 'RepayBorrow'
  | 'Redeem'
  | 'Approval'
  | 'LiquidateBorrow'
  | 'ReservesAdded'
  | 'ReservesReduced'
  | 'MintVAI'
  | 'Withdraw'
  | 'RepayVAI'
  | 'Deposit'
  | 'VoteCast'
  | 'ProposalCreated'
  | 'ProposalQueued'
  | 'ProposalExecuted'
  | 'ProposalCanceled';

export enum TransactionCategory {
  vtoken = 'vtoken',
  vai = 'vai',
  vote = 'vote',
}

export interface ITransactionResponse {
  amount: number;
  blockNumber: number;
  category: string;
  createdAt: string;
  event: string;
  from: string;
  id: number;
  timestamp: string | null;
  to: string;
  transactionHash: string;
  updatedAt: string;
  vTokenAddress: string;
}

export interface Vault {
  poolIndex: number;
  stakedTokenId: TokenId;
  rewardTokenId: TokenId;
  lockingPeriodMs: number;
  stakeAprPercentage: number;
  totalStakedAmountWei: BigNumber;
  dailyEmissionAmountWei: BigNumber;
  userStakedAmountWei?: BigNumber;
  userPendingRewardAmountWei?: BigNumber;
}
