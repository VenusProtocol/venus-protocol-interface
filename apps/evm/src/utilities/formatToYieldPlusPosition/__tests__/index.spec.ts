import BigNumber from 'bignumber.js';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { convertTokensToMantissa } from 'utilities';

import { formatToYieldPlusPosition } from '..';

const pool = poolData[0];
const [xvsAsset, usdcAsset, usdtAsset, busdAsset] = pool.assets;

const baseInput: Parameters<typeof formatToYieldPlusPosition>[0] = {
  pool,
  chainId: busdAsset.vToken.underlyingToken.chainId,
  positionAccountAddress: fakeAddress,
  dsaVTokenAddress: xvsAsset.vToken.address,
  dsaBalanceMantissa: convertTokensToMantissa({
    value: xvsAsset.userSupplyBalanceTokens,
    token: xvsAsset.vToken.underlyingToken,
  }),
  longVTokenAddress: usdtAsset.vToken.address,
  shortVTokenAddress: busdAsset.vToken.address,
  leverageFactor: 2,
  unrealizedPnlCents: 0,
  unrealizedPnlPercentage: 0,
};

describe('formatToYieldPlusPosition', () => {
  it('returns the position in the expected format', () => {
    const result = formatToYieldPlusPosition(baseInput);

    expect(result).toMatchSnapshot();
  });

  it('returns undefined when one of the required assets cannot be found in the pool', () => {
    const result = formatToYieldPlusPosition({
      ...baseInput,
      longVTokenAddress: altAddress,
    });

    expect(result).toBeUndefined();
  });

  it('clamps the DSA balance to the user supply balance', () => {
    const result = formatToYieldPlusPosition({
      ...baseInput,
      dsaBalanceMantissa: convertTokensToMantissa({
        value: xvsAsset.userSupplyBalanceTokens.plus(10),
        token: xvsAsset.vToken.underlyingToken,
      }),
    });

    expect(result).toMatchSnapshot();
  });

  it('deducts the DSA balance from the long balance when both markets are the same', () => {
    const result = formatToYieldPlusPosition({
      ...baseInput,
      chainId: usdtAsset.vToken.underlyingToken.chainId,
      positionAccountAddress: altAddress,
      dsaVTokenAddress: usdcAsset.vToken.address,
      dsaBalanceMantissa: convertTokensToMantissa({
        value: usdcAsset.userSupplyBalanceTokens,
        token: usdcAsset.vToken.underlyingToken,
      }),
      longVTokenAddress: usdcAsset.vToken.address,
      shortVTokenAddress: usdtAsset.vToken.address,
      leverageFactor: 1.5,
      unrealizedPnlCents: -50,
      unrealizedPnlPercentage: -0.4,
    });

    expect(result).toMatchSnapshot();
  });

  it('returns zero for derived values when the position has no supplied balance', () => {
    const result = formatToYieldPlusPosition({
      ...baseInput,
      chainId: usdtAsset.vToken.underlyingToken.chainId,
      dsaVTokenAddress: busdAsset.vToken.address,
      dsaBalanceMantissa: new BigNumber(0),
      longVTokenAddress: busdAsset.vToken.address,
      shortVTokenAddress: usdtAsset.vToken.address,
    });

    expect(result).toMatchSnapshot();
  });
});
