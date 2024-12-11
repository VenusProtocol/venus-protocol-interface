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

export type DestinationChain = {
  __typename?: 'DestinationChain';
  /** Chain Id */
  chainId: Scalars['Int']['output'];
  /** Destination Chain Id as Bytes */
  id: Scalars['Bytes']['output'];
  /** Minimum gas required to send for execution on destination */
  minGas: Scalars['BigInt']['output'];
  /** Packet Type */
  packetType: Scalars['Int']['output'];
};

export type DestinationChain_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DestinationChain_Filter>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  minGas?: InputMaybe<Scalars['BigInt']['input']>;
  minGas_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minGas_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minGas_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minGas_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minGas_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minGas_not?: InputMaybe<Scalars['BigInt']['input']>;
  minGas_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DestinationChain_Filter>>>;
  packetType?: InputMaybe<Scalars['Int']['input']>;
  packetType_gt?: InputMaybe<Scalars['Int']['input']>;
  packetType_gte?: InputMaybe<Scalars['Int']['input']>;
  packetType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  packetType_lt?: InputMaybe<Scalars['Int']['input']>;
  packetType_lte?: InputMaybe<Scalars['Int']['input']>;
  packetType_not?: InputMaybe<Scalars['Int']['input']>;
  packetType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum DestinationChain_OrderBy {
  ChainId = 'chainId',
  Id = 'id',
  MinGas = 'minGas',
  PacketType = 'packetType'
}

export type FailedPayload = {
  __typename?: 'FailedPayload';
  /** Nonce of received payload */
  id: Scalars['ID']['output'];
  /** Message nonce */
  nonce: Scalars['BigInt']['output'];
  /** Failure reason */
  reason: Scalars['String']['output'];
  /** Address of the contract that sent the message */
  srcAddress: Scalars['Bytes']['output'];
  /** Chain id where the message came from */
  srcChainId: Scalars['Int']['output'];
};

export type FailedPayload_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FailedPayload_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FailedPayload_Filter>>>;
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
  srcAddress?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  srcAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  srcAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  srcChainId?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_gt?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_gte?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  srcChainId_lt?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_lte?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_not?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum FailedPayload_OrderBy {
  Id = 'id',
  Nonce = 'nonce',
  Reason = 'reason',
  SrcAddress = 'srcAddress',
  SrcChainId = 'srcChainId'
}

export type FunctionRegistry = {
  __typename?: 'FunctionRegistry';
  /** Function signature as bytes used as id */
  id: Scalars['Bytes']['output'];
  /** Function signature that the governor is allowed to call */
  signature: Scalars['String']['output'];
};

export type FunctionRegistry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FunctionRegistry_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<FunctionRegistry_Filter>>>;
  signature?: InputMaybe<Scalars['String']['input']>;
  signature_contains?: InputMaybe<Scalars['String']['input']>;
  signature_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  signature_ends_with?: InputMaybe<Scalars['String']['input']>;
  signature_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signature_gt?: InputMaybe<Scalars['String']['input']>;
  signature_gte?: InputMaybe<Scalars['String']['input']>;
  signature_in?: InputMaybe<Array<Scalars['String']['input']>>;
  signature_lt?: InputMaybe<Scalars['String']['input']>;
  signature_lte?: InputMaybe<Scalars['String']['input']>;
  signature_not?: InputMaybe<Scalars['String']['input']>;
  signature_not_contains?: InputMaybe<Scalars['String']['input']>;
  signature_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  signature_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  signature_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signature_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  signature_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  signature_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signature_starts_with?: InputMaybe<Scalars['String']['input']>;
  signature_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum FunctionRegistry_OrderBy {
  Id = 'id',
  Signature = 'signature'
}

export type Governance = {
  __typename?: 'Governance';
  /** Address of the governance owner contract */
  address: Scalars['Bytes']['output'];
  /** Address of the governance executor contract */
  executor: Scalars['Bytes']['output'];
  /** Address of the governance guardian */
  guardian: Scalars['Bytes']['output'];
  /** Unique entity used to keep track of common aggregated data */
  id: Scalars['ID']['output'];
  /** LayZero chainId for the chain this governance executor is deployed on */
  layerZeroChainId: Scalars['Int']['output'];
  /** Max number of commands that can be sent to this governor in a day */
  maxDailyReceiveLimit: Scalars['BigInt']['output'];
  /** Flag for if the governance is paused or active */
  paused: Scalars['Boolean']['output'];
  /** Address of the precrime contract */
  precrime?: Maybe<Scalars['Bytes']['output']>;
  /** Source chainId which can send messages */
  srcChainId: Scalars['Int']['output'];
};

export type GovernanceRoute = {
  __typename?: 'GovernanceRoute';
  /** Governance Route index / type */
  id: Scalars['ID']['output'];
  /** Address for the route */
  timelockAddress: Scalars['Bytes']['output'];
  /** Route type enum */
  type: Proposal_Type;
};

export type GovernanceRoute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GovernanceRoute_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GovernanceRoute_Filter>>>;
  timelockAddress?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timelockAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  timelockAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  type?: InputMaybe<Proposal_Type>;
  type_in?: InputMaybe<Array<Proposal_Type>>;
  type_not?: InputMaybe<Proposal_Type>;
  type_not_in?: InputMaybe<Array<Proposal_Type>>;
};

export enum GovernanceRoute_OrderBy {
  Id = 'id',
  TimelockAddress = 'timelockAddress',
  Type = 'type'
}

export type Governance_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  executor?: InputMaybe<Scalars['Bytes']['input']>;
  executor_contains?: InputMaybe<Scalars['Bytes']['input']>;
  executor_gt?: InputMaybe<Scalars['Bytes']['input']>;
  executor_gte?: InputMaybe<Scalars['Bytes']['input']>;
  executor_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  executor_lt?: InputMaybe<Scalars['Bytes']['input']>;
  executor_lte?: InputMaybe<Scalars['Bytes']['input']>;
  executor_not?: InputMaybe<Scalars['Bytes']['input']>;
  executor_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  executor_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  layerZeroChainId?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_gt?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_gte?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  layerZeroChainId_lt?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_lte?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_not?: InputMaybe<Scalars['Int']['input']>;
  layerZeroChainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxDailyReceiveLimit?: InputMaybe<Scalars['BigInt']['input']>;
  maxDailyReceiveLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDailyReceiveLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDailyReceiveLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDailyReceiveLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDailyReceiveLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDailyReceiveLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxDailyReceiveLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  paused?: InputMaybe<Scalars['Boolean']['input']>;
  paused_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  paused_not?: InputMaybe<Scalars['Boolean']['input']>;
  paused_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  precrime?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_contains?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_gt?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_gte?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  precrime_lt?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_lte?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_not?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  precrime_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  srcChainId?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_gt?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_gte?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  srcChainId_lt?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_lte?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_not?: InputMaybe<Scalars['Int']['input']>;
  srcChainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum Governance_OrderBy {
  Address = 'address',
  Executor = 'executor',
  Guardian = 'guardian',
  Id = 'id',
  LayerZeroChainId = 'layerZeroChainId',
  MaxDailyReceiveLimit = 'maxDailyReceiveLimit',
  Paused = 'paused',
  Precrime = 'precrime',
  SrcChainId = 'srcChainId'
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
  /** The target contract for the permission event */
  contractAddress: Scalars['Bytes']['output'];
  /** Created At Transaction Hash */
  createdAt: Scalars['Bytes']['output'];
  /** The function name for the permission event */
  functionSignature: Scalars['String']['output'];
  /** Id generated for each Permission */
  id: Scalars['Bytes']['output'];
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
  contractAddress?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  contractAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  functionSignature?: InputMaybe<Scalars['String']['input']>;
  functionSignature_contains?: InputMaybe<Scalars['String']['input']>;
  functionSignature_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  functionSignature_ends_with?: InputMaybe<Scalars['String']['input']>;
  functionSignature_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  functionSignature_gt?: InputMaybe<Scalars['String']['input']>;
  functionSignature_gte?: InputMaybe<Scalars['String']['input']>;
  functionSignature_in?: InputMaybe<Array<Scalars['String']['input']>>;
  functionSignature_lt?: InputMaybe<Scalars['String']['input']>;
  functionSignature_lte?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not_contains?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  functionSignature_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  functionSignature_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  functionSignature_starts_with?: InputMaybe<Scalars['String']['input']>;
  functionSignature_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  ContractAddress = 'contractAddress',
  CreatedAt = 'createdAt',
  FunctionSignature = 'functionSignature',
  Id = 'id',
  Status = 'status',
  UpdatedAt = 'updatedAt'
}

export type Proposal = {
  __typename?: 'Proposal';
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Canceled Transaction */
  canceled?: Maybe<Transaction>;
  /** Executed Transaction */
  executed?: Maybe<Transaction>;
  /** Once the proposal is queued for execution it will have an ETA of the execution */
  executionEta?: Maybe<Scalars['BigInt']['output']>;
  /** Internal proposal id, it is an auto-incrementing id */
  id: Scalars['ID']['output'];
  /** Proposal Id */
  proposalId: Scalars['BigInt']['output'];
  /** Queued (Created) Transaction */
  queued?: Maybe<Transaction>;
  /** Proposal Governance Route (normal fast track or critical) */
  route: GovernanceRoute;
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
};

export type Proposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  proposalId?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  route?: InputMaybe<Scalars['String']['input']>;
  route_?: InputMaybe<GovernanceRoute_Filter>;
  route_contains?: InputMaybe<Scalars['String']['input']>;
  route_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  route_ends_with?: InputMaybe<Scalars['String']['input']>;
  route_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  route_gt?: InputMaybe<Scalars['String']['input']>;
  route_gte?: InputMaybe<Scalars['String']['input']>;
  route_in?: InputMaybe<Array<Scalars['String']['input']>>;
  route_lt?: InputMaybe<Scalars['String']['input']>;
  route_lte?: InputMaybe<Scalars['String']['input']>;
  route_not?: InputMaybe<Scalars['String']['input']>;
  route_not_contains?: InputMaybe<Scalars['String']['input']>;
  route_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  route_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  route_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  route_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  route_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  route_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  route_starts_with?: InputMaybe<Scalars['String']['input']>;
  route_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  targets?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Proposal_OrderBy {
  Calldatas = 'calldatas',
  Canceled = 'canceled',
  CanceledBlockNumber = 'canceled__blockNumber',
  CanceledId = 'canceled__id',
  CanceledTimestamp = 'canceled__timestamp',
  CanceledTxHash = 'canceled__txHash',
  Executed = 'executed',
  ExecutedBlockNumber = 'executed__blockNumber',
  ExecutedId = 'executed__id',
  ExecutedTimestamp = 'executed__timestamp',
  ExecutedTxHash = 'executed__txHash',
  ExecutionEta = 'executionEta',
  Id = 'id',
  ProposalId = 'proposalId',
  Queued = 'queued',
  QueuedBlockNumber = 'queued__blockNumber',
  QueuedId = 'queued__id',
  QueuedTimestamp = 'queued__timestamp',
  QueuedTxHash = 'queued__txHash',
  Route = 'route',
  RouteId = 'route__id',
  RouteTimelockAddress = 'route__timelockAddress',
  RouteType = 'route__type',
  Signatures = 'signatures',
  Targets = 'targets',
  Values = 'values'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  destinationChain?: Maybe<DestinationChain>;
  destinationChains: Array<DestinationChain>;
  failedPayload?: Maybe<FailedPayload>;
  failedPayloads: Array<FailedPayload>;
  functionRegistries: Array<FunctionRegistry>;
  functionRegistry?: Maybe<FunctionRegistry>;
  governance?: Maybe<Governance>;
  governanceRoute?: Maybe<GovernanceRoute>;
  governanceRoutes: Array<GovernanceRoute>;
  governances: Array<Governance>;
  permission?: Maybe<Permission>;
  permissions: Array<Permission>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDestinationChainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDestinationChainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DestinationChain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DestinationChain_Filter>;
};


export type QueryFailedPayloadArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFailedPayloadsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FailedPayload_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FailedPayload_Filter>;
};


export type QueryFunctionRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FunctionRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionRegistry_Filter>;
};


export type QueryFunctionRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceRouteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceRoutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceRoute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceRoute_Filter>;
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


export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
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
  destinationChain?: Maybe<DestinationChain>;
  destinationChains: Array<DestinationChain>;
  failedPayload?: Maybe<FailedPayload>;
  failedPayloads: Array<FailedPayload>;
  functionRegistries: Array<FunctionRegistry>;
  functionRegistry?: Maybe<FunctionRegistry>;
  governance?: Maybe<Governance>;
  governanceRoute?: Maybe<GovernanceRoute>;
  governanceRoutes: Array<GovernanceRoute>;
  governances: Array<Governance>;
  permission?: Maybe<Permission>;
  permissions: Array<Permission>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDestinationChainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDestinationChainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DestinationChain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DestinationChain_Filter>;
};


export type SubscriptionFailedPayloadArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFailedPayloadsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FailedPayload_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FailedPayload_Filter>;
};


export type SubscriptionFunctionRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FunctionRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionRegistry_Filter>;
};


export type SubscriptionFunctionRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGovernanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGovernanceRouteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGovernanceRoutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceRoute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceRoute_Filter>;
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

export const NonBscProposalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NonBscProposal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"executionEta"}},{"kind":"Field","name":{"kind":"Name","value":"queued"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canceled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}}]}}]} as unknown as DocumentNode<NonBscProposalFragment, unknown>;
export const ProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Proposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal_filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NonBscProposal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NonBscProposal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proposalId"}},{"kind":"Field","name":{"kind":"Name","value":"executionEta"}},{"kind":"Field","name":{"kind":"Name","value":"queued"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canceled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}}]}}]}}]} as unknown as DocumentNode<ProposalsQuery, ProposalsQueryVariables>;
export type NonBscProposalFragment = { __typename?: 'Proposal', id: string, proposalId: any, executionEta?: any | null, queued?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, canceled?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null };

export type ProposalsQueryVariables = Exact<{
  where?: InputMaybe<Proposal_Filter>;
}>;


export type ProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', id: string, proposalId: any, executionEta?: any | null, queued?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, canceled?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null, executed?: { __typename?: 'Transaction', id: any, timestamp: any, txHash: any } | null }> };
