import type { Token } from 'types';

// PancakeSwap only trades with wrapped tokens, so BNB is replaced with wBNB
const wrapToken = ({ token, wbnb }: { token: Token; wbnb: Token }) =>
  token.isNative ? wbnb : token;

export default wrapToken;
