import type { ImportableProtocol } from 'types';
import type { Address } from 'viem';

type AmountTx = {
  poolName: string;
  assetSymbol: string;
  usdAmount: number;
};

type AmountSet = AmountTx & {
  maxSelected: boolean;
};

type RepayAmountSet = AmountSet & {
  selectedPercentage?: number;
};

type SwapAndSupply = {
  poolName: string;
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  toTokenSymbol: string;
  toTokenAmountTokens: number;
  priceImpactPercentage: number;
  slippageTolerancePercentage: number;
  exchangeRate: number;
};

type CollateralChange = {
  poolName: string;
  tokenSymbol: string;
  userSupplyBalanceTokens: number;
};

type Supply = {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
};

type Withdraw = {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
  withdrewFullSupply: boolean;
};

type Borrow = {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
};

type Repay = {
  poolName: string;
  tokenSymbol: string;
  tokenAmountTokens: number;
  repaidFullLoan: boolean;
};

type SwapAndRepay = {
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

type Swap = {
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  toTokenSymbol: string;
  toTokenAmountTokens: number;
  priceImpactPercentage: number;
  slippageTolerancePercentage: number;
  exchangeRate: number;
};

type XvsVaultTx = {
  poolIndex: number;
  rewardTokenSymbol: string;
  tokenAmountTokens: number;
};

type XvsVaultClaim = {
  poolIndex: number;
  rewardTokenSymbol: string;
};

type VaiVaultTx = {
  tokenAmountTokens: number;
};

type RewardClaim = {
  comptrollerAddress: string;
};

type Vote = {
  proposalId: number;
  voteType: string;
};

type PositionImport = {
  fromProtocol: ImportableProtocol;
  fromTokenSymbol: string;
  fromTokenAmountTokens: number;
  fromTokenAmountDollars: number;
  fromTokenApyPercentage: number;
  toVTokenAddress: Address;
  toTokenApyPercentage: number;
};

type EventMap = {
  supply_amount_set: AmountSet;
  supply_initiated: AmountTx;
  supply_rejected: AmountTx;
  supply_signed: AmountTx;

  withdraw_amount_set: AmountSet;
  withdraw_initiated: AmountTx;
  withdraw_rejected: AmountTx;
  withdraw_signed: AmountTx;

  borrow_amount_set: AmountSet;
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
  'Prime reward claimed': undefined;
  'VAI vault reward claimed': undefined;

  'Vote cast': Vote;

  'Import positions modal displayed': undefined;
  'Import positions modal closed': undefined;
  'Position import initiated': PositionImport;
  'Position import status unknown': PositionImport;
  'Position import canceled': PositionImport;
  'Position imported': PositionImport;
};

export type AnalyticEventName = keyof EventMap;

export type AnalyticEventProps<T extends AnalyticEventName> = EventMap[T];
