import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import {
  useGetHypotheticalPrimeApys,
  useGetPrimeStatus,
  useGetXvsVaultUserInfo,
} from 'clients/api';

import { exactAmountInSwap } from '__mocks__/models/swaps';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { AccountData, type AccountDataProps } from '..';

describe('AccountData - Feature flag enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );

    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        xvsVaultPoolId: 1,
      },
    }));

    (useGetXvsVaultUserInfo as Vi.Mock).mockImplementation(() => ({
      data: {
        stakedAmountMantissa: new BigNumber('1000000000000000'),
      },
    }));

    (useGetHypotheticalPrimeApys as Vi.Mock).mockImplementation(() => ({
      data: {
        supplyApyPercentage: new BigNumber(13.4),
        borrowApyPercentage: new BigNumber(10.4),
      },
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(
      <AccountData
        asset={poolData[0].assets[1]}
        pool={poolData[0]}
        action="supply"
        amountTokens={new BigNumber(0)}
      />,
    );
  });

  it.each([
    { action: 'supply', amountToken: 0 },
    { action: 'supply', amountToken: 50 },
    { action: 'withdraw', amountToken: 0 },
    { action: 'withdraw', amountToken: 50 },
    { action: 'borrow', amountToken: 0 },
    { action: 'borrow', amountToken: 50 },
    { action: 'repay', amountToken: 0 },
    { action: 'repay', amountToken: 50 },
  ] as { action: AccountDataProps['action']; amountToken: number }[])(
    'renders correct values: %s',
    async ({ action, amountToken }) => {
      const { container } = renderComponent(
        <AccountData
          asset={poolData[0].assets[1]}
          pool={poolData[0]}
          action={action}
          amountTokens={new BigNumber(amountToken)}
        />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );

  it.each([
    { action: 'supply' },
    { action: 'withdraw' },
    { action: 'borrow' },
    { action: 'repay' },
  ] as { action: AccountDataProps['action'] }[])(
    'renders correct values when using swap: %s',
    async ({ action }) => {
      const { container } = renderComponent(
        <AccountData
          asset={poolData[0].assets[1]}
          pool={poolData[0]}
          action={action}
          amountTokens={new BigNumber(1)} // The actual amount used is defined by the swap
          swap={exactAmountInSwap}
          isUsingSwap
        />,
      );

      expect(container.textContent).toMatchSnapshot();
    },
  );
});
