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

export type ProposalState =
  | 'Pending'
  | 'Active'
  | 'Canceled'
  | 'Defeated'
  | 'Succeeded'
  | 'Queued'
  | 'Expired'
  | 'Executed';

export interface IProposalAction {
  data: string;
  signature: string;
  target: string;
  title: string;
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

export interface IProposal {
  abstainedVotesWei: BigNumber;
  actions: IProposalAction[];
  againstVotesWei: BigNumber;
  blockNumber: number;
  createdDate: Date | undefined;
  description: DescriptionV1 | DescriptionV2;
  endBlock: number;
  endDate: Date;
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
}

export type VoteSupport = 'FOR' | 'AGAINST' | 'ABSTAIN';

export interface IVoter {
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
  id: TokenId;
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

export interface ITransaction {
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
  stakedTokenId: TokenId;
  rewardTokenId: TokenId;
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
