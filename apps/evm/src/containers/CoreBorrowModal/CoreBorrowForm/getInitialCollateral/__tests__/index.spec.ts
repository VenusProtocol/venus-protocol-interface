import { fakeAsset, fakeWethAsset } from 'containers/MarketForm/SupplyForm/__testUtils__/fakeData';

import { getInitialCollateral } from '..';

const pausedAsset = {
  ...fakeAsset,
  vToken: { ...fakeAsset.vToken, address: '0x1111111111111111111111111111111111111111' as const },
  disabledTokenActions: ['supply' as const],
};

describe('getInitialCollateral', () => {
  it('keeps the preselected collateral', () => {
    expect(
      getInitialCollateral({
        collaterals: [fakeWethAsset, pausedAsset],
        preselectedCollateral: pausedAsset,
      }),
    ).toBe(pausedAsset);
  });

  it('skips collaterals that cannot be supplied', () => {
    expect(getInitialCollateral({ collaterals: [pausedAsset, fakeWethAsset] })).toBe(fakeWethAsset);
  });

  it('falls back to the first collateral when none can be supplied', () => {
    expect(getInitialCollateral({ collaterals: [pausedAsset] })).toBe(pausedAsset);
  });
});
