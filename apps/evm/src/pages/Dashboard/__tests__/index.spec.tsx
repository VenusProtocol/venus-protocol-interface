import { waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetSpokePools } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { Dashboard } from '..';

describe('Dashboard', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
  });

  it('displays content correctly', async () => {
    const { container } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays Hubs tab when the liquidity hub feature flag is enabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'liquidityHub',
    );

    const { getByText } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(getByText(en.account.tabs.hubs)).toBeInTheDocument());
  });

  it('shows the spinner until the Spoke positions are loaded', async () => {
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: true,
      errorUpdateCount: 0,
      data: undefined,
    }));

    const { queryByText } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(useGetSpokePools).toHaveBeenCalled());

    expect(queryByText(en.dashboard.overview.netWorth.label)).not.toBeInTheDocument();
  });

  it('shows the page once the Spoke positions have failed, even while retrying', async () => {
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: true,
      errorUpdateCount: 1,
      data: undefined,
    }));

    const { getByText } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByText(en.dashboard.overview.netWorth.label)).toBeInTheDocument(),
    );
  });
});
