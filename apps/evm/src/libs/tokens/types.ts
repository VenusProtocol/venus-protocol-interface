import type { ChainId } from '@venusprotocol/chains';
import type { Token, TokenAction } from 'types';

export type TokenMapping = {
  [chainId in ChainId]: Token[];
};

export type DisabledTokenActionMapping = {
  [chainId in ChainId]: DisabledTokenAction[];
};

export interface DisabledTokenAction {
  address: string;
  disabledActions: TokenAction[];
}
