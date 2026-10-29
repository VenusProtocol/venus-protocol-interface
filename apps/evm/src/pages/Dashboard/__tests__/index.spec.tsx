import { waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetSpokePools } from 'clients/api';
import { useStore as useInterfaceModeStore } from 'hooks/useInterfaceMode/store';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { Dashboard } from '..';

describe('Dashboard', () => {
  beforeEach(() => {
    useInterfaceModeStore.setState({ mode: 'pro' });
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

  it('shows the Markets tab spinner until the Spoke positions are loaded', async () => {
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: true,
      errorUpdateCount: 0,
      data: undefined,
    }));

    const { getByAltText, queryByText } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(getByAltText('Spinner')).toBeInTheDocument());
    expect(queryByText(en.account.marketBreakdown.tables.supplyTableTitle)).not.toBeInTheDocument();
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
