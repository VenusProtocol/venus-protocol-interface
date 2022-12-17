import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';

import calculateCollateralValue from './calculateCollateralValue';

describe('utilities/calculateCollateralValue', () => {
  test('calculate collateral value for a given amount of an asset', () => {
    const collateralValue = calculateCollateralValue({
      amountWei: new BigNumber('100000000000000000'),
      token: assetData[0].vToken.underlyingToken,
      tokenPriceDollars: assetData[0].tokenPriceDollars,
      collateralFactor: assetData[0].collateralFactor,
    });
    expect(collateralValue.toString()).toBe('0.06393367');
  });
});
