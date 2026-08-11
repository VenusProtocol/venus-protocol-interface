import { fireEvent, screen } from '@testing-library/react';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAnalytics } from 'libs/analytics';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { LiquidityHubTable } from '..';

const liquidityHub = liquidityHubs[0];
const mockCaptureAnalyticEvent = vi.fn();

describe('LiquidityHubTable', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
    (useUserChainSettings as Mock).mockReturnValue([defaultUserChainSettings, vi.fn()]);
  });

  it('tracks clicks on hub rows', () => {
    renderComponent(<LiquidityHubTable data={[liquidityHub]} />);

    const symbolDom = screen.getAllByText(liquidityHub.vhToken.underlyingToken.symbol)[0];

    if (!symbolDom) {
      throw new Error('Expected Liquidity Hub symbol to be rendered');
    }

    const row = symbolDom.closest('tr, a');

    if (!row) {
      throw new Error('Expected Liquidity Hub row to be rendered');
    }

    fireEvent.click(row);

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('hub_selected', {
      assetSymbol: liquidityHub.vhToken.underlyingToken.symbol,
      chainID: liquidityHub.vhToken.chainId,
      variant: 'liquidity_hubs_table',
    });
  });
});
