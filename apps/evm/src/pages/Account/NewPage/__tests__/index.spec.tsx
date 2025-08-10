import { screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { useGetUserVaiBorrowBalance } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { NewPage } from '..';

describe('Account', () => {
  beforeEach(() => {
    (useGetUserVaiBorrowBalance as Mock).mockImplementation(() => ({
      data: {
        userVaiBorrowBalanceMantissa: new BigNumber('1000000000000000000000'),
      },
      isLoading: false,
    }));
  });

  it('displays content correctly', async () => {
    const { container } = renderComponent(<NewPage />);

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays settings tab when there are user-specific settings available on the selected chain correctly', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'gaslessTransactions',
    );

    const { container } = renderComponent(<NewPage />);

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(screen.getByText(en.account.tabs.settings)).toBeInTheDocument();
  });
});
