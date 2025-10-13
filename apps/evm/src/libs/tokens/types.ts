import type { ChainId, TokenAction } from 'types';

export type DisabledTokenActionMapping = {
  [chainId in ChainId]: DisabledTokenAction[];
};

export interface DisabledTokenAction {
  address: string;
  disabledActions: TokenAction[];
}
