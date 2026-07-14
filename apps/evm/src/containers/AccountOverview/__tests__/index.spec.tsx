import { fireEvent, waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import * as storeModule from 'store';
import { renderComponent } from 'testUtils/render';
import { AccountOverview } from '..';
import { testIds } from '../testIds';

vi.mock('hooks/useUserChainSettings');

describe('AccountOverview', () => {
  it('displays correctly when user is not connected', async () => {
    const { container } = renderComponent(<AccountOverview />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays correctly when user is connected', async () => {
    const { container, queryByTestId } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays correctly when user is connected and accordion is expanded', async () => {
    const { container, queryByTestId, getByText } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

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

    vi.spyOn(storeModule, 'useStore').mockImplementation((selector: any) =>
      selector({
        userSettings: {},
        setUserSettings: mockSetUserSettings,
      }),
    );

    const { container, queryAllByRole } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    const toggleBalancesButton = queryAllByRole('button').find(
      button => !button.hasAttribute('disabled'),
    );

    if (!toggleBalancesButton) {
      throw new Error('Expected balance visibility toggle button to be enabled');
    }

    fireEvent.click(toggleBalancesButton);

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
