import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { addUserBorrowLimitShares } from '..';

describe('addUserBorrowLimitShares', () => {
  it('adds userBorrowLimitSharePercentage property to each asset', () => {
    expect(
      addUserBorrowLimitShares({
        assets: assetData,
        userBorrowLimitCents: new BigNumber(20000),
      }),
    ).toMatchSnapshot();
  });
});
