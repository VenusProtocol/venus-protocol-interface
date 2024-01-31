import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';

export type NonNullableFields<T> = Required<{
  [P in keyof T]: NonNullable<T[P]>;
}>;

export type Environment = 'storybook' | 'ci' | 'testnet' | 'preview' | 'mainnet';

export enum ChainId {
  'BSC_MAINNET' = 56,
  'BSC_TESTNET' = 97,
  'ETHEREUM' = 1,
  'SEPOLIA' = 11155111,
  'OPBNB_TESTNET' = 5611,
}

export type TransactionType = 'chain' | 'layerZero';

export interface ChainMetadata {
  name: string;
  logoSrc: string;
  blockTimeMs: number;
  blocksPerDay: number;
  explorerUrl: string;
  corePoolComptrollerContractAddress: string;
  nativeToken: Token;
  layerZeroScanUrl: string;
}

export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: string;
  isNative?: boolean;
  wrapsNative?: boolean;
}

export interface VToken extends Omit<Token, 'isNative' | 'asset'> {
  decimals: 8; // VBep tokens all have 8 decimals
  underlyingToken: Token;
}

export type TokenAction = 'swapAndSupply' | 'supply' | 'withdraw' | 'borrow' | 'repay';

export interface TokenBalance {
  token: Token;
  balanceMantissa: BigNumber;
}

export interface RewardDistributorDistribution {
  type: 'rewardDistributor';
  token: Token;
  apyPercentage: BigNumber;
  dailyDistributedTokens: BigNumber;
}

export interface PrimeDistribution {
  type: 'prime';
  token: Token;
  apyPercentage: BigNumber;
}

export interface PrimeSimulationDistribution {
  type: 'primeSimulation';
  token: Token;
  apyPercentage: BigNumber;
  referenceValues: {
    userSupplyBalanceTokens: BigNumber;
    userBorrowBalanceTokens: BigNumber;
    userXvsStakedTokens: BigNumber;
  };
}

export type AssetDistribution =
  | RewardDistributorDistribution
  | PrimeDistribution
  | PrimeSimulationDistribution;

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
  supplyPercentageRatePerBlock: BigNumber;
  borrowPercentageRatePerBlock: BigNumber;
  supplyDistributions: AssetDistribution[];
  borrowDistributions: AssetDistribution[];
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

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export interface ProposalAction {
  actionIndex: number;
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

export enum VoteSupport {
  Against,
  For,
  Abstain,
}

export type ProposalVoter = {
  proposalId: number;
  address: string;
  blockNumber: number;
  reason: string | undefined;
  support: VoteSupport;
  votesMantissa: BigNumber;
  blockTimestamp: Date;
};

export type ForVoter = Omit<ProposalVoter, 'support'> & {
  support: VoteSupport.For;
};

export type AgainstVoter = Omit<ProposalVoter, 'support'> & {
  support: VoteSupport.Against;
};

export type AbstainVoter = Omit<ProposalVoter, 'support'> & {
  support: VoteSupport.Abstain;
};

export interface Proposal {
  abstainedVotesMantissa: BigNumber;
  againstVotesMantissa: BigNumber;
  createdDate: Date | undefined;
  description: DescriptionV1 | DescriptionV2;
  proposalType: ProposalType;
  endBlock: number;
  executedDate: Date | undefined;
  forVotesMantissa: BigNumber;
  proposalId: number;
  proposer: string;
  queuedDate: Date | undefined;
  etaDate: Date | undefined;
  startDate: Date | undefined;
  state: ProposalState;
  cancelDate: Date | undefined;
  createdTxHash: string | undefined;
  cancelTxHash: string | undefined;
  executedTxHash: string | undefined;
  queuedTxHash: string | undefined;
  totalVotesMantissa: BigNumber;
  blockNumber?: number;
  endDate?: Date;
  proposalActions: ProposalAction[];
  forVotes: ForVoter[];
  againstVotes: AgainstVoter[];
  abstainVotes: AbstainVoter[];
  userHasVoted: boolean;
}

export interface JsonProposal {
  meta?: {
    title?: string;
    description?: string;
    forDescription?: string;
    againstDescription?: string;
    abstainDescription?: string;
  };
  type?: number;
  signatures?: string[];
  targets?: (string | number)[];
  params?: (string | (string | number)[])[][];
  values?: string[];
}

export interface VotersDetails {
  result: {
    address: string;
    votesMantissa: BigNumber;
    reason?: string;
    support: VoteSupport;
    blockNumber: number;
    blockTimestamp: Date;
  }[];
}

export interface Market {
  address: string;
  borrowerCount: number;
  supplierCount: number;
  totalXvsDistributedTokens: BigNumber;
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
  amountMantissa: BigNumber;
  blockNumber: number;
  category: TransactionCategory;
  event: TransactionEvent;
  from: string;
  to: string;
  timestamp: Date;
  transactionHash: string;
  logIndex: number;
  token: Token;
}

export interface Vault {
  stakedToken: Token;
  rewardToken: Token;
  stakingAprPercentage: number;
  totalStakedMantissa: BigNumber;
  dailyEmissionMantissa: BigNumber;
  isPaused: boolean;
  lockingPeriodMs?: number;
  userStakedMantissa?: BigNumber;
  poolIndex?: number;
  hasPendingWithdrawalsFromBeforeUpgrade?: boolean;
}

export interface VoterAccount {
  address: string;
  delegate: string;
  proposalsVoted: number;
  stakedVotesMantissa: BigNumber;
  voteWeightPercent: string;
  votesMantissa: BigNumber;
}

export interface LockedDeposit {
  amountMantissa: BigNumber;
  unlockedAt: Date;
}

export type VoteDetail = {
  votesMantissa: BigNumber;
  blockNumber: number;
  blockTimestamp: Date;
  support: VoteSupport;
};

export type VoterTransaction = {
  category: string;
  event: string;
  transactionHash: string;
  logIndex: number;
  from: string;
  to: string;
  tokenAddress: string;
  amountMantissa: BigNumber;
  blockNumber: number;
  timestamp: Date;
};

export interface Voter {
  balanceMantissa: BigNumber;
  delegateCount: number;
  delegateAddress: string;
  delegating: boolean;
  votesMantissa: BigNumber;
  txs: VoterTransaction[];
}

export type VoterHistory = Proposal & {
  support: VoteSupport;
  reason: string | undefined;
};

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
  fromTokenAmountSoldMantissa: BigNumber;
  expectedToTokenAmountReceivedMantissa: BigNumber;
  minimumToTokenAmountReceivedMantissa: BigNumber;
  direction: 'exactAmountIn';
}

export interface ExactAmountOutSwap extends SwapBase {
  expectedFromTokenAmountSoldMantissa: BigNumber;
  maximumFromTokenAmountSoldMantissa: BigNumber;
  toTokenAmountReceivedMantissa: BigNumber;
  direction: 'exactAmountOut';
}

export type Swap = ExactAmountInSwap | ExactAmountOutSwap;

export type SwapError =
  | 'INSUFFICIENT_LIQUIDITY'
  | 'WRAPPING_UNSUPPORTED'
  | 'UNWRAPPING_UNSUPPORTED';

export type PSTokenCombination = [PSToken, PSToken];

export interface PrimeApy {
  borrowApy: BigNumber;
  supplyApy: BigNumber;
}
