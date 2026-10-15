import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router';
import type { Mock } from 'vitest';

import { eModeGroups } from '__mocks__/models/eModeGroup';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { MarketCategory, Pool } from 'types';

import { Markets } from '..';

const bStocksCategory: MarketCategory = { tag: 'bstocks', label: 'bStocks', order: 0 };
const stablecoinsCategory: MarketCategory = { tag: 'stablecoins', label: 'Stablecoins', order: 1 };

const [bStocksAsset, ...stablecoinAssets] = poolData[0].assets.map(asset => ({
  ...asset,
  disabledTokenActions: [],
}));

const fakePool: Pool = {
  ...poolData[0],
  assets: [
    { ...bStocksAsset, category: bStocksCategory.tag, marketCategory: bStocksCategory },
    ...stablecoinAssets.map(asset => ({
      ...asset,
      category: stablecoinsCategory.tag,
      marketCategory: stablecoinsCategory,
    })),
  ],
  eModeGroups: eModeGroups.map(eModeGroup => ({ ...eModeGroup, isIsolated: false })),
};

const LocationDisplay: React.FC = () => {
  const { search } = useLocation();

  return <div data-testid="location-search">{search}</div>;
};

describe('Markets category filter', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'eMode',
    );

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: fakePool,
      },
    }));
  });

  it('opens with the category from the url parameter applied and drops it when another tab is opened', async () => {
    const { container } = renderComponent(
      <>
        <Markets />

        <LocationDisplay />
      </>,
      { routerInitialEntries: ['/?category=bstocks'] },
    );

    await waitFor(() => expect(screen.getByText(en.markets.tabs.eMode.label)).toBeInTheDocument());

    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(screen.getByTestId('location-search')).toHaveTextContent('category=bstocks');

    fireEvent.click(screen.getByText(en.markets.tabs.eMode.label));

    await waitFor(() =>
      expect(screen.getByTestId('location-search')).not.toHaveTextContent('category'),
    );
  });
});
