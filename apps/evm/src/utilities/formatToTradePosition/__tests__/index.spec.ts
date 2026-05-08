import BigNumber from 'bignumber.js';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { convertTokensToMantissa } from 'utilities';

import { formatToTradePosition } from '..';

const pool = poolData[0];
const [xvsAsset, usdcAsset, usdtAsset, busdAsset] = pool.assets;

const baseInput: Parameters<typeof formatToTradePosition>[0] = {
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

describe('formatToTradePosition', () => {
  it('returns the position in the expected format', () => {
    const result = formatToTradePosition(baseInput);

    expect(result).toMatchSnapshot();
  });

  it('returns undefined when one of the required assets cannot be found in the pool', () => {
    const result = formatToTradePosition({
      ...baseInput,
      longVTokenAddress: altAddress,
    });

    expect(result).toBeUndefined();
  });

  it('deducts the DSA balance from the long balance and still derives liquidation price when both markets are the same', () => {
    const result = formatToTradePosition({
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

  it('uses the combined discounted DSA and long balances for liquidation price when both markets are the same', () => {
    const expandedUsdcSupplyAsset = {
      ...usdcAsset,
      userSupplyBalanceTokens: new BigNumber('200'),
      userSupplyBalanceCents: new BigNumber('19998.728'),
    };

    const customPool = {
      ...pool,
      assets: pool.assets.map(asset =>
        asset.vToken.address === usdcAsset.vToken.address ? expandedUsdcSupplyAsset : asset,
      ),
    };

    const result = formatToTradePosition({
      ...baseInput,
      pool: customPool,
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
    const result = formatToTradePosition({
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
