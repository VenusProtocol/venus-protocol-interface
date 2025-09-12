import { screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetUserVaiBorrowBalance, useGetVaiRepayApr } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { Account } from '..';

describe('Account', () => {
  beforeEach(() => {
    (useGetUserVaiBorrowBalance as Mock).mockImplementation(() => ({
      data: {
        userVaiBorrowBalanceMantissa: new BigNumber('1000000000000000000000'),
      },
      isLoading: false,
    }));

    (useGetVaiRepayApr as Mock).mockImplementation(() => ({
      data: {
        repayAprPercentage: new BigNumber(5.34),
      },
      isLoading: false,
    }));
  });

  it('displays content correctly', async () => {
    const { container } = renderComponent(<Account />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays settings tab when there are user-specific settings available on the selected chain correctly', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'gaslessTransactions',
    );

    const { container } = renderComponent(<Account />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(screen.getByText(en.account.tabs.settings)).toBeInTheDocument();
  });
});
