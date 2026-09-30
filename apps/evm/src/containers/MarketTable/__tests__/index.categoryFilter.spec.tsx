import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Asset, MarketCategory } from 'types';

import { MarketTable } from '../index';
import type { ColumnKey } from '../types';

vi.mock('hooks/useCollateral');

const columns: ColumnKey[] = ['asset', 'supplyApy', 'borrowApy'];

const bStocksCategory: MarketCategory = { tag: 'bstocks', label: 'bStocks', order: 0 };
const stablecoinsCategory: MarketCategory = { tag: 'stablecoins', label: 'Stablecoins', order: 1 };

// None of the assets is paused, so every one of them is rendered unless the category
// filter removes it. The first is the only one in the bStocks category, so a working
// filter leaves exactly one row behind
const [bStocksAsset, ...stablecoinAssets] = poolData[0].assets.map(asset => ({
  ...asset,
  disabledTokenActions: [],
}));

const assets: Asset[] = [
  { ...bStocksAsset, category: bStocksCategory.tag, marketCategory: bStocksCategory },
  ...stablecoinAssets.map(asset => ({
    ...asset,
    category: stablecoinsCategory.tag,
    marketCategory: stablecoinsCategory,
  })),
];

const allSymbols = assets.map(asset => asset.vToken.underlyingToken.symbol);
const bStocksAssetSymbol = bStocksAsset.vToken.underlyingToken.symbol;

const LocationDisplay: React.FC = () => {
  const { search } = useLocation();

  return <div data-testid="location-search">{search}</div>;
};

// An open dropdown renders its options in both the desktop menu and the mobile modal. The
// trigger is always the first button carrying the label, the modal copy of an option the last
const getFilterTrigger = (label: string) => screen.getAllByRole('button', { name: label })[0];
const getFilterOption = (label: string) =>
  screen.getAllByRole('button', { name: label }).slice(-1)[0];

const renderMarketTable = ({
  categoryFilter = true,
  routerInitialEntries,
  assets: customAssets = assets,
}: {
  categoryFilter?: boolean;
  routerInitialEntries?: string[];
  assets?: Asset[];
} = {}) =>
  renderComponent(
    <>
      <MarketTable
        assets={customAssets}
        categoryFilter={categoryFilter}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />

      <LocationDisplay />
    </>,
    { routerInitialEntries },
  );

const getRenderedSymbols = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr')).map(
    row => row.querySelector('td')?.textContent?.trim() ?? '',
  );

describe('MarketTable category filter', () => {
  beforeEach(() => {
    (useUserChainSettings as Mock).mockReturnValue([defaultUserChainSettings, vi.fn()]);
  });

  it('applies no filter and leaves the url alone when no category parameter is given', () => {
    const { container } = renderMarketTable();

    expect(getRenderedSymbols(container)).toEqual(allSymbols);
    expect(screen.getByTestId('location-search')).not.toHaveTextContent('category');
  });

  it('applies the category from the url parameter', () => {
    const { container } = renderMarketTable({ routerInitialEntries: ['/?category=bstocks'] });

    expect(getRenderedSymbols(container)).toEqual([bStocksAssetSymbol]);
  });

  it('applies the category from the url parameter regardless of its case, and rewrites the parameter to the spelling the filter uses', async () => {
    const { container } = renderMarketTable({ routerInitialEntries: ['/?category=bStocks'] });

    expect(getRenderedSymbols(container)).toEqual([bStocksAssetSymbol]);

    await waitFor(() =>
      expect(screen.getByTestId('location-search')).toHaveTextContent('category=bstocks'),
    );
  });

  it('applies every category listed in the url parameter', () => {
    const { container } = renderMarketTable({
      routerInitialEntries: ['/?category=bstocks,stablecoins'],
    });

    expect(getRenderedSymbols(container)).toEqual(allSymbols);
  });

  it('applies no filter for a category the pool does not have, and removes it from the url', async () => {
    const { container } = renderMarketTable({ routerInitialEntries: ['/?category=unknown'] });

    expect(getRenderedSymbols(container)).toEqual(allSymbols);
    expect(getFilterTrigger(en.controls.categoryFilter.allCategories)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId('location-search')).not.toHaveTextContent('category'),
    );
  });

  it('keeps the categories the pool does have when the url parameter also lists unknown ones', async () => {
    const { container } = renderMarketTable({
      routerInitialEntries: ['/?category=unknown,bstocks'],
    });

    expect(getRenderedSymbols(container)).toEqual([bStocksAssetSymbol]);

    await waitFor(() =>
      expect(screen.getByTestId('location-search')).toHaveTextContent('category=bstocks'),
    );
  });

  it('leaves the url parameter alone when the category filter is disabled', () => {
    const { container } = renderMarketTable({
      categoryFilter: false,
      routerInitialEntries: ['/?category=bstocks'],
    });

    expect(getRenderedSymbols(container)).toEqual(allSymbols);
    expect(
      screen.queryByRole('button', { name: en.controls.categoryFilter.allCategories }),
    ).toBeNull();
    expect(screen.getByTestId('location-search')).toHaveTextContent('category=bstocks');
  });

  it('applies no filter and removes the parameter when the pool has a single category, since no control is rendered to undo it', async () => {
    const singleCategoryAssets = assets.map(asset => ({
      ...asset,
      category: bStocksCategory.tag,
      marketCategory: bStocksCategory,
    }));

    const { container } = renderMarketTable({
      assets: singleCategoryAssets,
      routerInitialEntries: ['/?category=bstocks'],
    });

    expect(getRenderedSymbols(container)).toEqual(allSymbols);
    expect(
      screen.queryByRole('button', { name: en.controls.categoryFilter.allCategories }),
    ).toBeNull();

    await waitFor(() =>
      expect(screen.getByTestId('location-search')).not.toHaveTextContent('category'),
    );
  });

  it('applies no filter and removes the parameter when the pool has no categories at all', async () => {
    const uncategorizedAssets = assets.map(asset => ({
      ...asset,
      category: undefined,
      marketCategory: undefined,
    }));

    const { container } = renderMarketTable({
      assets: uncategorizedAssets,
      routerInitialEntries: ['/?category=bstocks'],
    });

    expect(getRenderedSymbols(container)).toEqual(allSymbols);

    await waitFor(() =>
      expect(screen.getByTestId('location-search')).not.toHaveTextContent('category'),
    );
  });

  it('keeps the other url parameters when a category is selected', () => {
    renderMarketTable({ routerInitialEntries: ['/?tab=markets'] });

    fireEvent.click(getFilterTrigger(en.controls.categoryFilter.allCategories));
    fireEvent.click(getFilterOption(bStocksCategory.label));

    expect(screen.getByTestId('location-search')).toHaveTextContent('tab=markets');
    expect(screen.getByTestId('location-search')).toHaveTextContent('category=bstocks');
  });

  it('writes the selected category to the url and removes it again when unselected', () => {
    const { container } = renderMarketTable();

    fireEvent.click(getFilterTrigger(en.controls.categoryFilter.allCategories));
    fireEvent.click(getFilterOption(bStocksCategory.label));

    expect(screen.getByTestId('location-search')).toHaveTextContent('category=bstocks');
    expect(getRenderedSymbols(container)).toEqual([bStocksAssetSymbol]);

    fireEvent.click(getFilterOption(bStocksCategory.label));

    expect(screen.getByTestId('location-search')).not.toHaveTextContent('category');
    expect(getRenderedSymbols(container)).toEqual(allSymbols);
  });
});
