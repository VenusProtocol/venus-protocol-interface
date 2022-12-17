import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';

export enum BscChainId {
  'MAINNET' = 56,
  'TESTNET' = 97,
}

export interface User {
  Token: string;
}

export interface Asset {
  vToken: VToken;
  tokenPriceDollars: BigNumber;
  reserveFactor: number;
  collateralFactor: number;
  borrowCapTokens: BigNumber;
  liquidityCents: number;
  reserveTokens: BigNumber;
  borrowApy: BigNumber;
  xvsBorrowApy: BigNumber;
  xvsBorrowApr: BigNumber;
  xvsSupplyApy: BigNumber;
  xvsSupplyApr: BigNumber;
  supplyApy: BigNumber;
  treasuryTotalBorrowsCents: BigNumber;
  treasuryTotalSupplyCents: BigNumber;
  treasuryTotalSupply: BigNumber;
  treasuryTotalBorrows: BigNumber;
  xvsPerDay: BigNumber;
  // User-specific props
  collateral: boolean;
  walletBalance: BigNumber;
  supplyBalance: BigNumber;
  borrowBalance: BigNumber;
  percentOfLimit: string;
}

export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: string | '';
  isNative?: boolean;
}

export interface VToken extends Omit<Token, 'isNative'> {
  decimals: 8; // VBep tokens all have 8 decimals
  underlyingToken: Token;
}

export interface TokenBalance {
  token: Token;
  balanceWei: BigNumber;
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

export type ProposalState =
  | 'Pending'
  | 'Active'
  | 'Canceled'
  | 'Defeated'
  | 'Succeeded'
  | 'Queued'
  | 'Expired'
  | 'Executed';

export interface ProposalAction {
  callData: string;
  signature: string;
  target: string;
  value: string;
}

export interface DescriptionV2 {
  version: 'v2';
  title: string;
  description: string;
  forDescription: string;
  againstDescription: string;
  abstainDescription: string;
}

export interface DescriptionV1 {
  version: 'v1';
  title: string;
  description: string;
  forDescription?: undefined;
  againstDescription?: undefined;
  abstainDescription?: undefined;
}

export interface Proposal {
  abstainedVotesWei: BigNumber;
  againstVotesWei: BigNumber;
  createdDate: Date | undefined;
  description: DescriptionV1 | DescriptionV2;
  endBlock: number;
  executedDate: Date | undefined;
  forVotesWei: BigNumber;
  id: number;
  proposer: string;
  queuedDate: Date | undefined;
  startDate: Date | undefined;
  state: ProposalState;
  cancelDate: Date | undefined;
  createdTxHash: string | undefined;
  cancelTxHash: string | undefined;
  endTxHash: string | undefined;
  executedTxHash: string | undefined;
  queuedTxHash: string | undefined;
  startTxHash: string | undefined;
  totalVotesWei: BigNumber;
  actions: ProposalAction[];
  blockNumber?: number;
  endDate?: Date;
}

export type VoteSupport = 'FOR' | 'AGAINST' | 'ABSTAIN' | 'NOT_VOTED';

export interface VotersDetails {
  result: {
    address: string;
    voteWeightWei: BigNumber;
    reason?: string;
    support: VoteSupport;
  }[];
  sumVotes: {
    abstain: BigNumber;
    against: BigNumber;
    for: BigNumber;
    total: BigNumber;
  };
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
  borrowVenusApr: BigNumber;
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
  supplyVenusApr: BigNumber;
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

export interface Transaction {
  id: number;
  amountWei: BigNumber;
  blockNumber: number;
  category: TransactionCategory;
  createdAt: Date;
  event: TransactionEvent;
  from: string;
  to: string;
  timestamp: string | null;
  transactionHash: string;
  updatedAt: Date;
  vTokenAddress: string;
}

export interface Vault {
  stakedToken: Token;
  rewardToken: Token;
  stakingAprPercentage: number;
  totalStakedWei: BigNumber;
  dailyEmissionWei: BigNumber;
  lockingPeriodMs?: number;
  userStakedWei?: BigNumber;
  userPendingRewardWei?: BigNumber;
  poolIndex?: number;
}

export interface VoterAccount {
  address: string;
  createdAt: Date;
  id: string;
  proposalsVoted: number;
  updatedAt: Date;
  voteWeightPercent: number;
  votesWei: BigNumber;
}

export interface LockedDeposit {
  amountWei: BigNumber;
  unlockedAt: Date;
}

export type VoteDetailTransactionTransfer = {
  amountWei: BigNumber;
  blockNumber: number;
  blockTimestamp: Date;
  createdAt: Date;
  from: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: 'transfer';
  updatedAt: Date;
};

export type VoteDetailTransactionVote = {
  votesWei: BigNumber;
  blockNumber: number;
  blockTimestamp: Date;
  createdAt: Date;
  from: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: 'vote';
  updatedAt: Date;
  support: VoteSupport;
};

export type VoteDetailTransaction = VoteDetailTransactionTransfer | VoteDetailTransactionVote;

export interface VoterDetails {
  balanceWei: BigNumber;
  delegateCount: number;
  delegateAddress: string;
  delegating: boolean;
  votesWei: BigNumber;
  voterTransactions: VoteDetailTransaction[];
}

export interface VoterHistory {
  address: string;
  blockNumber: number;
  blockTimestamp: number;
  createdAt: Date;
  id: string;
  proposal: Proposal;
  reason: string | undefined;
  support: VoteSupport;
  updatedAt: Date;
  votesWei: BigNumber;
}

export type SwapDirection = 'exactAmountIn' | 'exactAmountOut';

interface SwapBase {
  fromToken: Token;
  toToken: Token;
  exchangeRate: BigNumber;
  direction: SwapDirection;
  routePath: string[]; // Token addresses
}

export interface ExactAmountInSwap extends SwapBase {
  fromTokenAmountSoldWei: BigNumber;
  expectedToTokenAmountReceivedWei: BigNumber;
  minimumToTokenAmountReceivedWei: BigNumber;
  direction: 'exactAmountIn';
}

export interface ExactAmountOutSwap extends SwapBase {
  expectedFromTokenAmountSoldWei: BigNumber;
  maximumFromTokenAmountSoldWei: BigNumber;
  toTokenAmountReceivedWei: BigNumber;
  direction: 'exactAmountOut';
}

export type Swap = ExactAmountInSwap | ExactAmountOutSwap;

export type PSTokenCombination = [PSToken, PSToken];

export type PoolRiskLevel = 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface Pool {
  id: string;
  name: string;
  riskLevel: PoolRiskLevel;
  assets: Asset[];
  description: string;
  isIsolated: boolean;
}
