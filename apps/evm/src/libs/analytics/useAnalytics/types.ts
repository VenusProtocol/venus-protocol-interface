import type { ChainId, ImportableProtocol } from 'types';
import type { Address } from 'viem';

// These props are automatically set with every event, but we allow individual events to override
// them
type CommonProps = {
  chainId?: ChainId;
  walletAddress?: Address;
  walletProvider?: string;
  origin?: string;
  page?: string;
};

type AnalyticEvent = CommonProps & {
  variant?: string;
};

type AmountTx = AnalyticEvent & {
  poolName: string;
  assetSymbol: string;
  usdAmount: number;
};

type AmountSet = AmountTx & {
  maxSelected: boolean;
};

type BorrowWithdrawAmountSet = AmountSet & {
  safeBorrowLimitExceeded: boolean;
};

type RepayAmountSet = AmountSet & {
  selectedPercentage?: number;
};

type SwapAndSupply = AnalyticEvent & {
  poolName: string;
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  toTokenSymbol: string;
  toTokenAmountTokens: number;
  priceImpactPercentage: number;
  slippageTolerancePercentage: number;
  exchangeRate: number;
};

type CollateralChange = AnalyticEvent & {
  poolName: string;
  tokenSymbol: string;
  userSupplyBalanceTokens: number;
};

type Supply = AnalyticEvent & {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
};

type Withdraw = AnalyticEvent & {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
  withdrewFullSupply: boolean;
};

type Borrow = AnalyticEvent & {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
};

type Repay = AnalyticEvent & {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
  repaidFullLoan: boolean;
};

type SwapAndRepay = AnalyticEvent & {
  poolName: string;
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  toTokenSymbol: string;
  toTokenAmountTokens: number;
  priceImpactPercentage: number;
  slippageTolerancePercentage: number;
  exchangeRate: number;
  repaidFullLoan: boolean;
};

type Swap = AnalyticEvent & {
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  toTokenSymbol: string;
  toTokenAmountTokens: number;
  priceImpactPercentage: number;
  slippageTolerancePercentage: number;
  exchangeRate: number;
};

type XvsVaultTx = AnalyticEvent & {
  poolIndex: number;
  rewardTokenSymbol: string;
  tokenAmountTokens: number;
};

type XvsVaultClaim = AnalyticEvent & {
  poolIndex: number;
  rewardTokenSymbol: string;
};

type VaiVaultTx = AnalyticEvent & {
  tokenAmountTokens: number;
};

type RewardClaim = AnalyticEvent & {
  comptrollerAddress: string;
};

type Vote = AnalyticEvent & {
  proposalId: number;
  voteType: string;
};

type PositionImport = AnalyticEvent & {
  fromProtocol: ImportableProtocol;
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  fromTokenAmountDollars: number;
  fromTokenApyPercentage: number;
  toVTokenAddress: Address;
  toTokenApyPercentage: number;
};

type EventMap = {
  connect_wallet_initiated: AnalyticEvent;
  wallet_connected: AnalyticEvent;
  wallet_disconnected: AnalyticEvent;
  wallet_switched: AnalyticEvent;

  supply_amount_set: AmountSet;
  supply_initiated: AmountTx;
  supply_rejected: AmountTx;
  supply_signed: AmountTx;

  withdraw_amount_set: BorrowWithdrawAmountSet;
  withdraw_risks_acknowledged: BorrowWithdrawAmountSet;
  withdraw_initiated: AmountTx;
  withdraw_rejected: AmountTx;
  withdraw_signed: AmountTx;

  borrow_amount_set: BorrowWithdrawAmountSet;
  borrow_risks_acknowledged: BorrowWithdrawAmountSet;
  borrow_initiated: AmountTx;
  borrow_rejected: AmountTx;
  borrow_signed: AmountTx;

  repay_amount_set: RepayAmountSet;
  repay_initiated: AmountTx;
  repay_rejected: AmountTx;
  repay_signed: AmountTx;

  'Tokens swapped and supplied': SwapAndSupply;
  'Tokens swapped and repaid': SwapAndRepay;
  'Tokens swapped': Swap;
  'Tokens collateralized': CollateralChange;
  'Tokens decollateralized': CollateralChange;

  'Tokens supplied': Supply;
  'Tokens withdrawn': Withdraw;
  'Tokens borrowed': Borrow;
  'Tokens repaid': Repay;

  'Tokens staked in XVS vault': XvsVaultTx;
  'Token withdrawal requested from XVS vault': XvsVaultTx;
  'Token withdrawals executed from XVS vault': XvsVaultClaim;
  'XVS vesting vault reward claimed': XvsVaultClaim;
  'Tokens staked in VAI vault': VaiVaultTx;
  'Tokens withdrawn from VAI vault': VaiVaultTx;

  'Pool reward claimed': RewardClaim;
  'Prime reward claimed': AnalyticEvent;
  'VAI vault reward claimed': AnalyticEvent;

  'Vote cast': Vote;

  'Import positions modal displayed': AnalyticEvent;
  'Import positions modal closed': AnalyticEvent;
  'Position import initiated': PositionImport;
  'Position import status unknown': PositionImport;
  'Position import canceled': PositionImport;
  'Position imported': PositionImport;
};

export type AnalyticEventName = keyof EventMap;

export type AnalyticEventProps<T extends AnalyticEventName> = EventMap[T];
