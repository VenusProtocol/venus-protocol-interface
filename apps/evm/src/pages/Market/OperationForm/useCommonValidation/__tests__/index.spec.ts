import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { exactInSwapQuote } from '__mocks__/models/swap';
import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { renderHook } from 'testUtils/render';
import type { Asset, AssetBalanceMutation } from 'types';
import { areTokensEqual } from 'utilities';
import { type UseCommonValidationInput, useCommonValidation } from '..';

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[0];
const fakeSupplyBalanceMutations: AssetBalanceMutation[] = [
  {
    type: 'asset',
    action: 'supply',
    vTokenAddress: fakeAsset.vToken.address,
    amountTokens: new BigNumber(1),
  },
];

const updateAsset = (assets: Asset[], overrides: Partial<Asset>) =>
  assets.map(asset =>
    areTokensEqual(asset.vToken, fakeAsset.vToken) ? { ...fakeAsset, ...overrides } : asset,
  );

interface Case {
  expectedErrorCode: string;
  input: UseCommonValidationInput;
}

const cases: Case[] = [
  {
    expectedErrorCode: 'SUPPLY_CAP_ALREADY_REACHED',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          supplyCapTokens: new BigNumber(1),
        }),
      },
      simulatedPool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          supplyBalanceTokens: new BigNumber(2),
        }),
      },
      balanceMutations: fakeSupplyBalanceMutations,
    },
  },
  {
    expectedErrorCode: 'BORROW_CAP_ALREADY_REACHED',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          borrowCapTokens: new BigNumber(1),
        }),
      },
      simulatedPool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          borrowBalanceTokens: new BigNumber(2),
        }),
      },
      balanceMutations: [
        {
          type: 'asset',
          action: 'borrow',
          vTokenAddress: fakeAsset.vToken.address,
          amountTokens: new BigNumber(1),
        },
      ],
    },
  },
  {
    expectedErrorCode: 'HIGHER_THAN_LIQUIDITY',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          cashTokens: new BigNumber(1),
        }),
      },
      balanceMutations: [
        {
          type: 'asset',
          action: 'borrow',
          vTokenAddress: fakeAsset.vToken.address,
          amountTokens: new BigNumber(2),
        },
      ],
    },
  },
  {
    expectedErrorCode: 'HIGHER_THAN_LIQUIDITY',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          cashTokens: new BigNumber(1),
        }),
      },
      balanceMutations: [
        {
          type: 'asset',
          action: 'withdraw',
          vTokenAddress: fakeAsset.vToken.address,
          amountTokens: new BigNumber(2),
        },
      ],
    },
  },
  {
    expectedErrorCode: 'HIGHER_THAN_AVAILABLE_AMOUNT',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          userSupplyBalanceTokens: new BigNumber(1),
        }),
      },
      balanceMutations: [
        {
          type: 'asset',
          action: 'withdraw',
          vTokenAddress: fakeAsset.vToken.address,
          amountTokens: new BigNumber(2),
        },
      ],
    },
  },
  {
    expectedErrorCode: 'HIGHER_THAN_REPAY_BALANCE',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          userBorrowBalanceTokens: new BigNumber(1),
        }),
      },
      balanceMutations: [
        {
          type: 'asset',
          action: 'repay',
          vTokenAddress: fakeAsset.vToken.address,
          amountTokens: new BigNumber(2),
        },
      ],
    },
  },
  {
    expectedErrorCode: 'SWAP_PRICE_IMPACT_TOO_HIGH',
    input: {
      pool: fakePool,
      swapQuote: {
        ...exactInSwapQuote,
        priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE + 0.1,
      },
      balanceMutations: fakeSupplyBalanceMutations,
    },
  },
  {
    expectedErrorCode: 'NO_SWAP_QUOTE_FOUND',
    input: {
      pool: fakePool,
      swapQuoteErrorCode: 'noSwapQuoteFound',
      balanceMutations: fakeSupplyBalanceMutations,
    },
  },
  {
    expectedErrorCode: 'TOO_RISKY',
    input: {
      pool: fakePool,
      simulatedPool: {
        ...fakePool,
        userHealthFactor: HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
      },
      balanceMutations: fakeSupplyBalanceMutations,
    },
  },
  {
    expectedErrorCode: 'REQUIRES_RISK_ACKNOWLEDGEMENT',
    input: {
      pool: fakePool,
      simulatedPool: {
        ...fakePool,
        userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.1,
      },
      userAcknowledgesRisk: false,
      balanceMutations: fakeSupplyBalanceMutations,
    },
  },
  {
    expectedErrorCode: 'HIGHER_THAN_SUPPLY_CAP',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          supplyBalanceTokens: new BigNumber(1),
          supplyCapTokens: new BigNumber(10),
        }),
      },
      simulatedPool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          supplyBalanceTokens: new BigNumber(100),
        }),
      },
      userAcknowledgesRisk: false,
      balanceMutations: fakeSupplyBalanceMutations,
    },
  },
  {
    expectedErrorCode: 'HIGHER_THAN_BORROW_CAP',
    input: {
      pool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          borrowBalanceTokens: new BigNumber(1),
          borrowCapTokens: new BigNumber(10),
        }),
      },
      simulatedPool: {
        ...fakePool,
        assets: updateAsset(fakePool.assets, {
          borrowBalanceTokens: new BigNumber(100),
        }),
      },
      userAcknowledgesRisk: false,
      balanceMutations: [
        {
          type: 'asset',
          action: 'borrow',
          vTokenAddress: fakeAsset.vToken.address,
          amountTokens: new BigNumber(1),
        },
      ],
    },
  },
];

describe('useCommonValidation', () => {
  it.each(cases)(
    'returns the right error based on passed arguments: $expectedErrorCode',
    ({ expectedErrorCode, input }) => {
      const { result } = renderHook(() => useCommonValidation(input));

      expect(result.current?.code).toBe(expectedErrorCode);
      expect(result).toMatchSnapshot();
    },
  );

  it('returns undefined if no error was found', () => {
    const { result } = renderHook(() =>
      useCommonValidation({
        pool: fakePool,
        balanceMutations: [],
      }),
    );

    expect(result.current).toBe(undefined);
  });

  it('returns undefined if no balance mutations affect assets from the passed pool', () => {
    const { result } = renderHook(() =>
      useCommonValidation({
        pool: fakePool,
        balanceMutations: [
          {
            type: 'asset',
            action: 'borrow',
            vTokenAddress: '0xfakeVTokenAddress',
            amountTokens: new BigNumber(1),
          },
        ],
      }),
    );

    expect(result.current).toBe(undefined);
  });
});
