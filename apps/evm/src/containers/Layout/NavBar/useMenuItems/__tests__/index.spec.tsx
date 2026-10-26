import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetLiquidityHubs } from 'clients/api';
import { VENUS_FLUX_URL } from 'constants/production';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAnalytics } from 'libs/analytics';
import { en } from 'libs/translations';
import { renderHook } from 'testUtils/render';
import { useMenuItems } from '..';
import type { SubMenu } from '../../types';

const mockCaptureAnalyticEvent = vi.fn();

const makeLiquidityHub = (supplyApyPercentage: number, isPaused = false) => ({
  ...liquidityHubs[0],
  supplyApyPercentage: new BigNumber(supplyApyPercentage),
  supplyTokenDistributions: [],
  isPaused,
});

const mockLiquidityHubs = (data?: ReturnType<typeof makeLiquidityHub>[]) =>
  (useGetLiquidityHubs as Mock).mockImplementation(() => ({
    data: data && { liquidityHubs: data },
    isLoading: !data,
  }));

const findSubMenu = (menu: ReturnType<typeof useMenuItems>, label: string) =>
  menu.find(item => 'items' in item && item.label === label) as SubMenu;

describe('useMenuItems', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name === 'liquidityHub');
    mockLiquidityHubs([]);
  });

  it('tracks clicks on the topbar Earn dropdown Liquidity Hub item', () => {
    const { result } = renderHook(() => useMenuItems());
    const earnMenuItem = findSubMenu(result.current, en.layout.menu.earn.label);
    const liquidityHubItem = earnMenuItem.items.find(item => item.label === 'Liquidity Hub');

    liquidityHubItem?.onClick?.();

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('hub_navigation', {
      variant: 'topbar_earn_dropdown',
    });
  });

  it('tags Earn and the Liquidity Hub item with the highest APY of the unpaused hubs', () => {
    mockLiquidityHubs([makeLiquidityHub(2.1), makeLiquidityHub(3.64), makeLiquidityHub(9, true)]);

    const { result } = renderHook(() => useMenuItems());
    const earnMenu = findSubMenu(result.current, en.layout.menu.earn.label);
    const liquidityHubItem = earnMenu.items.find(
      item => item.label === en.layouts.menu.markets.liquidityHub.label,
    );

    expect(earnMenu.tagLabel).toBe('3.64%');
    expect(liquidityHubItem?.tagLabel).toBe('3.64%');
  });

  it.each([
    ['loading', undefined],
    ['empty', []],
    ['zero APY', [makeLiquidityHub(0)]],
  ])('hides the APY tag when the hubs are %s', (_, data) => {
    mockLiquidityHubs(data);

    const { result } = renderHook(() => useMenuItems());
    const earnMenu = findSubMenu(result.current, en.layout.menu.earn.label);

    expect(earnMenu.tagLabel).toBeUndefined();
    expect(earnMenu.items.every(item => item.tagLabel === undefined)).toBe(true);
  });

  it('tags only Venus Spoke as new and keeps Borrow to Venus Core and Venus Spoke', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }) => name === 'spoke' || name === 'liquidityHub',
    );

    const { result } = renderHook(() => useMenuItems());
    const borrowMenu = findSubMenu(result.current, en.layout.menu.borrow.label);

    expect(borrowMenu.tagLabel).toBeUndefined();
    expect(borrowMenu.items.map(item => [item.label, item.tagLabel])).toEqual([
      [en.layouts.menu.markets.venusCore.label, undefined],
      [en.layouts.menu.markets.venusSpoke.label, en.layout.menu.new],
    ]);
  });

  it('places Flux as an external link right before Others', () => {
    const { result } = renderHook(() => useMenuItems());
    const labels = result.current.map(item => item.label);
    const flux = result.current.find(item => item.label === en.layout.menu.flux.label);

    expect(labels.slice(-2)).toEqual([en.layout.menu.flux.label, en.layout.menu.others.label]);
    expect(flux).toMatchObject({ href: VENUS_FLUX_URL });
  });
});
