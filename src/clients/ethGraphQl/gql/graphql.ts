/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: string;
};

export type Query = {
  __typename?: 'Query';
  contracts: Contracts;
};


export type QueryContractsArgs = {
  chainId: Scalars['Int'];
};

export type XvsVaultStorageV1_WithdrawalRequest = {
  __typename?: 'XVSVaultStorageV1_WithdrawalRequest';
  afterUpgrade: Scalars['BigInt'];
  amount: Scalars['BigInt'];
  lockedUntil: Scalars['BigInt'];
};

export type Bep20 = {
  __typename?: 'bep20';
  _decimals: Scalars['BigInt'];
  _name: Scalars['String'];
  _symbol: Scalars['String'];
  allowance: Scalars['BigInt'];
  balanceOf: Scalars['BigInt'];
  decimals: Scalars['BigInt'];
  getOwner: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['BigInt'];
};


export type Bep20AllowanceArgs = {
  owner: Scalars['String'];
  spender: Scalars['String'];
};


export type Bep20BalanceOfArgs = {
  account: Scalars['String'];
};

export type CheckpointsOutput = {
  __typename?: 'checkpointsOutput';
  fromBlock: Scalars['BigInt'];
  votes: Scalars['BigInt'];
};

export type Contracts = {
  __typename?: 'contracts';
  bep20: Array<Bep20>;
  xvsVault: XvsVault;
};


export type ContractsBep20Args = {
  addresses: Array<InputMaybe<Scalars['String']>>;
};

export type GetUserInfoOutput = {
  __typename?: 'getUserInfoOutput';
  amount: Scalars['BigInt'];
  pendingWithdrawals: Scalars['BigInt'];
  rewardDebt: Scalars['BigInt'];
};

export type PoolInfosOutput = {
  __typename?: 'poolInfosOutput';
  accRewardPerShare: Scalars['BigInt'];
  allocPoint: Scalars['BigInt'];
  lastRewardBlock: Scalars['BigInt'];
  lockPeriod: Scalars['BigInt'];
  token: Scalars['String'];
};

export type XvsVault = {
  __typename?: 'xvsVault';
  DELEGATION_TYPEHASH: Scalars['String'];
  DOMAIN_TYPEHASH: Scalars['String'];
  accessControlManager: Scalars['String'];
  admin: Scalars['String'];
  checkpoints: CheckpointsOutput;
  delegates: Scalars['String'];
  getCurrentVotes: Scalars['BigInt'];
  getEligibleWithdrawalAmount: Scalars['BigInt'];
  getPriorVotes: Scalars['BigInt'];
  getRequestedAmount: Scalars['BigInt'];
  getUserInfo: GetUserInfoOutput;
  getWithdrawalRequests: Array<XvsVaultStorageV1_WithdrawalRequest>;
  implementation: Scalars['String'];
  isStakedToken: Scalars['Boolean'];
  nonces: Scalars['BigInt'];
  numCheckpoints: Scalars['BigInt'];
  pendingAdmin: Scalars['String'];
  pendingReward: Scalars['BigInt'];
  pendingRewardTransfers: Scalars['BigInt'];
  pendingWithdrawalsBeforeUpgrade: Scalars['BigInt'];
  pendingXVSVaultImplementation: Scalars['String'];
  poolInfos: PoolInfosOutput;
  poolLength: Scalars['BigInt'];
  rewardTokenAmountsPerBlock: Scalars['BigInt'];
  totalAllocPoints: Scalars['BigInt'];
  vaultPaused: Scalars['Boolean'];
  xvsAddress: Scalars['String'];
  xvsStore: Scalars['String'];
};


export type XvsVaultCheckpointsArgs = {
  arg0: Scalars['String'];
  arg1: Scalars['BigInt'];
};


export type XvsVaultDelegatesArgs = {
  arg0: Scalars['String'];
};


export type XvsVaultGetCurrentVotesArgs = {
  account: Scalars['String'];
};


export type XvsVaultGetEligibleWithdrawalAmountArgs = {
  _pid: Scalars['BigInt'];
  _rewardToken: Scalars['String'];
  _user: Scalars['String'];
};


export type XvsVaultGetPriorVotesArgs = {
  account: Scalars['String'];
  blockNumber: Scalars['BigInt'];
};


export type XvsVaultGetRequestedAmountArgs = {
  _pid: Scalars['BigInt'];
  _rewardToken: Scalars['String'];
  _user: Scalars['String'];
};


export type XvsVaultGetUserInfoArgs = {
  _pid: Scalars['BigInt'];
  _rewardToken: Scalars['String'];
  _user: Scalars['String'];
};


export type XvsVaultGetWithdrawalRequestsArgs = {
  _pid: Scalars['BigInt'];
  _rewardToken: Scalars['String'];
  _user: Scalars['String'];
};


export type XvsVaultIsStakedTokenArgs = {
  arg0: Scalars['String'];
};


export type XvsVaultNoncesArgs = {
  arg0: Scalars['String'];
};


export type XvsVaultNumCheckpointsArgs = {
  arg0: Scalars['String'];
};


export type XvsVaultPendingRewardArgs = {
  _pid: Scalars['BigInt'];
  _rewardToken: Scalars['String'];
  _user: Scalars['String'];
};


export type XvsVaultPendingRewardTransfersArgs = {
  arg0: Scalars['String'];
  arg1: Scalars['String'];
};


export type XvsVaultPendingWithdrawalsBeforeUpgradeArgs = {
  _pid: Scalars['BigInt'];
  _rewardToken: Scalars['String'];
  _user: Scalars['String'];
};


export type XvsVaultPoolInfosArgs = {
  arg0: Scalars['String'];
  arg1: Scalars['BigInt'];
};


export type XvsVaultPoolLengthArgs = {
  rewardToken: Scalars['String'];
};


export type XvsVaultRewardTokenAmountsPerBlockArgs = {
  arg0: Scalars['String'];
};


export type XvsVaultTotalAllocPointsArgs = {
  arg0: Scalars['String'];
};

export type GetVaultsQueryVariables = Exact<{
  chainId: Scalars['Int'];
  xvsTokenAddress: Scalars['String'];
}>;


export type GetVaultsQuery = { __typename?: 'Query', contracts: { __typename?: 'contracts', xvsVault: { __typename?: 'xvsVault', poolLength: string, rewardTokenAmountsPerBlock: string, totalAllocPoints: string } } };


export const GetVaultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVaults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"xvsTokenAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contracts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"xvsVault"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poolLength"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"rewardToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"xvsTokenAddress"}}}]},{"kind":"Field","name":{"kind":"Name","value":"rewardTokenAmountsPerBlock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"arg0"},"value":{"kind":"Variable","name":{"kind":"Name","value":"xvsTokenAddress"}}}]},{"kind":"Field","name":{"kind":"Name","value":"totalAllocPoints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"arg0"},"value":{"kind":"Variable","name":{"kind":"Name","value":"xvsTokenAddress"}}}]}]}}]}}]}}]} as unknown as DocumentNode<GetVaultsQuery, GetVaultsQueryVariables>;