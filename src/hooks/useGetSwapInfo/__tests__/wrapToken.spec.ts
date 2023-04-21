import { SWAP_TOKENS } from 'constants/tokens';

import wrapToken from '../wrapToken';

describe('pages/Swap/useGetSwapInfo/wrapToken', () => {
  it('returns token provided if its isNative field is false', () => {
    const wrappedToken = wrapToken(SWAP_TOKENS.busd);

    expect(wrappedToken).toEqual(SWAP_TOKENS.busd);
  });

  it('returns wBNB if provided token is BNB', () => {
    const wrappedToken = wrapToken(SWAP_TOKENS.bnb);

    expect(wrappedToken).toEqual(SWAP_TOKENS.wbnb);
  });
});
