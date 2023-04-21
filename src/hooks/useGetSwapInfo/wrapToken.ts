import { Token } from 'types';

import { SWAP_TOKENS } from 'constants/tokens';

// PancakeSwap only trades with wrapped tokens, so BNB is replaced with wBNB
const wrapToken = (token: Token) => (token.isNative ? SWAP_TOKENS.wbnb : token);

export default wrapToken;
