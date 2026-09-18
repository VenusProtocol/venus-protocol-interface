import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useMenuItems } from '..';
import type { SubMenu } from '../../types';

const mockCaptureAnalyticEvent = vi.fn();

describe('useMenuItems', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name === 'liquidityHub');
  });

  it('tracks clicks on the topbar Earn dropdown Liquidity Hub item', () => {
    const { result } = renderHook(() => useMenuItems());
    const earnMenuItem = result.current.find(
      menuItem => 'items' in menuItem && menuItem.label === 'Earn',
    ) as SubMenu;
    const liquidityHubItem = earnMenuItem.items.find(item => item.label === 'Liquidity Hub');

    liquidityHubItem?.onClick?.();

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('hub_navigation', {
      variant: 'navigation_menu',
    });
  });
});
