import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs as fakeLiquidityHubs } from '__mocks__/models/liquidityHubs';
import { useAnalytics } from 'libs/analytics';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { LiquidityHub } from 'types';
import type { Mock } from 'vitest';
import { Hubs } from '..';

const mockCaptureAnalyticEvent = vi.fn();

const liquidityHubsWithoutPositions: LiquidityHub[] = fakeLiquidityHubs.map(liquidityHub => ({
  ...liquidityHub,
  userSupplyBalanceCents: new BigNumber(0),
  userSupplyBalanceTokens: new BigNumber(0),
  userYearlyEarningsCents: new BigNumber(0),
}));

describe('Hubs', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('displays content correctly', async () => {
    const { container } = renderComponent(<Hubs liquidityHubs={fakeLiquidityHubs} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays placeholder when there are no hubs to display', async () => {
    const { container } = renderComponent(<Hubs liquidityHubs={liquidityHubsWithoutPositions} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('tracks clicks on the dashboard CTA', async () => {
    renderComponent(<Hubs liquidityHubs={liquidityHubsWithoutPositions} />, {
      accountAddress: fakeAccountAddress,
    });

    const cta = screen.getByText(en.account.placeholder.buttonLabel).closest('a');

    if (!cta) {
      throw new Error('Expected dashboard CTA to be rendered');
    }

    fireEvent.click(cta);

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('hub_navigation', {
      variant: 'dashboard_hubs_tabs_placeholder',
    });
  });
});
