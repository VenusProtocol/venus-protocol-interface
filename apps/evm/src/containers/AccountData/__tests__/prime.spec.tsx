import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { fireEvent } from '@testing-library/react';

import {
  useGetHypotheticalPrimeApys,
  useGetPrimeStatus,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import { en } from 'libs/translations';

import { AccountData, type AccountDataProps } from '..';

describe('AccountData - Feature flag enabled: integratedSwap', () => {
  beforeEach(() => {
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
    'displays Prime APY correctly: %s',
    async ({ action, amountToken }) => {
      const { container, getByText } = renderComponent(
        <AccountData
          asset={poolData[0].assets[1]}
          pool={poolData[0]}
          action={action}
          amountTokens={new BigNumber(amountToken)}
        />,
      );

      // Open total APY accordion
      fireEvent.click(getByText(en.accountData.totalApy.label).closest('button')!);

      expect(container.textContent).toMatchSnapshot();
    },
  );
});
