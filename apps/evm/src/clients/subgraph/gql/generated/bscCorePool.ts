import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

/**
 * Account is an BNB address, with a list of all vToken markets the account has
 * participated in, along with liquidation information.
 *
 */
export type Account = {
  __typename?: 'Account';
  /** Account address */
  address: Scalars['Bytes']['output'];
  /** Count user has been liquidated */
  countLiquidated: Scalars['Int']['output'];
  /** Count user has liquidated others */
  countLiquidator: Scalars['Int']['output'];
  /** True if user has ever borrowed */
  hasBorrowed: Scalars['Boolean']['output'];
  /** Account address */
  id: Scalars['Bytes']['output'];
  /** Array of VTokens user is in */
  tokens: Array<MarketPosition>;
};


/**
 * Account is an BNB address, with a list of all vToken markets the account has
 * participated in, along with liquidation information.
 *
 */
export type AccountTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MarketPosition_Filter>;
};

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  countLiquidated?: InputMaybe<Scalars['Int']['input']>;
  countLiquidated_gt?: InputMaybe<Scalars['Int']['input']>;
  countLiquidated_gte?: InputMaybe<Scalars['Int']['input']>;
  countLiquidated_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  countLiquidated_lt?: InputMaybe<Scalars['Int']['input']>;
  countLiquidated_lte?: InputMaybe<Scalars['Int']['input']>;
  countLiquidated_not?: InputMaybe<Scalars['Int']['input']>;
  countLiquidated_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  countLiquidator?: InputMaybe<Scalars['Int']['input']>;
  countLiquidator_gt?: InputMaybe<Scalars['Int']['input']>;
  countLiquidator_gte?: InputMaybe<Scalars['Int']['input']>;
  countLiquidator_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  countLiquidator_lt?: InputMaybe<Scalars['Int']['input']>;
  countLiquidator_lte?: InputMaybe<Scalars['Int']['input']>;
  countLiquidator_not?: InputMaybe<Scalars['Int']['input']>;
  countLiquidator_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hasBorrowed?: InputMaybe<Scalars['Boolean']['input']>;
  hasBorrowed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  hasBorrowed_not?: InputMaybe<Scalars['Boolean']['input']>;
  hasBorrowed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  tokens_?: InputMaybe<MarketPosition_Filter>;
};

export enum Account_OrderBy {
  Address = 'address',
  CountLiquidated = 'countLiquidated',
  CountLiquidator = 'countLiquidator',
  HasBorrowed = 'hasBorrowed',
  Id = 'id',
  Tokens = 'tokens'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * The Comptroller type has protocol level variables stored
 *
 */
export type Comptroller = {
  __typename?: 'Comptroller';
  /** Comptroller Address */
  address: Scalars['Bytes']['output'];
  /** Factor used to determine repayAmount for liquidating */
  closeFactorMantissa: Scalars['BigInt']['output'];
  /** ID is set to comptroller address */
  id: Scalars['Bytes']['output'];
  /** The percent bonus liquidators get for liquidating */
  liquidationIncentive: Scalars['BigInt']['output'];
  /** Address of price oracle the comptroller uses */
  priceOracle: Scalars['Bytes']['output'];
};

export type Comptroller_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Comptroller_Filter>>>;
  closeFactorMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactorMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactorMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactorMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  closeFactorMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactorMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactorMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactorMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  liquidationIncentive?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidationIncentive_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Comptroller_Filter>>>;
  priceOracle?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_contains?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_gt?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_gte?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  priceOracle_lt?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_lte?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_not?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  priceOracle_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Comptroller_OrderBy {
  Address = 'address',
  CloseFactorMantissa = 'closeFactorMantissa',
  Id = 'id',
  LiquidationIncentive = 'liquidationIncentive',
  PriceOracle = 'priceOracle'
}

export enum EventType {
  Borrow = 'BORROW',
  Liquidate = 'LIQUIDATE',
  Mint = 'MINT',
  MintBehalf = 'MINT_BEHALF',
  Redeem = 'REDEEM',
  Repay = 'REPAY',
  Transfer = 'TRANSFER'
}

/**
 * Market stores all high level variables for a vToken market
 *
 */
export type Market = {
  __typename?: 'Market';
  /** Accounts who participate in this market */
  accounts: Array<MarketPosition>;
  /** Block the market is updated to */
  accrualBlockNumber: Scalars['BigInt']['output'];
  /** Vtoken Address */
  address: Scalars['Bytes']['output'];
  /** The history of the markets borrow index return (Think S&P 500) */
  borrowIndex: Scalars['BigInt']['output'];
  /** Borrow rate per block */
  borrowRateMantissa: Scalars['BigInt']['output'];
  /** Number of accounts currently borrowing from this market */
  borrowerCount: Scalars['BigInt']['output'];
  /** The vToken contract balance of BEP20 or BNB */
  cashMantissa: Scalars['BigInt']['output'];
  /** Collateral factor determining how much one can borrow */
  collateralFactorMantissa: Scalars['BigInt']['output'];
  /** Exchange rate of tokens / vTokens */
  exchangeRateMantissa: Scalars['BigInt']['output'];
  /** VToken address */
  id: Scalars['Bytes']['output'];
  /** Address of the interest rate model */
  interestRateModelAddress: Scalars['Bytes']['output'];
  /** Flag indicating if the market is listed */
  isListed: Scalars['Boolean']['output'];
  /** Block price was last updated */
  lastUnderlyingPriceBlockNumber: Scalars['BigInt']['output'];
  /** Last recorded Underlying token price in USD cents */
  lastUnderlyingPriceCents: Scalars['BigInt']['output'];
  /** Name of the vToken */
  name: Scalars['String']['output'];
  /** The factor determining interest that goes to reserves */
  reserveFactorMantissa: Scalars['BigInt']['output'];
  /** Reserves stored in the contract */
  reservesMantissa: Scalars['BigInt']['output'];
  /** Number of accounts currently supplying to this market */
  supplierCount: Scalars['BigInt']['output'];
  /** Supply rate per block */
  supplyRateMantissa: Scalars['BigInt']['output'];
  /** VToken symbol */
  symbol: Scalars['String']['output'];
  /** Borrows in the market */
  totalBorrowsMantissa: Scalars['BigInt']['output'];
  /** Total vToken supplied */
  totalSupplyVTokenMantissa: Scalars['BigInt']['output'];
  /** Total XVS Distributed for this market */
  totalXvsDistributedMantissa: Scalars['BigInt']['output'];
  /** Underlying Token */
  underlyingToken: Token;
  /** vToken decimal length */
  vTokenDecimals: Scalars['Int']['output'];
  /** The rate at which XVS is distributed to the corresponding borrow market (per block) */
  xvsBorrowSpeed: Scalars['BigInt']['output'];
  /** XVS Reward Distribution Block */
  xvsBorrowStateBlock: Scalars['BigInt']['output'];
  /** XVS Reward Distribution Index */
  xvsBorrowStateIndex: Scalars['BigInt']['output'];
  /** The rate at which XVS is distributed to the corresponding supply market (per block) */
  xvsSupplySpeed: Scalars['BigInt']['output'];
  /** XVS Supply Distribution Block */
  xvsSupplyStateBlock: Scalars['BigInt']['output'];
  /** XVS Supply Distribution Index */
  xvsSupplyStateIndex: Scalars['BigInt']['output'];
};


/**
 * Market stores all high level variables for a vToken market
 *
 */
export type MarketAccountsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MarketPosition_Filter>;
};

/**
 * MarketPosition is a single account within a single vToken market
 *
 */
export type MarketPosition = {
  __typename?: 'MarketPosition';
  /** Relation to user */
  account: Account;
  /** Block the position is updated to */
  accrualBlockNumber: Scalars['BigInt']['output'];
  /** Borrow Index this position last accrued interest */
  borrowIndex: Scalars['BigInt']['output'];
  /** True if user is entered, false if they are exited */
  enteredMarket: Scalars['Boolean']['output'];
  /** Concatenation of VToken address and user address */
  id: Scalars['Bytes']['output'];
  /** Relation to market */
  market: Market;
  /** Stored borrow balance stored in contract (exclusive of interest since accrualBlockNumber) */
  storedBorrowBalanceMantissa: Scalars['BigInt']['output'];
  /** Total amount of underlying redeemed */
  totalUnderlyingRedeemedMantissa: Scalars['BigInt']['output'];
  /** Total amount underlying repaid */
  totalUnderlyingRepaidMantissa: Scalars['BigInt']['output'];
  /** VToken balance of the user */
  vTokenBalanceMantissa: Scalars['BigInt']['output'];
};

export type MarketPosition_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accrualBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accrualBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<MarketPosition_Filter>>>;
  borrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  enteredMarket?: InputMaybe<Scalars['Boolean']['input']>;
  enteredMarket_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  enteredMarket_not?: InputMaybe<Scalars['Boolean']['input']>;
  enteredMarket_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  market?: InputMaybe<Scalars['String']['input']>;
  market_?: InputMaybe<Market_Filter>;
  market_contains?: InputMaybe<Scalars['String']['input']>;
  market_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  market_ends_with?: InputMaybe<Scalars['String']['input']>;
  market_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  market_gt?: InputMaybe<Scalars['String']['input']>;
  market_gte?: InputMaybe<Scalars['String']['input']>;
  market_in?: InputMaybe<Array<Scalars['String']['input']>>;
  market_lt?: InputMaybe<Scalars['String']['input']>;
  market_lte?: InputMaybe<Scalars['String']['input']>;
  market_not?: InputMaybe<Scalars['String']['input']>;
  market_not_contains?: InputMaybe<Scalars['String']['input']>;
  market_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  market_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  market_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  market_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  market_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  market_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  market_starts_with?: InputMaybe<Scalars['String']['input']>;
  market_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<MarketPosition_Filter>>>;
  storedBorrowBalanceMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  storedBorrowBalanceMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  storedBorrowBalanceMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  storedBorrowBalanceMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  storedBorrowBalanceMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  storedBorrowBalanceMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  storedBorrowBalanceMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  storedBorrowBalanceMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlyingRedeemedMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRedeemedMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRedeemedMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRedeemedMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlyingRedeemedMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRedeemedMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRedeemedMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRedeemedMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlyingRepaidMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRepaidMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRepaidMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRepaidMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlyingRepaidMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRepaidMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRepaidMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlyingRepaidMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vTokenBalanceMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  vTokenBalanceMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vTokenBalanceMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vTokenBalanceMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vTokenBalanceMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vTokenBalanceMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vTokenBalanceMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  vTokenBalanceMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum MarketPosition_OrderBy {
  Account = 'account',
  AccountAddress = 'account__address',
  AccountCountLiquidated = 'account__countLiquidated',
  AccountCountLiquidator = 'account__countLiquidator',
  AccountHasBorrowed = 'account__hasBorrowed',
  AccountId = 'account__id',
  AccrualBlockNumber = 'accrualBlockNumber',
  BorrowIndex = 'borrowIndex',
  EnteredMarket = 'enteredMarket',
  Id = 'id',
  Market = 'market',
  MarketAccrualBlockNumber = 'market__accrualBlockNumber',
  MarketAddress = 'market__address',
  MarketBorrowIndex = 'market__borrowIndex',
  MarketBorrowRateMantissa = 'market__borrowRateMantissa',
  MarketBorrowerCount = 'market__borrowerCount',
  MarketCashMantissa = 'market__cashMantissa',
  MarketCollateralFactorMantissa = 'market__collateralFactorMantissa',
  MarketExchangeRateMantissa = 'market__exchangeRateMantissa',
  MarketId = 'market__id',
  MarketInterestRateModelAddress = 'market__interestRateModelAddress',
  MarketIsListed = 'market__isListed',
  MarketLastUnderlyingPriceBlockNumber = 'market__lastUnderlyingPriceBlockNumber',
  MarketLastUnderlyingPriceCents = 'market__lastUnderlyingPriceCents',
  MarketName = 'market__name',
  MarketReserveFactorMantissa = 'market__reserveFactorMantissa',
  MarketReservesMantissa = 'market__reservesMantissa',
  MarketSupplierCount = 'market__supplierCount',
  MarketSupplyRateMantissa = 'market__supplyRateMantissa',
  MarketSymbol = 'market__symbol',
  MarketTotalBorrowsMantissa = 'market__totalBorrowsMantissa',
  MarketTotalSupplyVTokenMantissa = 'market__totalSupplyVTokenMantissa',
  MarketTotalXvsDistributedMantissa = 'market__totalXvsDistributedMantissa',
  MarketVTokenDecimals = 'market__vTokenDecimals',
  MarketXvsBorrowSpeed = 'market__xvsBorrowSpeed',
  MarketXvsBorrowStateBlock = 'market__xvsBorrowStateBlock',
  MarketXvsBorrowStateIndex = 'market__xvsBorrowStateIndex',
  MarketXvsSupplySpeed = 'market__xvsSupplySpeed',
  MarketXvsSupplyStateBlock = 'market__xvsSupplyStateBlock',
  MarketXvsSupplyStateIndex = 'market__xvsSupplyStateIndex',
  StoredBorrowBalanceMantissa = 'storedBorrowBalanceMantissa',
  TotalUnderlyingRedeemedMantissa = 'totalUnderlyingRedeemedMantissa',
  TotalUnderlyingRepaidMantissa = 'totalUnderlyingRepaidMantissa',
  VTokenBalanceMantissa = 'vTokenBalanceMantissa'
}

export type Market_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accounts_?: InputMaybe<MarketPosition_Filter>;
  accrualBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accrualBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  accrualBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Market_Filter>>>;
  borrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowRateMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRateMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRateMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRateMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowRateMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRateMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRateMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRateMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowerCount?: InputMaybe<Scalars['BigInt']['input']>;
  borrowerCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowerCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowerCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowerCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowerCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowerCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowerCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cashMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  cashMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cashMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cashMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cashMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cashMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cashMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  cashMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralFactorMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactorMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactorMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactorMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralFactorMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactorMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactorMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactorMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRateMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRateMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interestRateModelAddress?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interestRateModelAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  interestRateModelAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  isListed?: InputMaybe<Scalars['Boolean']['input']>;
  isListed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isListed_not?: InputMaybe<Scalars['Boolean']['input']>;
  isListed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  lastUnderlyingPriceBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUnderlyingPriceBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUnderlyingPriceCents?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceCents_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceCents_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceCents_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUnderlyingPriceCents_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceCents_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceCents_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUnderlyingPriceCents_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Market_Filter>>>;
  reserveFactorMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactorMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactorMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactorMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveFactorMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactorMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactorMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactorMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reservesMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  reservesMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reservesMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reservesMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reservesMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reservesMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reservesMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  reservesMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supplierCount?: InputMaybe<Scalars['BigInt']['input']>;
  supplierCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supplierCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supplierCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supplierCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supplierCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supplierCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  supplierCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supplyRateMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRateMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRateMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRateMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supplyRateMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRateMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRateMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRateMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalBorrowsMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrowsMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrowsMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrowsMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBorrowsMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrowsMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrowsMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrowsMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupplyVTokenMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyVTokenMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyVTokenMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyVTokenMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupplyVTokenMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyVTokenMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyVTokenMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyVTokenMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalXvsDistributedMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalXvsDistributedMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalXvsDistributedMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalXvsDistributedMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalXvsDistributedMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalXvsDistributedMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalXvsDistributedMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalXvsDistributedMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingToken?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_?: InputMaybe<Token_Filter>;
  underlyingToken_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_lt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_lte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vTokenDecimals?: InputMaybe<Scalars['Int']['input']>;
  vTokenDecimals_gt?: InputMaybe<Scalars['Int']['input']>;
  vTokenDecimals_gte?: InputMaybe<Scalars['Int']['input']>;
  vTokenDecimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  vTokenDecimals_lt?: InputMaybe<Scalars['Int']['input']>;
  vTokenDecimals_lte?: InputMaybe<Scalars['Int']['input']>;
  vTokenDecimals_not?: InputMaybe<Scalars['Int']['input']>;
  vTokenDecimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  xvsBorrowSpeed?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowSpeed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowSpeed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowSpeed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsBorrowSpeed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowSpeed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowSpeed_not?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowSpeed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsBorrowStateBlock?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsBorrowStateBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsBorrowStateIndex?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsBorrowStateIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  xvsBorrowStateIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsSupplySpeed?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplySpeed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplySpeed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplySpeed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsSupplySpeed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplySpeed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplySpeed_not?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplySpeed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsSupplyStateBlock?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsSupplyStateBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsSupplyStateIndex?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xvsSupplyStateIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  xvsSupplyStateIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Market_OrderBy {
  Accounts = 'accounts',
  AccrualBlockNumber = 'accrualBlockNumber',
  Address = 'address',
  BorrowIndex = 'borrowIndex',
  BorrowRateMantissa = 'borrowRateMantissa',
  BorrowerCount = 'borrowerCount',
  CashMantissa = 'cashMantissa',
  CollateralFactorMantissa = 'collateralFactorMantissa',
  ExchangeRateMantissa = 'exchangeRateMantissa',
  Id = 'id',
  InterestRateModelAddress = 'interestRateModelAddress',
  IsListed = 'isListed',
  LastUnderlyingPriceBlockNumber = 'lastUnderlyingPriceBlockNumber',
  LastUnderlyingPriceCents = 'lastUnderlyingPriceCents',
  Name = 'name',
  ReserveFactorMantissa = 'reserveFactorMantissa',
  ReservesMantissa = 'reservesMantissa',
  SupplierCount = 'supplierCount',
  SupplyRateMantissa = 'supplyRateMantissa',
  Symbol = 'symbol',
  TotalBorrowsMantissa = 'totalBorrowsMantissa',
  TotalSupplyVTokenMantissa = 'totalSupplyVTokenMantissa',
  TotalXvsDistributedMantissa = 'totalXvsDistributedMantissa',
  UnderlyingToken = 'underlyingToken',
  UnderlyingTokenAddress = 'underlyingToken__address',
  UnderlyingTokenDecimals = 'underlyingToken__decimals',
  UnderlyingTokenId = 'underlyingToken__id',
  UnderlyingTokenName = 'underlyingToken__name',
  UnderlyingTokenSymbol = 'underlyingToken__symbol',
  VTokenDecimals = 'vTokenDecimals',
  XvsBorrowSpeed = 'xvsBorrowSpeed',
  XvsBorrowStateBlock = 'xvsBorrowStateBlock',
  XvsBorrowStateIndex = 'xvsBorrowStateIndex',
  XvsSupplySpeed = 'xvsSupplySpeed',
  XvsSupplyStateBlock = 'xvsSupplyStateBlock',
  XvsSupplyStateIndex = 'xvsSupplyStateIndex'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  comptroller?: Maybe<Comptroller>;
  comptrollers: Array<Comptroller>;
  market?: Maybe<Market>;
  marketPosition?: Maybe<MarketPosition>;
  marketPositions: Array<MarketPosition>;
  markets: Array<Market>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryComptrollerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryComptrollersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Comptroller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Comptroller_Filter>;
};


export type QueryMarketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketPosition_Filter>;
};


export type QueryMarketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Market_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Market_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  comptroller?: Maybe<Comptroller>;
  comptrollers: Array<Comptroller>;
  market?: Maybe<Market>;
  marketPosition?: Maybe<MarketPosition>;
  marketPositions: Array<MarketPosition>;
  markets: Array<Market>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type SubscriptionComptrollerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionComptrollersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Comptroller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Comptroller_Filter>;
};


export type SubscriptionMarketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMarketPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMarketPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketPosition_Filter>;
};


export type SubscriptionMarketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Market_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Market_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

/**
 * ERC20 Token
 *
 */
export type Token = {
  __typename?: 'Token';
  /** Address of the asset */
  address: Scalars['Bytes']['output'];
  /** Decimals of the asset */
  decimals: Scalars['Int']['output'];
  /** Address of the asset */
  id: Scalars['Bytes']['output'];
  /** Name of the asset */
  name: Scalars['String']['output'];
  /** Symbol of the asset */
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Token_OrderBy {
  Address = 'address',
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol'
}

/**
 * An interface for a transfer of any vToken. TransferEvent, MintEvent,
 * RedeemEvent, and LiquidationEvent all use this interface
 *
 */
export type Transaction = {
  __typename?: 'Transaction';
  /** count of vTokens transferred */
  amountMantissa: Scalars['BigInt']['output'];
  /** Block number */
  blockNumber: Scalars['Int']['output'];
  /** Block time */
  blockTime: Scalars['Int']['output'];
  /** The account that sent the tokens, usually vToken */
  from: Scalars['Bytes']['output'];
  /** Transaction hash concatenated with log index */
  id: Scalars['Bytes']['output'];
  /** Account that received tokens */
  to: Scalars['Bytes']['output'];
  /** enum of event type */
  type: EventType;
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  amountMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockTime?: InputMaybe<Scalars['Int']['input']>;
  blockTime_gt?: InputMaybe<Scalars['Int']['input']>;
  blockTime_gte?: InputMaybe<Scalars['Int']['input']>;
  blockTime_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockTime_lt?: InputMaybe<Scalars['Int']['input']>;
  blockTime_lte?: InputMaybe<Scalars['Int']['input']>;
  blockTime_not?: InputMaybe<Scalars['Int']['input']>;
  blockTime_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_gt?: InputMaybe<Scalars['Bytes']['input']>;
  from_gte?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_lt?: InputMaybe<Scalars['Bytes']['input']>;
  from_lte?: InputMaybe<Scalars['Bytes']['input']>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_gt?: InputMaybe<Scalars['Bytes']['input']>;
  to_gte?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_lt?: InputMaybe<Scalars['Bytes']['input']>;
  to_lte?: InputMaybe<Scalars['Bytes']['input']>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum Transaction_OrderBy {
  AmountMantissa = 'amountMantissa',
  BlockNumber = 'blockNumber',
  BlockTime = 'blockTime',
  From = 'from',
  Id = 'id',
  To = 'to',
  Type = 'type'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}


export const BscCorePoolParticipantsCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BscCorePoolParticipantsCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"supplierCount"}},{"kind":"Field","name":{"kind":"Name","value":"borrowerCount"}}]}}]}}]} as unknown as DocumentNode<BscCorePoolParticipantsCountQuery, BscCorePoolParticipantsCountQueryVariables>;
export type BscCorePoolParticipantsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type BscCorePoolParticipantsCountQuery = { __typename?: 'Query', markets: Array<{ __typename?: 'Market', id: any, supplierCount: any, borrowerCount: any }> };
