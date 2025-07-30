import type { Token as PSToken } from '@pancakeswap/sdk';
import type { ChainId } from '@venusprotocol/chains';
import type BigNumber from 'bignumber.js';
import type { Address, ByteArray, Hex } from 'viem';

// TODO: import from package in places where it's used in the codebase
export { ChainId, type ChainMetadata } from '@venusprotocol/chains/types';

export type NonNullableFields<T> = Required<{
  [P in keyof T]: NonNullable<T[P]>;
}>;

export type Environment =
  | 'storybook'
  | 'ci'
  | 'local'
  | 'preview' // Automatically generated environments when opening PRs and fixed preview environments
  | 'production';

export type Network =
  | 'testnet'
  | 'mainnet-preview' // mainnet too, but will hit the preview API
  | 'mainnet';

export type TransactionType = 'chain' | 'layerZero' | 'biconomy';

export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: Address;
  isNative?: boolean;
  tokenWrapped?: Token;
}

export interface VToken extends Omit<Token, 'isNative' | 'asset' | 'tokenWrapped'> {
  decimals: 8; // VBep tokens all have 8 decimals
  underlyingToken: Token;
  asset?: string;
}

export type TokenAction =
  | 'swapAndSupply'
  | 'supply'
  | 'withdraw'
  | 'borrow'
  | 'repay'
  | 'enterMarket'
  | 'exitMarket';

export interface TokenBalance {
  token: Token;
  balanceMantissa: BigNumber;
}

export interface VTokenBalance {
  vToken: VToken;
  balanceMantissa: BigNumber;
}

export interface RewardDistributorDistribution {
  type: 'venus';
  token: Token;
  apyPercentage: BigNumber;
  dailyDistributedTokens: BigNumber;
  isActive: boolean;
}

export interface PrimeDistribution {
  type: 'prime';
  token: Token;
  apyPercentage: BigNumber;
  isActive: boolean;
}

export interface PrimeSimulationDistribution {
  type: 'primeSimulation';
  token: Token;
  apyPercentage: BigNumber;
  isActive: boolean;
  referenceValues: {
    userSupplyBalanceTokens: BigNumber;
    userBorrowBalanceTokens: BigNumber;
    userXvsStakedTokens: BigNumber;
  };
}

export interface MerklDistribution {
  type: 'merkl';
  token: Token;
  apyPercentage: BigNumber;
  dailyDistributedTokens: BigNumber;
  isActive: boolean;
  rewardDetails: {
    appName: string;
    claimUrl: string;
    marketAddress: Address;
    merklCampaignIdentifier: string;
    description: string;
    tags: string[];
  };
}

export type TokenDistribution =
  | RewardDistributorDistribution
  | PrimeDistribution
  | PrimeSimulationDistribution
  | MerklDistribution;

export interface PointDistribution {
  title: string;
  description?: string;
  logoUrl?: string;
  extraInfoUrl?: string;
  incentive?: string;
}

export interface Asset {
  vToken: VToken;
  tokenPriceCents: BigNumber;
  reserveFactor: number;
  collateralFactor: number;
  liquidationThresholdPercentage: number;
  badDebtMantissa: bigint;
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
  supplyTokenDistributions: TokenDistribution[];
  borrowTokenDistributions: TokenDistribution[];
  supplyPointDistributions: PointDistribution[];
  borrowPointDistributions: PointDistribution[];
  disabledTokenActions: TokenAction[];
  borrowCapTokens: BigNumber;
  supplyCapTokens: BigNumber;
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
  comptrollerAddress: Address;
  name: string;
  isIsolated: boolean;
  assets: Asset[];
  // User-specific props
  userSupplyBalanceCents?: BigNumber;
  userBorrowBalanceCents?: BigNumber;
  userBorrowLimitCents?: BigNumber;
  userLiquidationThresholdCents?: BigNumber;
}

export enum RemoteProposalState {
  Pending,
  Bridged,
  Queued,
  Canceled,
  Expired,
  Executed,
  Failed,
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
  callData: Hex | ByteArray;
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
  address: Address;
  reason: string | undefined;
  support: VoteSupport;
  votesMantissa: BigNumber;
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
  proposalId: number;
  description: DescriptionV1 | DescriptionV2;
  againstVotesMantissa: BigNumber;
  forVotesMantissa: BigNumber;
  abstainedVotesMantissa: BigNumber;
  proposalType: ProposalType;
  state: ProposalState;
  endBlock: number;
  proposerAddress: Address;
  totalVotesMantissa: BigNumber;
  proposalActions: ProposalAction[];
  forVotes: ForVoter[];
  againstVotes: AgainstVoter[];
  abstainVotes: AbstainVoter[];
  remoteProposals: RemoteProposal[];
  blockNumber?: number;
  userVoteSupport?: VoteSupport;
  endDate?: Date;
  executedDate?: Date;
  queuedDate?: Date;
  expiredDate?: Date;
  executionEtaDate?: Date;
  cancelDate?: Date;
  startDate?: Date;
  createdDate?: Date;
  createdTxHash?: string;
  cancelTxHash?: string;
  executedTxHash?: string;
  queuedTxHash?: string;
}

export interface RemoteProposal {
  proposalId: number;
  chainId: ChainId;
  state: RemoteProposalState;
  proposalActions: ProposalAction[];
  remoteProposalId?: number;
  bridgedDate?: Date;
  failedDate?: Date;
  failedTxHash?: string;
  canceledDate?: Date;
  canceledTxHash?: string;
  queuedDate?: Date;
  queuedTxHash?: string;
  executionEtaDate?: Date;
  executedDate?: Date;
  executedTxHash?: string;
  expiredDate?: Date;
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
    proposalId: number;
    address: Address;
    votesMantissa: BigNumber;
    reason?: string;
    support: VoteSupport;
  }[];
}

export interface RewardsDistributor {
  vTokenAddress: string;
  rewardTokenAddress: string;
  lastRewardingSupplyBlockOrTimestamp: BigNumber;
  lastRewardingBorrowBlockOrTimestamp: BigNumber;
  supplySpeed: BigNumber;
  borrowSpeed: BigNumber;
  priceMantissa: BigNumber;
  rewardsDistributorContractAddress: string;
}

export interface Market {
  vTokenAddress: string;
  borrowerCount: number;
  supplierCount: number;
  supplyApyPercentage: BigNumber;
  borrowApyPercentage: BigNumber;
  borrowRatePerBlockOrTimestamp: BigNumber;
  supplyRatePerBlockOrTimestamp: BigNumber;
  exchangeRateMantissa: BigNumber;
  underlyingTokenAddress: string;
  underlyingTokenPriceMantissa: BigNumber;
  supplyCapsMantissa: BigNumber;
  borrowCapsMantissa: BigNumber;
  cashMantissa: BigNumber;
  reserveFactorMantissa: BigNumber;
  collateralFactorMantissa: BigNumber;
  totalReservesMantissa: BigNumber;
  totalBorrowsMantissa: BigNumber;
  totalSupplyMantissa: BigNumber;
  estimatedPrimeBorrowApyBoost: BigNumber | undefined;
  estimatedPrimeSupplyApyBoost: BigNumber | undefined;
  pausedActionsBitmap: number;
  isListed: boolean;
  rewardsDistributors: RewardsDistributor[];
}

export interface MarketSnapshot {
  // we are migrating these values to strings, as they are bigints instead of numbers
  blockNumber: string | number;
  blockTimestamp: string | number;
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
  userHasPendingWithdrawalsFromBeforeUpgrade?: boolean;
}

export interface VoterAccount {
  address: Address;
  proposalsVoted: number;
  stakedVotesMantissa: BigNumber;
  voteWeightPercent: string;
  votesMantissa: BigNumber;
  delegate?: Address;
}

export interface LockedDeposit {
  amountMantissa: BigNumber;
  unlockedAt: Date;
}

export type VoteDetail = {
  proposalId: number;
  votesMantissa: BigNumber;
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
  routePath: Address[];
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

export type ImportableProtocol = 'aave';

interface ImportableSupplyPositionBase {
  protocol: ImportableProtocol;
  tokenAddress: Address;
  userSupplyBalanceMantissa: bigint;
  supplyApyPercentage: number;
}

export interface ImportableAaveSupplyPosition extends ImportableSupplyPositionBase {
  protocol: 'aave';
  aTokenAddress: Address;
  userATokenBalanceMantissa: bigint;
  userATokenBalanceWithInterestsMantissa: bigint;
}

export type ImportableSupplyPosition = ImportableAaveSupplyPosition;
