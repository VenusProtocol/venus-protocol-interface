import type { Token } from 'types';

export const getTokenKey = (token: Token) => `${token.chainId}:${token.address.toLowerCase()}`;
