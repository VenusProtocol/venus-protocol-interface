import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import type { LiteBorrowMarket } from 'pages/Lite/types';
import { matchesCollaterals } from '..';

const [loanAsset, collateralA, collateralB] = assetData;

const market: LiteBorrowMarket = {
  id: 'core',
  source: { type: 'core', asset: loanAsset, collaterals: [collateralA, collateralB] },
  apyPercentage: new BigNumber(0),
  borrowTokens: new BigNumber(0),
  borrowCents: new BigNumber(0),
  liquidityTokens: new BigNumber(0),
  liquidityCents: new BigNumber(0),
};

const symbolA = collateralA.vToken.underlyingToken.symbol;
const symbolB = collateralB.vToken.underlyingToken.symbol;

describe('matchesCollaterals', () => {
  it('matches every market when no filter is set', () => {
    expect(matchesCollaterals({ market, searchValue: '', selectedCollaterals: [] })).toBe(true);
  });

  it('matches a collateral symbol by search, case insensitive', () => {
    expect(
      matchesCollaterals({
        market,
        searchValue: symbolA.slice(0, 2).toLowerCase(),
        selectedCollaterals: [],
      }),
    ).toBe(true);
    expect(matchesCollaterals({ market, searchValue: 'zzz', selectedCollaterals: [] })).toBe(false);
  });

  it('matches when any selected collateral is accepted', () => {
    expect(
      matchesCollaterals({ market, searchValue: '', selectedCollaterals: [symbolB, 'ZZZ'] }),
    ).toBe(true);
    expect(matchesCollaterals({ market, searchValue: '', selectedCollaterals: ['ZZZ'] })).toBe(
      false,
    );
  });

  it('requires both the search and the selection to match', () => {
    expect(matchesCollaterals({ market, searchValue: 'zzz', selectedCollaterals: [symbolA] })).toBe(
      false,
    );
  });
});
