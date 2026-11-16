import { act, waitFor } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router';

import { renderHook } from 'testUtils/render';

import { useLiteNavigation } from '..';

const useNavigationHarness = () => ({
  navigation: useLiteNavigation(),
  location: useLocation(),
  navigate: useNavigate(),
});

describe('useLiteNavigation', () => {
  it('lets the browser Back button step from the form to the source list and then to the asset list', async () => {
    const { result } = renderHook(() => useNavigationHarness(), {
      routerInitialEntries: ['/?chainId=97'],
    });

    act(() => result.current.navigation.selectAsset('USDT'));
    act(() => result.current.navigation.selectMarket('core'));

    expect(result.current.navigation.assetSymbol).toBe('USDT');
    expect(result.current.navigation.marketSlug).toBe('core');

    act(() => result.current.navigate(-1));

    await waitFor(() => expect(result.current.navigation.marketSlug).toBeUndefined());
    expect(result.current.navigation.assetSymbol).toBe('USDT');

    act(() => result.current.navigate(-1));

    await waitFor(() => expect(result.current.navigation.assetSymbol).toBeUndefined());
    expect(result.current.location.search).toBe('?chainId=97');
  });

  it('closes an opened form by going back in history, so Back does not reopen it', async () => {
    const { result } = renderHook(() => useNavigationHarness(), {
      routerInitialEntries: ['/?chainId=97'],
    });

    const listKey = result.current.location.key;

    act(() => result.current.navigation.selectAsset('USDT'));
    act(() => result.current.navigation.selectMarket('core'));
    act(() => result.current.navigation.selectAsset(undefined));

    await waitFor(() => expect(result.current.location.key).toBe(listKey));
    expect(result.current.navigation.assetSymbol).toBeUndefined();
  });

  it('replaces the entry when closing a form that was opened from a shared link', () => {
    const { result } = renderHook(() => useNavigationHarness(), {
      routerInitialEntries: ['/?chainId=97&asset=USDT&market=core'],
    });

    act(() => result.current.navigation.selectMarket(undefined));

    expect(result.current.navigation.assetSymbol).toBe('USDT');
    expect(result.current.navigation.marketSlug).toBeUndefined();
  });

  it('keeps switching between Earn and Borrow out of the history depth', () => {
    const { result } = renderHook(() => useNavigationHarness(), {
      routerInitialEntries: ['/?chainId=97'],
    });

    act(() => result.current.navigation.selectAsset('USDT'));
    act(() => result.current.navigation.setMode('borrow'));

    expect(result.current.navigation.mode).toBe('borrow');
    expect(result.current.navigation.assetSymbol).toBeUndefined();
    expect(result.current.location.state?.liteDepth).toBe(0);
  });
});
