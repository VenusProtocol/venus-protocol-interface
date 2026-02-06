import type { Token } from 'types';

// PancakeSwap only trades with wrapped tokens, so BNB is replaced with wBNB
const wrapToken = ({ token, wrappedToken }: { token: Token; wrappedToken: Token }) =>
  token.isNative ? wrappedToken : token;

export default wrapToken;
