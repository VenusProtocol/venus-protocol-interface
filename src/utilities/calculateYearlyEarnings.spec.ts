import { Asset } from 'types';

import { assetData as assets } from '__mocks__/models/asset';

import {
  calculateYearlyEarningsForAsset,
  calculateYearlyEarningsForAssets,
} from './calculateYearlyEarnings';

describe('utilities/calculateYearlyEarnings', () => {
  test('calculates yearly Earnings for single asset', () => {
    const earnings = calculateYearlyEarningsForAsset({
      asset: assets[0] as Asset,
    });

    expect(earnings.toFixed()).toMatchInlineSnapshot(
      '"6.014514624212835039288069236840175305250048"',
    );
  });

  test('calculates yearly Earnings for array of assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets: assets as Asset[],
    });

    expect(earnings?.toFixed()).toMatchInlineSnapshot(
      '"-4.1235060802240148531257692837859376156813296"',
    );
  });
});
