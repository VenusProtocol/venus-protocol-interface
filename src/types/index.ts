import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';

export type Environment = 'storybook' | 'ci' | 'testnet' | 'preview' | 'mainnet';

export enum BscChainId {
  'MAINNET' = 56,
  'TESTNET' = 97,
}

export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: string | '';
  isNative?: boolean;
}

export interface VToken extends Omit<Token, 'isNative' | 'asset'> {
  decimals: 8; // VBep tokens all have 8 decimals
  underlyingToken: Token;
}

export type TokenAction = 'supply' | 'withdraw' | 'borrow' | 'repay';

export interface TokenBalance {
  token: Token;
  balanceWei: BigNumber;
}

export interface AssetDistribution {
  token: Token;
  dailyDistributedTokens: BigNumber;
  borrowApyPercentage: BigNumber;
  supplyApyPercentage: BigNumber;
}

export interface Asset {
  vToken: VToken;
  tokenPriceCents: BigNumber;
  reserveFactor: number;
  collateralFactor: number;
  liquidityCents: BigNumber;
  reserveTokens: BigNumber;
  cashTokens: BigNumber;
  exchangeRateVTokens: BigNumber;
  supplierCount: number;
  borrowerCount: number;
  borrowApyPercentage: BigNumber;
  supplyApyPercentage: BigNumber;
  supplyBalanceTokens: BigNumber;
  supplyBalanceCents: BigNumber;
  borrowBalanceTokens: BigNumber;
  borrowBalanceCents: BigNumber;
  supplyRatePerBlockTokens: BigNumber;
  borrowRatePerBlockTokens: BigNumber;
  distributions: AssetDistribution[];
  borrowCapTokens?: BigNumber;
  supplyCapTokens?: BigNumber;
  // User-specific props
  // TODO: make these optional so they can be set to undefined when no wallet is
  // connected
  userSupplyBalanceTokens: BigNumber;
  userSupplyBalanceCents: BigNumber;
  userBorrowBalanceTokens: BigNumber;
  userBorrowBalanceCents: BigNumber;
  userWalletBalanceTokens: BigNumber;
  userWalletBalanceCents: BigNumber;
  userPercentOfLimit: number;
  isCollateralOfUser: boolean;
}

export interface SwapRouterAddressMapping {
  [poolComptrollerAddress: string]: string;
}

export interface Pool {
  comptrollerAddress: string;
  name: string;
  description: string;
  isIsolated: boolean;
  assets: Asset[];
  // User-specific props
  userSupplyBalanceCents?: BigNumber;
  userBorrowBalanceCents?: BigNumber;
  userBorrowLimitCents?: BigNumber;
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

export enum ProposalType {
  NORMAL,
  FAST_TRACK,
  CRITICAL,
}

export interface Proposal {
  abstainedVotesWei: BigNumber;
  againstVotesWei: BigNumber;
  createdDate: Date | undefined;
  description: DescriptionV1 | DescriptionV2;
  proposalType: ProposalType;
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
  supplyCaps: string;
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
  borrowBalanceCents: BigNumber;
  supplyBalanceCents: BigNumber;
}

export interface MarketSnapshot {
  blockNumber: number;
  blockTimestamp: number;
  borrowApy: string;
  supplyApy: string;
  totalBorrowCents: string;
  totalSupplyCents: string;
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
  amountWei: BigNumber;
  blockNumber: number;
  category: TransactionCategory;
  event: TransactionEvent;
  from: string;
  to: string;
  timestamp: Date;
  transactionHash: string;
  logIndex: string;
  token: Token;
}

export interface Vault {
  stakedToken: Token;
  rewardToken: Token;
  stakingAprPercentage: number;
  totalStakedWei: BigNumber;
  dailyEmissionWei: BigNumber;
  lockingPeriodMs?: number;
  userStakedWei?: BigNumber;
  poolIndex?: number;
  hasPendingWithdrawalsFromBeforeUpgrade?: boolean;
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

export interface Voter {
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
  priceImpactPercentage: number;
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

export type SwapError =
  | 'INSUFFICIENT_LIQUIDITY'
  | 'WRAPPING_UNSUPPORTED'
  | 'UNWRAPPING_UNSUPPORTED';

export type PSTokenCombination = [PSToken, PSToken];
