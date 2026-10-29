import type { MultiSelectOption } from 'components';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';
import type { LiteBorrowMarket, LiteEarnAsset } from '../types';
import { useBorrowAssets } from '../useBorrowAssets';
import type { useEarnAssets } from '../useEarnAssets';
import type { useLiteNavigation } from '../useLiteNavigation';
import { BorrowAssetTable } from './BorrowAssetTable';
import { BorrowMarketTable } from './BorrowMarketTable';
import { Breadcrumb } from './Breadcrumb';
import { EarnAssetTable } from './EarnAssetTable';
import { EarnMarketTable } from './EarnMarketTable';
import { Filters } from './Filters';
import { MarketFormModal } from './MarketFormModal';
import { type MarketMode, ModeSwitch } from './ModeSwitch';
import { matchesCategories } from './matchesCategories';

export interface MarketExplorerProps {
  earnAssets: LiteEarnAsset[];
  categories: ReturnType<typeof useEarnAssets>['categories'];
  isEarnLoading: boolean;
  isEarnReady: boolean;
  navigation: ReturnType<typeof useLiteNavigation>;
}

export const MarketExplorer: React.FC<MarketExplorerProps> = ({
  earnAssets,
  categories,
  isEarnLoading,
  isEarnReady,
  navigation,
}) => {
  const { mode, assetSymbol, marketId, setMode, selectAsset, selectMarket } = navigation;
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLoanTokens, setSelectedLoanTokens] = useState<string[]>([]);
  const [selectedCollateral, setSelectedCollateral] = useState<{
    market: LiteBorrowMarket;
    token: Token;
  }>();

  const { borrowAssets, isLoading: isBorrowLoading, isReady: isBorrowReady } = useBorrowAssets();

  // One source skips the list and opens its form
  const getOnlyMarket = <TMarket,>(markets: TMarket[]) =>
    markets.length === 1 ? markets[0] : undefined;

  const selectedEarnAsset =
    mode === 'earn'
      ? earnAssets.find(earnAsset => earnAsset.token.symbol === assetSymbol)
      : undefined;
  const selectedEarnMarket =
    selectedEarnAsset?.markets.find(market => market.id === marketId) ??
    getOnlyMarket(selectedEarnAsset?.markets ?? []);
  const selectedBorrowAsset =
    mode === 'borrow'
      ? borrowAssets.find(borrowAsset => borrowAsset.token.symbol === assetSymbol)
      : undefined;
  const selectedBorrowMarket =
    selectedBorrowAsset?.markets.find(market => market.id === marketId) ??
    getOnlyMarket(selectedBorrowAsset?.markets ?? []);
  const hasSingleMarket = (selectedAssetMarketCount: number) => selectedAssetMarketCount === 1;

  const modeLabel = mode === 'earn' ? t('lite.modes.earn') : t('lite.modes.borrow');
  const selectedMarket = mode === 'earn' ? selectedEarnMarket : selectedBorrowMarket;
  const selectedAsset = mode === 'earn' ? selectedEarnAsset : selectedBorrowAsset;

  const clearSelectedMarket = () =>
    hasSingleMarket(selectedAsset?.markets.length ?? 0)
      ? selectAsset(undefined)
      : selectMarket(undefined);

  const backToAssets = () => selectAsset(undefined);

  const changeMode = (newMode: MarketMode) => {
    setMode(newMode);
    setSearchValue('');
  };

  const categoryOptions: MultiSelectOption[] = categories.map(category => ({
    value: category.tag,
    label: category.label,
  }));

  const loanTokenOptions: MultiSelectOption[] = borrowAssets.map(borrowAsset => ({
    value: borrowAsset.key,
    label: borrowAsset.token.symbol,
  }));

  const visibleEarnAssets = earnAssets.filter(
    earnAsset =>
      matchesCategories({ earnAsset, selectedCategories }) &&
      earnAsset.token.symbol.toLowerCase().includes(searchValue.trim().toLowerCase()),
  );

  const visibleBorrowAssets = borrowAssets.filter(
    borrowAsset =>
      (selectedLoanTokens.length === 0 || selectedLoanTokens.includes(borrowAsset.key)) &&
      borrowAsset.token.symbol.toLowerCase().includes(searchValue.trim().toLowerCase()),
  );

  const filters =
    mode === 'earn' ? (
      <Filters
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        searchPlaceholder={t('lite.filters.searchAsset')}
        searchAriaLabel={t('lite.filters.searchAssetAriaLabel')}
        options={categoryOptions}
        selectedValues={selectedCategories}
        onSelectedValuesChange={setSelectedCategories}
        optionsPlaceholder={t('lite.filters.allCategories')}
        optionsTitle={t('lite.filters.category')}
        renderOptionCount={count => t('lite.filters.categoryCount', { count })}
      />
    ) : (
      <Filters
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        searchPlaceholder={t('lite.filters.searchAsset')}
        searchAriaLabel={t('lite.filters.searchAssetAriaLabel')}
        options={loanTokenOptions}
        selectedValues={selectedLoanTokens}
        onSelectedValuesChange={setSelectedLoanTokens}
        optionsPlaceholder={t('lite.filters.allLoanAssets')}
        optionsTitle={t('lite.filters.loanAssets')}
        renderOptionCount={count => t('lite.filters.loanAssetCount', { count })}
      />
    );

  const modeSwitch = <ModeSwitch mode={mode} onChange={changeMode} />;

  const collateralSource = selectedCollateral?.market.source;
  const collateralAsset =
    collateralSource?.type === 'spoke'
      ? collateralSource.pool.assets.find(
          poolAsset =>
            poolAsset.vToken.underlyingToken.address === selectedCollateral?.token.address,
        )
      : undefined;

  const collateralModal =
    collateralSource?.type === 'spoke' && collateralAsset ? (
      <SpokeFormModal
        title={t('spokeForm.collateralModalTitle', { poolName: collateralSource.pool.name })}
        spokePool={collateralSource.pool}
        asset={collateralSource.asset}
        collateralOnly
        initialActiveTabId="collateral"
        preselectedCollateral={collateralAsset}
        handleClose={() => setSelectedCollateral(undefined)}
      />
    ) : undefined;

  const header = selectedAsset ? (
    <div className="flex items-center justify-between gap-3">
      <Breadcrumb modeLabel={modeLabel} token={selectedAsset.token} onBackToAssets={backToAssets} />
      {modeSwitch}
    </div>
  ) : (
    <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
      {modeSwitch}
      {filters}
    </div>
  );

  return (
    <section
      aria-label={modeLabel}
      className="lite-panel lite-enter lite-enter--markets flex min-h-0 flex-col overflow-hidden"
    >
      {mode === 'earn' && !selectedEarnAsset && (
        <EarnAssetTable
          earnAssets={visibleEarnAssets}
          isFetching={isEarnLoading}
          isReady={isEarnReady}
          onSelect={earnAsset => selectAsset(earnAsset.token.symbol)}
          header={header}
        />
      )}

      {mode === 'earn' && selectedEarnAsset && (
        <EarnMarketTable
          earnAsset={selectedEarnAsset}
          onSelect={market => selectMarket(market.id)}
          header={header}
        />
      )}

      {mode === 'borrow' && !selectedBorrowAsset && (
        <BorrowAssetTable
          borrowAssets={visibleBorrowAssets}
          isFetching={isBorrowLoading}
          isReady={isBorrowReady}
          onSelect={borrowAsset => selectAsset(borrowAsset.token.symbol)}
          header={header}
        />
      )}

      {mode === 'borrow' && selectedBorrowAsset && (
        <BorrowMarketTable
          borrowAsset={selectedBorrowAsset}
          onSelect={market => selectMarket(market.id)}
          onSelectCollateral={setSelectedCollateral}
          header={header}
        />
      )}

      {collateralModal}

      {selectedMarket && selectedAsset && (
        <MarketFormModal mode={mode} market={selectedMarket} onClose={clearSelectedMarket} />
      )}
    </section>
  );
};
