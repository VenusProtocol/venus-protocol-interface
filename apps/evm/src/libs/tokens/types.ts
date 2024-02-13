import { ChainId, Token, TokenAction } from 'types';

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
