import { bnb, busd, wbnb } from '__mocks__/models/tokens';

import wrapToken from '../wrapToken';

describe('pages/Swap/useGetSwapInfo/wrapToken', () => {
  it('returns token provided if its isNative field is false', () => {
    const wrappedToken = wrapToken({ token: busd, wbnb });

    expect(wrappedToken).toEqual(busd);
  });

  it('returns wBNB if provided token is BNB', () => {
    const wrappedToken = wrapToken({ token: bnb, wbnb });

    expect(wrappedToken).toEqual(wbnb);
  });
});
