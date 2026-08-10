import { waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
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
});
