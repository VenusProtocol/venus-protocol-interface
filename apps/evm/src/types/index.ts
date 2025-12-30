import type { Token as PSToken } from '@pancakeswap/sdk';
import type { ChainId, Token, VToken } from '@venusprotocol/chains';
import type { Omit } from '@wagmi/core/internal';
import type BigNumber from 'bignumber.js';
import type { VError } from 'libs/errors';
import type { Address, ByteArray, Hex } from 'viem';

export { ChainId, type Token, type VToken } from '@venusprotocol/chains';

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

export type TokenAction =
  | 'swapAndSupply'
  | 'boost'
  | 'supply'
  | 'withdraw'
  | 'borrow'
  | 'repay'
  | 'repayWithCollateral'
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

export interface GenericDistribution {
  type: 'intrinsic' | 'off-chain';
  token: Token;
  apyPercentage: BigNumber;
  dailyDistributedTokens: BigNumber;
  isActive: boolean;
  rewardDetails: {
    name: string;
    description: string;
  };
}

export type TokenDistribution =
  | RewardDistributorDistribution
  | PrimeDistribution
  | PrimeSimulationDistribution
  | MerklDistribution
  | GenericDistribution;

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
  isBorrowable: boolean;
  reserveFactor: number;
  collateralFactor: number;
  badDebtMantissa: bigint;
  liquidityCents: BigNumber;
  reserveTokens: BigNumber;
  cashTokens: BigNumber; // TODO: rename to liquidityTokens
  exchangeRateVTokens: BigNumber;
  liquidationThresholdPercentage: number;
  liquidationPenaltyPercentage: number;
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
  userCollateralFactor: number;
  userLiquidationThresholdPercentage: number;
  userBorrowLimitSharePercentage: number;
  isBorrowableByUser: boolean;
  isCollateralOfUser: boolean;
}

export interface AssetBalanceMutation {
  type: 'asset';
  vTokenAddress: Address;
  amountTokens: BigNumber;
  action: 'borrow' | 'repay' | 'withdraw' | 'supply';
  enableAsCollateralOfUser?: boolean;
}

export interface VaiBalanceMutation {
  type: 'vai';
  amountTokens: BigNumber;
  action: 'borrow' | 'repay';
}

export type BalanceMutation = AssetBalanceMutation | VaiBalanceMutation;

export interface SwapRouterAddressMapping {
  [poolComptrollerAddress: string]: string;
}

export interface EModeAssetSettings {
  vToken: VToken;
  collateralFactor: number;
  liquidationThresholdPercentage: number;
  liquidationPenaltyPercentage: number;
  isBorrowable: boolean;
}

export interface EModeGroup {
  id: number;
  name: string;
  isActive: boolean;
  assetSettings: EModeAssetSettings[];
  isIsolated: boolean;
}

export interface PoolVai {
  token: Token;
  tokenPriceCents: BigNumber;
  borrowAprPercentage: BigNumber;
  userBorrowBalanceTokens?: BigNumber;
  userBorrowBalanceCents?: BigNumber;
}

export interface Pool {
  comptrollerAddress: Address;
  name: string;
  isIsolated: boolean;
  assets: Asset[];
  eModeGroups: EModeGroup[];
  vai?: PoolVai;
  // User-specific props
  userSupplyBalanceCents?: BigNumber;
  userBorrowBalanceCents?: BigNumber;
  userBorrowLimitCents?: BigNumber;
  userLiquidationThresholdCents?: BigNumber;
  userYearlyEarningsCents?: BigNumber;
  userHealthFactor?: number;
  userEModeGroup?: EModeGroup;
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

export type SwapQuoteDirection = 'exact-in' | 'exact-out' | 'approximate-out';

interface SwapQuoteBase {
  fromToken: Token;
  toToken: Token;
  direction: SwapQuoteDirection;
  priceImpactPercentage: number;
  callData: Hex;
}

export interface ExactInSwapQuote extends SwapQuoteBase {
  fromTokenAmountSoldMantissa: bigint;
  expectedToTokenAmountReceivedMantissa: bigint;
  minimumToTokenAmountReceivedMantissa: bigint;
  direction: 'exact-in';
}

export interface ExactOutSwapQuote extends SwapQuoteBase {
  toTokenAmountReceivedMantissa: bigint;
  expectedFromTokenAmountSoldMantissa: bigint;
  maximumFromTokenAmountSoldMantissa: bigint;
  direction: 'exact-out';
}

export interface ApproximateOutSwapQuote extends SwapQuoteBase {
  fromTokenAmountSoldMantissa: bigint;
  expectedToTokenAmountReceivedMantissa: bigint;
  minimumToTokenAmountReceivedMantissa: bigint;
  direction: 'approximate-out';
}

export type SwapQuote = ExactInSwapQuote | ExactOutSwapQuote | ApproximateOutSwapQuote;
export type SwapQuoteError = VError<'swapQuote' | 'interaction'> | null;

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

export enum TxType {
  Mint = 'mint',
  Borrow = 'borrow',
  Redeem = 'redeem',
  Repay = 'repay',
  EnterMarket = 'enter_market',
  ExitMarket = 'exit_market',
  Approve = 'approve',
}
