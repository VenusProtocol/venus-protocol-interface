import { fireEvent, waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { store } from 'store';
import { renderComponent } from 'testUtils/render';
import { Overview } from '..';
import { testIds } from '../testIds';

vi.mock('hooks/useUserChainSettings');

describe('Overview', () => {
  it('displays correctly when user is not connected', async () => {
    const { container } = renderComponent(<Overview />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays correctly when user is connected', async () => {
    const { container, queryByTestId } = renderComponent(<Overview />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => queryByTestId(testIds.performanceChartPreview));

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays correctly when user is connected and accordion is expanded', async () => {
    const { container, queryByTestId, getByText } = renderComponent(<Overview />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => queryByTestId(testIds.performanceChartPreview));

    // Expand accordion
    fireEvent.click(getByText(en.dashboard.overview.absolutePerformance).closest('button')!);

    expect(container.textContent).toMatchSnapshot();
  });

  it('hides user balances when doNotShowUserBalances setting is true', async () => {
    const mockSetUserSettings = vi.fn();

    vi.mocked(useUserChainSettings).mockReturnValue([
      { ...defaultUserChainSettings, doNotShowUserBalances: true },
      vi.fn(),
    ]);

    vi.spyOn(store.use, 'setUserSettings').mockReturnValue(mockSetUserSettings);

    const { container, queryAllByRole } = renderComponent(<Overview />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.textContent).toMatchSnapshot();

    // Expand accordion
    fireEvent.click(queryAllByRole('button')[0]);

    expect(mockSetUserSettings).toHaveBeenCalledTimes(1);
    expect(mockSetUserSettings.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "settings": {
            "doNotShowUserBalances": false,
          },
        },
      ]
    `);
  });
});
