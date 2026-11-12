import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { eth } from '__mocks__/models/tokens';
import { fakeAsset, fakeWethAsset } from 'containers/MarketForm/SupplyForm/__testUtils__/fakeData';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';
import type { Asset } from 'types';

import { useCollateralOptions } from '..';

const makeCollaterals = ({
  nativeBalanceTokens,
  wrappedBalanceTokens,
}: {
  nativeBalanceTokens: number;
  wrappedBalanceTokens: number;
}): Asset[] => [
  { ...fakeWethAsset, userWalletBalanceTokens: new BigNumber(wrappedBalanceTokens) },
  {
    ...fakeAsset,
    userWalletBalanceTokens: new BigNumber(nativeBalanceTokens),
    vToken: {
      ...fakeAsset.vToken,
      address: '0x1111111111111111111111111111111111111111',
      underlyingToken: eth,
    },
  },
];

describe('useCollateralOptions', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'wrapUnwrapNativeToken',
    );
  });

  it('lists the native token as an extra option for the wrapped market', () => {
    const collaterals = makeCollaterals({ nativeBalanceTokens: 1, wrappedBalanceTokens: 1 });
    const { result } = renderHook(() => useCollateralOptions({ collaterals }));

    expect(
      result.current.options.map(option => [option.asset.vToken.address, option.token.symbol]),
    ).toEqual([
      [collaterals[0].vToken.address, fakeWethAsset.vToken.underlyingToken.symbol],
      [collaterals[0].vToken.address, eth.symbol],
      [collaterals[1].vToken.address, eth.symbol],
    ]);
  });

  it('defaults to the native token when the wallet holds more of it', () => {
    const collaterals = makeCollaterals({ nativeBalanceTokens: 10, wrappedBalanceTokens: 1 });
    const { result } = renderHook(() => useCollateralOptions({ collaterals }));

    expect(result.current.getDefaultOption(collaterals[0]).token.symbol).toBe(eth.symbol);
  });

  it('defaults to the wrapped token when the wallet holds more of it', () => {
    const collaterals = makeCollaterals({ nativeBalanceTokens: 1, wrappedBalanceTokens: 10 });
    const { result } = renderHook(() => useCollateralOptions({ collaterals }));

    expect(result.current.getDefaultOption(collaterals[0]).token.symbol).toBe(
      fakeWethAsset.vToken.underlyingToken.symbol,
    );
  });
});
