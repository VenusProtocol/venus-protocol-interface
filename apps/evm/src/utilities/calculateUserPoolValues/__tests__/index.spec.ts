import { assetData } from '__mocks__/models/asset';
import BigNumber from 'bignumber.js';
import { calculateUserPoolValues } from '..';

describe('calculateUserPoolValues', () => {
  it('returns the right data', () => {
    expect(
      calculateUserPoolValues({
        assets: assetData,
      }),
    ).toMatchSnapshot();
  });

  it('returns the right data including VAI', () => {
    expect(
      calculateUserPoolValues({
        assets: assetData,
        vaiBorrowAprPercentage: new BigNumber(3.89),
        userVaiBorrowBalanceCents: new BigNumber(500),
      }),
    ).toMatchSnapshot();
  });
});
