import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';

import wrapToken from '../wrapToken';

describe('pages/Swap/useGetSwapInfo/wrapToken', () => {
  it('returns token provided if its isNative field is false', () => {
    const wrappedToken = wrapToken(PANCAKE_SWAP_TOKENS.busd);

    expect(wrappedToken).toEqual(PANCAKE_SWAP_TOKENS.busd);
  });

  it('returns wBNB if provided token is BNB', () => {
    const wrappedToken = wrapToken(PANCAKE_SWAP_TOKENS.bnb);

    expect(wrappedToken).toEqual(PANCAKE_SWAP_TOKENS.wbnb);
  });
});
