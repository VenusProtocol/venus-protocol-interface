import { ChainId, Token } from 'types';

export type TokenMapping = {
  [chainId in ChainId]: Token[];
};
