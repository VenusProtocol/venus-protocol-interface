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

export type Delegate = {
  __typename?: 'Delegate';
  /** Accounts delegating to this voter */
  delegateCount: Scalars['Int']['output'];
  /** Id of account receiving this accounts delegation */
  delegatee?: Maybe<Delegate>;
  /** Accounts delegating to this voter */
  delegators: Array<Delegate>;
  /** A Delegate is any address that has been delegated with voting tokens by a token holder, id is the blockchain address of said delegate */
  id: Scalars['Bytes']['output'];
  /** Proposals that the delegate has created */
  proposals: Array<Proposal>;
  /** Amount of XVS this user has staked */
  stakedXvsMantissa: Scalars['BigInt']['output'];
  /** Total amount of votes via delegation and staking */
  totalVotesMantissa: Scalars['BigInt']['output'];
  /** Votes that a delegate has made in different proposals */
  votes: Array<Vote>;
};


export type DelegateDelegatorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Delegate_Filter>;
};


export type DelegateProposalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Proposal_Filter>;
};


export type DelegateVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vote_Filter>;
};

export type Delegate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  delegateCount?: InputMaybe<Scalars['Int']['input']>;
  delegateCount_gt?: InputMaybe<Scalars['Int']['input']>;
  delegateCount_gte?: InputMaybe<Scalars['Int']['input']>;
  delegateCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegateCount_lt?: InputMaybe<Scalars['Int']['input']>;
  delegateCount_lte?: InputMaybe<Scalars['Int']['input']>;
  delegateCount_not?: InputMaybe<Scalars['Int']['input']>;
  delegateCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatee?: InputMaybe<Scalars['String']['input']>;
  delegatee_?: InputMaybe<Delegate_Filter>;
  delegatee_contains?: InputMaybe<Scalars['String']['input']>;
  delegatee_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegatee_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegatee_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegatee_gt?: InputMaybe<Scalars['String']['input']>;
  delegatee_gte?: InputMaybe<Scalars['String']['input']>;
  delegatee_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegatee_lt?: InputMaybe<Scalars['String']['input']>;
  delegatee_lte?: InputMaybe<Scalars['String']['input']>;
  delegatee_not?: InputMaybe<Scalars['String']['input']>;
  delegatee_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegatee_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegatee_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegatee_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegatee_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegatee_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegatee_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegatee_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegatee_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegators_?: InputMaybe<Delegate_Filter>;
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
  or?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  stakedXvsMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  stakedXvsMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedXvsMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedXvsMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedXvsMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedXvsMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedXvsMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedXvsMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVotesMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVotesMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Delegate_OrderBy {
  DelegateCount = 'delegateCount',
  Delegatee = 'delegatee',
  DelegateeDelegateCount = 'delegatee__delegateCount',
  DelegateeId = 'delegatee__id',
  DelegateeStakedXvsMantissa = 'delegatee__stakedXvsMantissa',
  DelegateeTotalVotesMantissa = 'delegatee__totalVotesMantissa',
  Delegators = 'delegators',
  Id = 'id',
  Proposals = 'proposals',
  StakedXvsMantissa = 'stakedXvsMantissa',
  TotalVotesMantissa = 'totalVotesMantissa',
  Votes = 'votes'
}

export type Governance = {
  __typename?: 'Governance';
  /** Administrator for this contract */
  admin: Scalars['Bytes']['output'];
  /** A privileged role that can cancel any proposal */
  guardian: Scalars['Bytes']['output'];
  /** Unique entity used to keep track of common aggregated data */
  id: Scalars['ID']['output'];
  /** Active brains of Governor */
  implementation: Scalars['Bytes']['output'];
  /** Pending administrator for this contract */
  pendingAdmin?: Maybe<Scalars['Bytes']['output']>;
  /** The maximum number of actions that can be included in a proposal */
  proposalMaxOperations: Scalars['BigInt']['output'];
  /** The number of votes required to reach quorum */
  quorumVotesMantissa: Scalars['BigInt']['output'];
  /** Total number of accounts participating in governance as delegates or by delegating */
  totalDelegates: Scalars['BigInt']['output'];
  /** Number of proposals created */
  totalProposals: Scalars['BigInt']['output'];
  /** Total number of accounts delegates that can participate in governance by voting or creating proposals */
  totalVoters: Scalars['BigInt']['output'];
  /** Total number of votes delegated expressed in the smallest unit of XVS */
  totalVotesMantissa: Scalars['BigInt']['output'];
};

export type Governance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admin?: InputMaybe<Scalars['Bytes']['input']>;
  admin_contains?: InputMaybe<Scalars['Bytes']['input']>;
  admin_gt?: InputMaybe<Scalars['Bytes']['input']>;
  admin_gte?: InputMaybe<Scalars['Bytes']['input']>;
  admin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  admin_lt?: InputMaybe<Scalars['Bytes']['input']>;
  admin_lte?: InputMaybe<Scalars['Bytes']['input']>;
  admin_not?: InputMaybe<Scalars['Bytes']['input']>;
  admin_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  admin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  guardian?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_contains?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_gt?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_gte?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  guardian_lt?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_lte?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_not?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  guardian_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  implementation?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_gt?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_gte?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  implementation_lt?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_lte?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_not?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementation_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  pendingAdmin?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pendingAdmin_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_not?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pendingAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  proposalMaxOperations?: InputMaybe<Scalars['BigInt']['input']>;
  proposalMaxOperations_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalMaxOperations_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalMaxOperations_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalMaxOperations_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalMaxOperations_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalMaxOperations_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalMaxOperations_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotesMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotesMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotesMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotesMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotesMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotesMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotesMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotesMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalProposals?: InputMaybe<Scalars['BigInt']['input']>;
  totalProposals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalProposals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalProposals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalProposals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalProposals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalProposals_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalProposals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVoters?: InputMaybe<Scalars['BigInt']['input']>;
  totalVoters_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalVoters_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalVoters_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVoters_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalVoters_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalVoters_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalVoters_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVotesMantissa?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVotesMantissa_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalVotesMantissa_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Governance_OrderBy {
  Admin = 'admin',
  Guardian = 'guardian',
  Id = 'id',
  Implementation = 'implementation',
  PendingAdmin = 'pendingAdmin',
  ProposalMaxOperations = 'proposalMaxOperations',
  QuorumVotesMantissa = 'quorumVotesMantissa',
  TotalDelegates = 'totalDelegates',
  TotalProposals = 'totalProposals',
  TotalVoters = 'totalVoters',
  TotalVotesMantissa = 'totalVotesMantissa'
}

export type MaxDailyLimit = {
  __typename?: 'MaxDailyLimit';
  /** Chain Id that is approved to receive messages */
  destinationChainId: Scalars['BigInt']['output'];
  /** Destination Chain Id as bytes */
  id: Scalars['Bytes']['output'];
  /** Maximum Number of messages that can be set to the destination chain */
  max: Scalars['BigInt']['output'];
};

export type MaxDailyLimit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MaxDailyLimit_Filter>>>;
  destinationChainId?: InputMaybe<Scalars['BigInt']['input']>;
  destinationChainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  destinationChainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  destinationChainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  destinationChainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  destinationChainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  destinationChainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  destinationChainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  max?: InputMaybe<Scalars['BigInt']['input']>;
  max_gt?: InputMaybe<Scalars['BigInt']['input']>;
  max_gte?: InputMaybe<Scalars['BigInt']['input']>;
  max_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  max_lt?: InputMaybe<Scalars['BigInt']['input']>;
  max_lte?: InputMaybe<Scalars['BigInt']['input']>;
  max_not?: InputMaybe<Scalars['BigInt']['input']>;
  max_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MaxDailyLimit_Filter>>>;
};

export enum MaxDailyLimit_OrderBy {
  DestinationChainId = 'destinationChainId',
  Id = 'id',
  Max = 'max'
}

export type OmnichainProposalSender = {
  __typename?: 'OmnichainProposalSender';
  /** Access Control Manager for the Omnichain Proposal Sender */
  accessControlManagerAddress: Scalars['Bytes']['output'];
  /** Address of the Omnichain Proposal Sender */
  address: Scalars['Bytes']['output'];
  id: Scalars['Bytes']['output'];
  /** Flag for if the Omnichain Proposal Sender is paused */
  paused: Scalars['Boolean']['output'];
};

export type OmnichainProposalSender_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accessControlManagerAddress?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  accessControlManagerAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  accessControlManagerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  and?: InputMaybe<Array<InputMaybe<OmnichainProposalSender_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<OmnichainProposalSender_Filter>>>;
  paused?: InputMaybe<Scalars['Boolean']['input']>;
  paused_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  paused_not?: InputMaybe<Scalars['Boolean']['input']>;
  paused_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export enum OmnichainProposalSender_OrderBy {
  AccessControlManagerAddress = 'accessControlManagerAddress',
  Address = 'address',
  Id = 'id',
  Paused = 'paused'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum Proposal_Type {
  Critical = 'CRITICAL',
  FastTrack = 'FAST_TRACK',
  Normal = 'NORMAL'
}

export type Permission = {
  __typename?: 'Permission';
  /** The target account of the event */
  accountAddress: Scalars['Bytes']['output'];
  /** Created At Transaction Hash */
  createdAt: Scalars['Bytes']['output'];
  /** Id generated for each Permission */
  id: Scalars['Bytes']['output'];
  /** The role made of the contract address and function signature encode packed */
  role: Scalars['Bytes']['output'];
  /** Indicates if the permission was either GRANTED or REVOKED */
  status: PermissionStatus;
  /** UpdatedAt At Transaction Hash */
  updatedAt: Scalars['Bytes']['output'];
};

export enum PermissionStatus {
  Granted = 'GRANTED',
  Revoked = 'REVOKED'
}

export type Permission_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accountAddress?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  accountAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  accountAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Permission_Filter>>>;
  createdAt?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_gt?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_gte?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_lte?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_not?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<Permission_Filter>>>;
  role?: InputMaybe<Scalars['Bytes']['input']>;
  role_contains?: InputMaybe<Scalars['Bytes']['input']>;
  role_gt?: InputMaybe<Scalars['Bytes']['input']>;
  role_gte?: InputMaybe<Scalars['Bytes']['input']>;
  role_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  role_lt?: InputMaybe<Scalars['Bytes']['input']>;
  role_lte?: InputMaybe<Scalars['Bytes']['input']>;
  role_not?: InputMaybe<Scalars['Bytes']['input']>;
  role_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  role_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  status?: InputMaybe<PermissionStatus>;
  status_in?: InputMaybe<Array<PermissionStatus>>;
  status_not?: InputMaybe<PermissionStatus>;
  status_not_in?: InputMaybe<Array<PermissionStatus>>;
  updatedAt?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_not?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Permission_OrderBy {
  AccountAddress = 'accountAddress',
  CreatedAt = 'createdAt',
  Id = 'id',
  Role = 'role',
  Status = 'status',
  UpdatedAt = 'updatedAt'
}

export type Proposal = {
  __typename?: 'Proposal';
  /** Total of abstain votes on the proposal */
  abstainVotes: Scalars['BigInt']['output'];
  /** Total of against votes on the proposal */
  againstVotes: Scalars['BigInt']['output'];
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Canceled Transaction */
  canceled?: Maybe<Transaction>;
  /** Created Transaction */
  created?: Maybe<Transaction>;
  /** String description of the change */
  description: Scalars['String']['output'];
  /** Block number from where the voting ends */
  endBlock: Scalars['BigInt']['output'];
  /** Executed Transaction */
  executed?: Maybe<Transaction>;
  /** Once the proposal is queued for execution it will have an ETA of the execution */
  executionEta?: Maybe<Scalars['BigInt']['output']>;
  /** Total of for votes on the proposal */
  forVotes: Scalars['BigInt']['output'];
  /** Internal proposal id, it is an auto-incrementing id */
  id: Scalars['ID']['output'];
  /** Difference between for and against */
  passing: Scalars['Boolean']['output'];
  /** Proposal Id */
  proposalId: Scalars['BigInt']['output'];
  /** Delegate that proposed the change */
  proposer: Delegate;
  /** Queued Transaction */
  queued?: Maybe<Transaction>;
  /** Remote Proposals created from this proposal */
  remoteProposals: Array<RemoteProposal>;
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Block number from where the voting starts */
  startBlock: Scalars['BigInt']['output'];
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Type of Proposal can be normal fast track or critical */
  type: Proposal_Type;
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** Votes associated to this proposal */
  votes: Array<Vote>;
};


export type ProposalRemoteProposalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RemoteProposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RemoteProposal_Filter>;
};


export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vote_Filter>;
};

export type Proposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  abstainVotes?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  abstainVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstVotes?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  calldatas?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  canceled?: InputMaybe<Scalars['String']['input']>;
  canceled_?: InputMaybe<Transaction_Filter>;
  canceled_contains?: InputMaybe<Scalars['String']['input']>;
  canceled_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  canceled_ends_with?: InputMaybe<Scalars['String']['input']>;
  canceled_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  canceled_gt?: InputMaybe<Scalars['String']['input']>;
  canceled_gte?: InputMaybe<Scalars['String']['input']>;
  canceled_in?: InputMaybe<Array<Scalars['String']['input']>>;
  canceled_lt?: InputMaybe<Scalars['String']['input']>;
  canceled_lte?: InputMaybe<Scalars['String']['input']>;
  canceled_not?: InputMaybe<Scalars['String']['input']>;
  canceled_not_contains?: InputMaybe<Scalars['String']['input']>;
  canceled_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  canceled_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  canceled_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  canceled_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  canceled_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  canceled_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  canceled_starts_with?: InputMaybe<Scalars['String']['input']>;
  canceled_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['String']['input']>;
  created_?: InputMaybe<Transaction_Filter>;
  created_contains?: InputMaybe<Scalars['String']['input']>;
  created_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  created_ends_with?: InputMaybe<Scalars['String']['input']>;
  created_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  created_gt?: InputMaybe<Scalars['String']['input']>;
  created_gte?: InputMaybe<Scalars['String']['input']>;
  created_in?: InputMaybe<Array<Scalars['String']['input']>>;
  created_lt?: InputMaybe<Scalars['String']['input']>;
  created_lte?: InputMaybe<Scalars['String']['input']>;
  created_not?: InputMaybe<Scalars['String']['input']>;
  created_not_contains?: InputMaybe<Scalars['String']['input']>;
  created_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  created_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  created_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  created_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  created_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  created_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  created_starts_with?: InputMaybe<Scalars['String']['input']>;
  created_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  endBlock?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executed?: InputMaybe<Scalars['String']['input']>;
  executed_?: InputMaybe<Transaction_Filter>;
  executed_contains?: InputMaybe<Scalars['String']['input']>;
  executed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_ends_with?: InputMaybe<Scalars['String']['input']>;
  executed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_gt?: InputMaybe<Scalars['String']['input']>;
  executed_gte?: InputMaybe<Scalars['String']['input']>;
  executed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executed_lt?: InputMaybe<Scalars['String']['input']>;
  executed_lte?: InputMaybe<Scalars['String']['input']>;
  executed_not?: InputMaybe<Scalars['String']['input']>;
  executed_not_contains?: InputMaybe<Scalars['String']['input']>;
  executed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  executed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  executed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_starts_with?: InputMaybe<Scalars['String']['input']>;
  executed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionEta?: InputMaybe<Scalars['BigInt']['input']>;
  executionEta_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionEta_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionEta_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionEta_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionEta_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionEta_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionEta_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forVotes?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  passing?: InputMaybe<Scalars['Boolean']['input']>;
  passing_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  passing_not?: InputMaybe<Scalars['Boolean']['input']>;
  passing_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  proposalId?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposer?: InputMaybe<Scalars['String']['input']>;
  proposer_?: InputMaybe<Delegate_Filter>;
  proposer_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_gt?: InputMaybe<Scalars['String']['input']>;
  proposer_gte?: InputMaybe<Scalars['String']['input']>;
  proposer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_lt?: InputMaybe<Scalars['String']['input']>;
  proposer_lte?: InputMaybe<Scalars['String']['input']>;
  proposer_not?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queued?: InputMaybe<Scalars['String']['input']>;
  queued_?: InputMaybe<Transaction_Filter>;
  queued_contains?: InputMaybe<Scalars['String']['input']>;
  queued_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  queued_ends_with?: InputMaybe<Scalars['String']['input']>;
  queued_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queued_gt?: InputMaybe<Scalars['String']['input']>;
  queued_gte?: InputMaybe<Scalars['String']['input']>;
  queued_in?: InputMaybe<Array<Scalars['String']['input']>>;
  queued_lt?: InputMaybe<Scalars['String']['input']>;
  queued_lte?: InputMaybe<Scalars['String']['input']>;
  queued_not?: InputMaybe<Scalars['String']['input']>;
  queued_not_contains?: InputMaybe<Scalars['String']['input']>;
  queued_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  queued_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  queued_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queued_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  queued_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  queued_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queued_starts_with?: InputMaybe<Scalars['String']['input']>;
  queued_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  remoteProposals_?: InputMaybe<RemoteProposal_Filter>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  startBlock?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targets?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  type?: InputMaybe<Proposal_Type>;
  type_in?: InputMaybe<Array<Proposal_Type>>;
  type_not?: InputMaybe<Proposal_Type>;
  type_not_in?: InputMaybe<Array<Proposal_Type>>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Proposal_OrderBy {
  AbstainVotes = 'abstainVotes',
  AgainstVotes = 'againstVotes',
  Calldatas = 'calldatas',
  Canceled = 'canceled',
  CanceledBlockNumber = 'canceled__blockNumber',
  CanceledId = 'canceled__id',
  CanceledTimestamp = 'canceled__timestamp',
  CanceledTxHash = 'canceled__txHash',
  Created = 'created',
  CreatedBlockNumber = 'created__blockNumber',
  CreatedId = 'created__id',
  CreatedTimestamp = 'created__timestamp',
  CreatedTxHash = 'created__txHash',
  Description = 'description',
  EndBlock = 'endBlock',
  Executed = 'executed',
  ExecutedBlockNumber = 'executed__blockNumber',
  ExecutedId = 'executed__id',
  ExecutedTimestamp = 'executed__timestamp',
  ExecutedTxHash = 'executed__txHash',
  ExecutionEta = 'executionEta',
  ForVotes = 'forVotes',
  Id = 'id',
  Passing = 'passing',
  ProposalId = 'proposalId',
  Proposer = 'proposer',
  ProposerDelegateCount = 'proposer__delegateCount',
  ProposerId = 'proposer__id',
  ProposerStakedXvsMantissa = 'proposer__stakedXvsMantissa',
  ProposerTotalVotesMantissa = 'proposer__totalVotesMantissa',
  Queued = 'queued',
  QueuedBlockNumber = 'queued__blockNumber',
  QueuedId = 'queued__id',
  QueuedTimestamp = 'queued__timestamp',
  QueuedTxHash = 'queued__txHash',
  RemoteProposals = 'remoteProposals',
  Signatures = 'signatures',
  StartBlock = 'startBlock',
  Targets = 'targets',
  Type = 'type',
  Values = 'values',
  Votes = 'votes'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegate?: Maybe<Delegate>;
  delegates: Array<Delegate>;
  governance?: Maybe<Governance>;
  governances: Array<Governance>;
  maxDailyLimit?: Maybe<MaxDailyLimit>;
  maxDailyLimits: Array<MaxDailyLimit>;
  omnichainProposalSender?: Maybe<OmnichainProposalSender>;
  omnichainProposalSenders: Array<OmnichainProposalSender>;
  permission?: Maybe<Permission>;
  permissions: Array<Permission>;
  proposal?: Maybe<Proposal>;
  proposalSearch: Array<Proposal>;
  proposals: Array<Proposal>;
  remoteProposal?: Maybe<RemoteProposal>;
  remoteProposalStateTransaction?: Maybe<RemoteProposalStateTransaction>;
  remoteProposalStateTransactions: Array<RemoteProposalStateTransaction>;
  remoteProposals: Array<RemoteProposal>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  trustedRemote?: Maybe<TrustedRemote>;
  trustedRemotes: Array<TrustedRemote>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDelegateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegate_Filter>;
};


export type QueryGovernanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Governance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Governance_Filter>;
};


export type QueryMaxDailyLimitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMaxDailyLimitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MaxDailyLimit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MaxDailyLimit_Filter>;
};


export type QueryOmnichainProposalSenderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOmnichainProposalSendersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OmnichainProposalSender_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OmnichainProposalSender_Filter>;
};


export type QueryPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Permission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Permission_Filter>;
};


export type QueryProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProposalSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
  where?: InputMaybe<Proposal_Filter>;
};


export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};


export type QueryRemoteProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRemoteProposalStateTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRemoteProposalStateTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RemoteProposalStateTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RemoteProposalStateTransaction_Filter>;
};


export type QueryRemoteProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RemoteProposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RemoteProposal_Filter>;
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


export type QueryTrustedRemoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTrustedRemotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TrustedRemote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TrustedRemote_Filter>;
};


export type QueryVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type RemoteProposal = {
  __typename?: 'RemoteProposal';
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Concatenated sourceProposalId and layerZeroChainId */
  id: Scalars['Bytes']['output'];
  /** RemoteProposal Id */
  proposalId?: Maybe<Scalars['BigInt']['output']>;
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Proposal Id for the originating BNB Chain proposal */
  sourceProposal: Proposal;
  /** RemoteProposalKey */
  stateTransactions?: Maybe<RemoteProposalStateTransaction>;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Remote ChainId where the proposal was sent */
  trustedRemote: TrustedRemote;
  /** Proposal (route) Type (Normal, FastTrack, Critical) */
  type: Scalars['Int']['output'];
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
};

export type RemoteProposalStateTransaction = {
  __typename?: 'RemoteProposalStateTransaction';
  /** Transaction Remote Proposal was executed */
  executed?: Maybe<Transaction>;
  /** If execution fails and is stored, this property will show the reason */
  failedReason?: Maybe<Scalars['Bytes']['output']>;
  /** Remote Proposal Id */
  id: Scalars['ID']['output'];
  /** Concatenated sourceProposalId and layerZeroChainId */
  key: RemoteProposal;
  /** Transaction Remote Proposal failed */
  stored?: Maybe<Transaction>;
  /** Transaction Remote Proposal was withdrawn */
  withdrawn?: Maybe<Transaction>;
};

export type RemoteProposalStateTransaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RemoteProposalStateTransaction_Filter>>>;
  executed?: InputMaybe<Scalars['String']['input']>;
  executed_?: InputMaybe<Transaction_Filter>;
  executed_contains?: InputMaybe<Scalars['String']['input']>;
  executed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_ends_with?: InputMaybe<Scalars['String']['input']>;
  executed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_gt?: InputMaybe<Scalars['String']['input']>;
  executed_gte?: InputMaybe<Scalars['String']['input']>;
  executed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executed_lt?: InputMaybe<Scalars['String']['input']>;
  executed_lte?: InputMaybe<Scalars['String']['input']>;
  executed_not?: InputMaybe<Scalars['String']['input']>;
  executed_not_contains?: InputMaybe<Scalars['String']['input']>;
  executed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  executed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  executed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executed_starts_with?: InputMaybe<Scalars['String']['input']>;
  executed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  failedReason?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_contains?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_gt?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_gte?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  failedReason_lt?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_lte?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_not?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  failedReason_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  key?: InputMaybe<Scalars['String']['input']>;
  key_?: InputMaybe<RemoteProposal_Filter>;
  key_contains?: InputMaybe<Scalars['String']['input']>;
  key_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  key_ends_with?: InputMaybe<Scalars['String']['input']>;
  key_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_gt?: InputMaybe<Scalars['String']['input']>;
  key_gte?: InputMaybe<Scalars['String']['input']>;
  key_in?: InputMaybe<Array<Scalars['String']['input']>>;
  key_lt?: InputMaybe<Scalars['String']['input']>;
  key_lte?: InputMaybe<Scalars['String']['input']>;
  key_not?: InputMaybe<Scalars['String']['input']>;
  key_not_contains?: InputMaybe<Scalars['String']['input']>;
  key_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  key_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  key_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  key_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  key_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_starts_with?: InputMaybe<Scalars['String']['input']>;
  key_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<RemoteProposalStateTransaction_Filter>>>;
  stored?: InputMaybe<Scalars['String']['input']>;
  stored_?: InputMaybe<Transaction_Filter>;
  stored_contains?: InputMaybe<Scalars['String']['input']>;
  stored_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stored_ends_with?: InputMaybe<Scalars['String']['input']>;
  stored_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stored_gt?: InputMaybe<Scalars['String']['input']>;
  stored_gte?: InputMaybe<Scalars['String']['input']>;
  stored_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stored_lt?: InputMaybe<Scalars['String']['input']>;
  stored_lte?: InputMaybe<Scalars['String']['input']>;
  stored_not?: InputMaybe<Scalars['String']['input']>;
  stored_not_contains?: InputMaybe<Scalars['String']['input']>;
  stored_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stored_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stored_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stored_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stored_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stored_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stored_starts_with?: InputMaybe<Scalars['String']['input']>;
  stored_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawn?: InputMaybe<Scalars['String']['input']>;
  withdrawn_?: InputMaybe<Transaction_Filter>;
  withdrawn_contains?: InputMaybe<Scalars['String']['input']>;
  withdrawn_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawn_ends_with?: InputMaybe<Scalars['String']['input']>;
  withdrawn_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawn_gt?: InputMaybe<Scalars['String']['input']>;
  withdrawn_gte?: InputMaybe<Scalars['String']['input']>;
  withdrawn_in?: InputMaybe<Array<Scalars['String']['input']>>;
  withdrawn_lt?: InputMaybe<Scalars['String']['input']>;
  withdrawn_lte?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not_contains?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  withdrawn_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  withdrawn_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawn_starts_with?: InputMaybe<Scalars['String']['input']>;
  withdrawn_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RemoteProposalStateTransaction_OrderBy {
  Executed = 'executed',
  ExecutedBlockNumber = 'executed__blockNumber',
  ExecutedId = 'executed__id',
  ExecutedTimestamp = 'executed__timestamp',
  ExecutedTxHash = 'executed__txHash',
  FailedReason = 'failedReason',
  Id = 'id',
  Key = 'key',
  KeyId = 'key__id',
  KeyProposalId = 'key__proposalId',
  KeyType = 'key__type',
  Stored = 'stored',
  StoredBlockNumber = 'stored__blockNumber',
  StoredId = 'stored__id',
  StoredTimestamp = 'stored__timestamp',
  StoredTxHash = 'stored__txHash',
  Withdrawn = 'withdrawn',
  WithdrawnBlockNumber = 'withdrawn__blockNumber',
  WithdrawnId = 'withdrawn__id',
  WithdrawnTimestamp = 'withdrawn__timestamp',
  WithdrawnTxHash = 'withdrawn__txHash'
}

export type RemoteProposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RemoteProposal_Filter>>>;
  calldatas?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<RemoteProposal_Filter>>>;
  proposalId?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  sourceProposal?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_?: InputMaybe<Proposal_Filter>;
  sourceProposal_contains?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_gt?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_gte?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sourceProposal_lt?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_lte?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sourceProposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  sourceProposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stateTransactions_?: InputMaybe<RemoteProposalStateTransaction_Filter>;
  targets?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  trustedRemote?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_?: InputMaybe<TrustedRemote_Filter>;
  trustedRemote_contains?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_ends_with?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_gt?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_gte?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trustedRemote_lt?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_lte?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not_contains?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trustedRemote_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_starts_with?: InputMaybe<Scalars['String']['input']>;
  trustedRemote_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_gt?: InputMaybe<Scalars['Int']['input']>;
  type_gte?: InputMaybe<Scalars['Int']['input']>;
  type_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  type_lt?: InputMaybe<Scalars['Int']['input']>;
  type_lte?: InputMaybe<Scalars['Int']['input']>;
  type_not?: InputMaybe<Scalars['Int']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum RemoteProposal_OrderBy {
  Calldatas = 'calldatas',
  Id = 'id',
  ProposalId = 'proposalId',
  Signatures = 'signatures',
  SourceProposal = 'sourceProposal',
  SourceProposalAbstainVotes = 'sourceProposal__abstainVotes',
  SourceProposalAgainstVotes = 'sourceProposal__againstVotes',
  SourceProposalDescription = 'sourceProposal__description',
  SourceProposalEndBlock = 'sourceProposal__endBlock',
  SourceProposalExecutionEta = 'sourceProposal__executionEta',
  SourceProposalForVotes = 'sourceProposal__forVotes',
  SourceProposalId = 'sourceProposal__id',
  SourceProposalPassing = 'sourceProposal__passing',
  SourceProposalProposalId = 'sourceProposal__proposalId',
  SourceProposalStartBlock = 'sourceProposal__startBlock',
  SourceProposalType = 'sourceProposal__type',
  StateTransactions = 'stateTransactions',
  StateTransactionsFailedReason = 'stateTransactions__failedReason',
  StateTransactionsId = 'stateTransactions__id',
  Targets = 'targets',
  TrustedRemote = 'trustedRemote',
  TrustedRemoteActive = 'trustedRemote__active',
  TrustedRemoteAddress = 'trustedRemote__address',
  TrustedRemoteId = 'trustedRemote__id',
  TrustedRemoteLayerZeroChainId = 'trustedRemote__layerZeroChainId',
  Type = 'type',
  Values = 'values'
}

export enum Support {
  Abstain = 'ABSTAIN',
  Against = 'AGAINST',
  For = 'FOR'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegate?: Maybe<Delegate>;
  delegates: Array<Delegate>;
  governance?: Maybe<Governance>;
  governances: Array<Governance>;
  maxDailyLimit?: Maybe<MaxDailyLimit>;
  maxDailyLimits: Array<MaxDailyLimit>;
  omnichainProposalSender?: Maybe<OmnichainProposalSender>;
  omnichainProposalSenders: Array<OmnichainProposalSender>;
  permission?: Maybe<Permission>;
  permissions: Array<Permission>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  remoteProposal?: Maybe<RemoteProposal>;
  remoteProposalStateTransaction?: Maybe<RemoteProposalStateTransaction>;
  remoteProposalStateTransactions: Array<RemoteProposalStateTransaction>;
  remoteProposals: Array<RemoteProposal>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  trustedRemote?: Maybe<TrustedRemote>;
  trustedRemotes: Array<TrustedRemote>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDelegateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegate_Filter>;
};


export type SubscriptionGovernanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGovernancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Governance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Governance_Filter>;
};


export type SubscriptionMaxDailyLimitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMaxDailyLimitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MaxDailyLimit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MaxDailyLimit_Filter>;
};


export type SubscriptionOmnichainProposalSenderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOmnichainProposalSendersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OmnichainProposalSender_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OmnichainProposalSender_Filter>;
};


export type SubscriptionPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Permission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Permission_Filter>;
};


export type SubscriptionProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};


export type SubscriptionRemoteProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRemoteProposalStateTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRemoteProposalStateTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RemoteProposalStateTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RemoteProposalStateTransaction_Filter>;
};


export type SubscriptionRemoteProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RemoteProposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RemoteProposal_Filter>;
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


export type SubscriptionTrustedRemoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTrustedRemotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TrustedRemote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TrustedRemote_Filter>;
};


export type SubscriptionVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type Transaction = {
  __typename?: 'Transaction';
  /** Block number of the transaction */
  blockNumber: Scalars['BigInt']['output'];
  /** Transaction hash used as the id */
  id: Scalars['Bytes']['output'];
  /** Timestamp of the transaction block */
  timestamp: Scalars['BigInt']['output'];
  /** Transaction hash for the proposal action */
  txHash: Scalars['Bytes']['output'];
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txHash?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  txHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type TrustedRemote = {
  __typename?: 'TrustedRemote';
  /** True if active, false if inactive */
  active: Scalars['Boolean']['output'];
  /** Governance contract address on the trusted remote */
  address?: Maybe<Scalars['Bytes']['output']>;
  /** LayerZero Chain id of the trusted remote */
  id: Scalars['Bytes']['output'];
  layerZeroChainId: Scalars['Int']['output'];
  /** Array of proposals sent to the remote */
  proposals?: Maybe<Array<RemoteProposal>>;
};


export type TrustedRemoteProposalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RemoteProposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RemoteProposal_Filter>;
};

export type TrustedRemote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  active_not?: InputMaybe<Scalars['Boolean']['input']>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
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
  and?: InputMaybe<Array<InputMaybe<TrustedRemote_Filter>>>;
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
  layerZeroChainId?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_gt?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_gte?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  layerZeroChainId_lt?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_lte?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_not?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TrustedRemote_Filter>>>;
  proposals_?: InputMaybe<RemoteProposal_Filter>;
};

export enum TrustedRemote_OrderBy {
  Active = 'active',
  Address = 'address',
  Id = 'id',
  LayerZeroChainId = 'layerZeroChainId',
  Proposals = 'proposals'
}

export type Vote = {
  __typename?: 'Vote';
  /** Delegate id + Proposal id */
  id: Scalars['Bytes']['output'];
  /** Proposal that is being voted on */
  proposal: Proposal;
  /** V2 vote with reason */
  reason?: Maybe<Scalars['String']['output']>;
  /** Whether the vote is in favour or against the proposal */
  support: Support;
  /** Delegate that emitted the vote */
  voter: Delegate;
  /** Amount of votes in favour or against expressed in the smallest unit of the XVS Token */
  votes: Scalars['BigInt']['output'];
};

export type Vote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  support?: InputMaybe<Support>;
  support_in?: InputMaybe<Array<Support>>;
  support_not?: InputMaybe<Support>;
  support_not_in?: InputMaybe<Array<Support>>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_?: InputMaybe<Delegate_Filter>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votes?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Vote_OrderBy {
  Id = 'id',
  Proposal = 'proposal',
  ProposalAbstainVotes = 'proposal__abstainVotes',
  ProposalAgainstVotes = 'proposal__againstVotes',
  ProposalDescription = 'proposal__description',
  ProposalEndBlock = 'proposal__endBlock',
  ProposalExecutionEta = 'proposal__executionEta',
  ProposalForVotes = 'proposal__forVotes',
  ProposalId = 'proposal__id',
  ProposalPassing = 'proposal__passing',
  ProposalProposalId = 'proposal__proposalId',
  ProposalStartBlock = 'proposal__startBlock',
  ProposalType = 'proposal__type',
  Reason = 'reason',
  Support = 'support',
  Voter = 'voter',
  VoterDelegateCount = 'voter__delegateCount',
  VoterId = 'voter__id',
  VoterStakedXvsMantissa = 'voter__stakedXvsMantissa',
  VoterTotalVotesMantissa = 'voter__totalVotesMantissa',
  Votes = 'votes'
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

export const BscProposalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BscProposal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"startBlock"}},{"kind":"Field","name":{"kind":"Name","value":"endBlock"}},{"kind":"Field","name":{"kind":"Name","value":"forVotes"}},{"kind":"Field","name":{"kind":"Name","value":"againstVotes"}},{"kind":"Field","name":{"kind":"Name","value":"abstainVotes"}},{"kind":"Field","name":{"kind":"Name","value":"executionEta"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"passing"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"signatures"}},{"kind":"Field","name":{"kind":"Name","value":"calldatas"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canceled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queued"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"votes"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"voter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotesMantissa"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"remoteProposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"signatures"}},{"kind":"Field","name":{"kind":"Name","value":"calldatas"}},{"kind":"Field","name":{"kind":"Name","value":"trustedRemote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"layerZeroChainId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stateTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stored"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BscProposalFragment, unknown>;
export const ProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Proposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BscProposal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BscProposal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"startBlock"}},{"kind":"Field","name":{"kind":"Name","value":"endBlock"}},{"kind":"Field","name":{"kind":"Name","value":"forVotes"}},{"kind":"Field","name":{"kind":"Name","value":"againstVotes"}},{"kind":"Field","name":{"kind":"Name","value":"abstainVotes"}},{"kind":"Field","name":{"kind":"Name","value":"executionEta"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"passing"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"signatures"}},{"kind":"Field","name":{"kind":"Name","value":"calldatas"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canceled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queued"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"votes"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"voter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotesMantissa"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"remoteProposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"signatures"}},{"kind":"Field","name":{"kind":"Name","value":"calldatas"}},{"kind":"Field","name":{"kind":"Name","value":"trustedRemote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"layerZeroChainId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stateTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stored"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProposalQuery, ProposalQueryVariables>;
export const ProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Proposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal_filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"startBlock"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BscProposal"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"total"},"name":{"kind":"Name","value":"proposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BscProposal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"startBlock"}},{"kind":"Field","name":{"kind":"Name","value":"endBlock"}},{"kind":"Field","name":{"kind":"Name","value":"forVotes"}},{"kind":"Field","name":{"kind":"Name","value":"againstVotes"}},{"kind":"Field","name":{"kind":"Name","value":"abstainVotes"}},{"kind":"Field","name":{"kind":"Name","value":"executionEta"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"passing"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"signatures"}},{"kind":"Field","name":{"kind":"Name","value":"calldatas"}},{"kind":"Field","name":{"kind":"Name","value":"proposer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canceled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queued"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"support"}},{"kind":"Field","name":{"kind":"Name","value":"votes"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"voter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalVotesMantissa"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"remoteProposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"signatures"}},{"kind":"Field","name":{"kind":"Name","value":"calldatas"}},{"kind":"Field","name":{"kind":"Name","value":"trustedRemote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"layerZeroChainId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stateTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stored"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProposalsQuery, ProposalsQueryVariables>;
export type BscProposalFragment = { __typename?: 'Proposal', id: string, proposalId: any, startBlock: any, endBlock: any, forVotes: any, againstVotes: any, abstainVotes: any, executionEta?: any | null, type: Proposal_Type, description: string, passing: boolean, targets?: Array<any> | null, values?: Array<any> | null, signatures?: Array<string> | null, calldatas?: Array<any> | null, proposer: { __typename?: 'Delegate', id: any }, created?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, canceled?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, queued?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, votes: Array<{ __typename?: 'Vote', id: any, support: Support, votes: any, reason?: string | null, voter: { __typename?: 'Delegate', id: any, totalVotesMantissa: any } }>, remoteProposals: Array<{ __typename?: 'RemoteProposal', id: any, proposalId?: any | null, targets?: Array<any> | null, values?: Array<any> | null, signatures?: Array<string> | null, calldatas?: Array<any> | null, trustedRemote: { __typename?: 'TrustedRemote', id: any, layerZeroChainId: number }, stateTransactions?: { __typename?: 'RemoteProposalStateTransaction', id: string, stored?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, withdrawn?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null } | null }> };

export type ProposalQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ProposalQuery = { __typename?: 'Query', proposal?: { __typename?: 'Proposal', id: string, proposalId: any, startBlock: any, endBlock: any, forVotes: any, againstVotes: any, abstainVotes: any, executionEta?: any | null, type: Proposal_Type, description: string, passing: boolean, targets?: Array<any> | null, values?: Array<any> | null, signatures?: Array<string> | null, calldatas?: Array<any> | null, proposer: { __typename?: 'Delegate', id: any }, created?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, canceled?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, queued?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, votes: Array<{ __typename?: 'Vote', id: any, support: Support, votes: any, reason?: string | null, voter: { __typename?: 'Delegate', id: any, totalVotesMantissa: any } }>, remoteProposals: Array<{ __typename?: 'RemoteProposal', id: any, proposalId?: any | null, targets?: Array<any> | null, values?: Array<any> | null, signatures?: Array<string> | null, calldatas?: Array<any> | null, trustedRemote: { __typename?: 'TrustedRemote', id: any, layerZeroChainId: number }, stateTransactions?: { __typename?: 'RemoteProposalStateTransaction', id: string, stored?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, withdrawn?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null } | null }> } | null };

export type ProposalsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Proposal_Filter>;
}>;


export type ProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', id: string, proposalId: any, startBlock: any, endBlock: any, forVotes: any, againstVotes: any, abstainVotes: any, executionEta?: any | null, type: Proposal_Type, description: string, passing: boolean, targets?: Array<any> | null, values?: Array<any> | null, signatures?: Array<string> | null, calldatas?: Array<any> | null, proposer: { __typename?: 'Delegate', id: any }, created?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, canceled?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, queued?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, votes: Array<{ __typename?: 'Vote', id: any, support: Support, votes: any, reason?: string | null, voter: { __typename?: 'Delegate', id: any, totalVotesMantissa: any } }>, remoteProposals: Array<{ __typename?: 'RemoteProposal', id: any, proposalId?: any | null, targets?: Array<any> | null, values?: Array<any> | null, signatures?: Array<string> | null, calldatas?: Array<any> | null, trustedRemote: { __typename?: 'TrustedRemote', id: any, layerZeroChainId: number }, stateTransactions?: { __typename?: 'RemoteProposalStateTransaction', id: string, stored?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, withdrawn?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null } | null }> }>, total: Array<{ __typename?: 'Proposal', id: string }> };
