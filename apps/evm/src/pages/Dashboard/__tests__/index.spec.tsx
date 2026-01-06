import { screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { Dashboard } from '..';

describe('Dashboard', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays settings tab when there are user-specific settings available on the selected chain correctly', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'gaslessTransactions',
    );

    const { container } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).not.toBeFalsy());

    expect(screen.getByText(en.account.tabs.settings)).toBeInTheDocument();
  });
});
