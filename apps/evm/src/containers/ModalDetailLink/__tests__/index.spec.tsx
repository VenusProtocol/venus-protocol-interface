import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { ActiveTabPathProvider, Tabs } from 'components';
import type { ProShortcut } from 'libs/analytics';
import { useAnalytics } from 'libs/analytics';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { ModalDetailLink } from '..';

const captureAnalyticEventMock = vi.fn();

const analyticProps: ProShortcut = {
  variant: 'dashboard_core_supply',
  destination: 'core_market',
  poolName: 'Core Pool',
  assetSymbol: 'USDT',
};

const destination = 'USDT market in Venus Core';

describe('ModalDetailLink', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: captureAnalyticEventMock,
    }));
  });

  it('links to the destination', () => {
    renderComponent(
      <ModalDetailLink
        getTo={() => ({ pathname: '/markets/0x1/0x2', search: 'tab=supply' })}
        destination={destination}
        analyticProps={analyticProps}
      />,
    );

    const link = screen.getByRole('link', {
      name: en.modalDetailLink.ariaLabel.replace('{{destination}}', destination),
    });

    expect(link.getAttribute('href')).toMatch(/^\/markets\/0x1\/0x2\?tab=supply&/);
    expect(link).toHaveTextContent(en.layout.interfaceMode.pro);
    expect(captureAnalyticEventMock).toHaveBeenCalledWith('pro_shortcut_viewed', analyticProps);
  });

  it('builds the link and the click event from the active tabs', () => {
    renderComponent(
      <ActiveTabPathProvider>
        <ModalDetailLink
          getTo={([tabId, subTabId]) => ({
            pathname: '/spoke/0x1/0x2',
            search: `tab=${tabId}&subTab=${subTabId}`,
          })}
          destination={destination}
          analyticProps={analyticProps}
        />

        <Tabs
          tabs={[
            {
              id: 'collateral',
              title: 'Collateral',
              content: (
                <Tabs
                  tabs={[
                    { id: 'supply', title: 'Supply', content: 'Supply form' },
                    { id: 'withdraw', title: 'Withdraw', content: 'Withdraw form' },
                  ]}
                />
              ),
            },
            {
              id: 'loan',
              title: 'Loan',
              content: (
                <Tabs
                  tabs={[
                    { id: 'borrow', title: 'Borrow', content: 'Borrow form' },
                    { id: 'repay', title: 'Repay', content: 'Repay form' },
                  ]}
                />
              ),
            },
          ]}
          variant="secondary"
        />
      </ActiveTabPathProvider>,
    );

    const link = screen.getByRole('link');

    expect(link.getAttribute('href')).toMatch(/^\/spoke\/0x1\/0x2\?tab=collateral&subTab=supply&/);

    fireEvent.click(screen.getByRole('button', { name: 'Loan' }));
    fireEvent.click(screen.getByRole('button', { name: 'Repay' }));

    expect(link.getAttribute('href')).toMatch(/^\/spoke\/0x1\/0x2\?tab=loan&subTab=repay&/);

    fireEvent.click(link);

    expect(captureAnalyticEventMock).toHaveBeenCalledWith('pro_shortcut_click', {
      ...analyticProps,
      activeTab: 'loan/repay',
    });
  });

  it('sends the click event on a middle click but not on a right click', () => {
    renderComponent(
      <ModalDetailLink
        getTo={() => ({ pathname: '/markets/0x1/0x2', search: 'tab=supply' })}
        destination={destination}
        analyticProps={analyticProps}
      />,
    );

    const link = screen.getByRole('link');

    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 2 }));

    expect(captureAnalyticEventMock).not.toHaveBeenCalledWith(
      'pro_shortcut_click',
      expect.anything(),
    );

    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 1 }));

    expect(captureAnalyticEventMock).toHaveBeenCalledWith('pro_shortcut_click', analyticProps);
  });

  it('renders nothing when the destination is the current page', () => {
    renderComponent(
      <ModalDetailLink
        getTo={() => '/prime-leaderboard'}
        destination={destination}
        analyticProps={analyticProps}
      />,
      { routerInitialEntries: ['/prime-leaderboard'], routePath: '/prime-leaderboard' },
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(captureAnalyticEventMock).not.toHaveBeenCalled();
  });
});
