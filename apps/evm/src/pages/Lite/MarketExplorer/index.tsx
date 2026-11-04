import { ButtonGroup, type MultiSelectOption } from 'components';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { useIsSmDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { SpokeAsset } from 'types';
import { getMarketSlug } from '../getMarketSlug';
import type { LiteBorrowMarket, LiteEarnAsset, MarketMode } from '../types';
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
  const { mode, assetSymbol, marketSlug, setMode, selectAsset, selectMarket } = navigation;
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollateral, setSelectedCollateral] = useState<{
    market: LiteBorrowMarket;
    asset: SpokeAsset;
  }>();

  const { borrowAssets, isLoading: isBorrowLoading, isReady: isBorrowReady } = useBorrowAssets();

  // One source skips the list and opens its form
  const getOnlyMarket = <TMarket,>({
    markets,
    isReady,
  }: { markets: TMarket[]; isReady: boolean }) =>
    isReady && markets.length === 1 ? markets[0] : undefined;

  const selectedEarnAsset =
    mode === 'earn'
      ? earnAssets.find(earnAsset => earnAsset.token.symbol === assetSymbol)
      : undefined;
  const selectedEarnMarket =
    selectedEarnAsset?.markets.find(market => getMarketSlug(market) === marketSlug) ??
    getOnlyMarket({ markets: selectedEarnAsset?.markets ?? [], isReady: isEarnReady });
  const selectedBorrowAsset =
    mode === 'borrow'
      ? borrowAssets.find(borrowAsset => borrowAsset.token.symbol === assetSymbol)
      : undefined;
  const selectedBorrowMarket =
    selectedBorrowAsset?.markets.find(market => getMarketSlug(market) === marketSlug) ??
    getOnlyMarket({ markets: selectedBorrowAsset?.markets ?? [], isReady: isBorrowReady });
  const hasSingleMarket = (selectedAssetMarketCount: number) => selectedAssetMarketCount === 1;

  const modeLabel = mode === 'earn' ? t('lite.modes.earn') : t('lite.modes.borrow');
  const selectedMarket = mode === 'earn' ? selectedEarnMarket : selectedBorrowMarket;
  const isSingleEarnMarket = hasSingleMarket(selectedEarnAsset?.markets.length ?? 0);
  const isSingleBorrowMarket = hasSingleMarket(selectedBorrowAsset?.markets.length ?? 0);
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

  const visibleEarnAssets = earnAssets.filter(
    earnAsset =>
      matchesCategories({ markets: earnAsset.markets, selectedCategories }) &&
      earnAsset.token.symbol.toLowerCase().includes(searchValue.trim().toLowerCase()),
  );

  const visibleBorrowAssets = borrowAssets.filter(
    borrowAsset =>
      matchesCategories({ markets: borrowAsset.markets, selectedCategories }) &&
      borrowAsset.token.symbol.toLowerCase().includes(searchValue.trim().toLowerCase()),
  );

  const filters = (
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
  );

  const modeSwitch = (
    <ButtonGroup
      ariaLabel={t('lite.modes.label')}
      buttonLabels={[t('lite.modes.earn'), t('lite.modes.borrow')]}
      activeButtonIndex={mode === 'earn' ? 0 : 1}
      onButtonClick={index => changeMode(index === 0 ? 'earn' : 'borrow')}
      fullWidth={isSmDown}
      buttonSize="sm"
      buttonClassName="sm:w-20"
    />
  );

  const collateralSource = selectedCollateral?.market.source;

  const collateralModal =
    collateralSource?.type === 'spoke' && selectedCollateral ? (
      <SpokeFormModal
        title={t('spokeForm.collateralModalTitle', { poolName: collateralSource.pool.name })}
        spokePool={collateralSource.pool}
        asset={collateralSource.asset}
        collateralOnly
        initialActiveTabId="collateral"
        preselectedCollateral={selectedCollateral.asset}
        handleClose={() => setSelectedCollateral(undefined)}
      />
    ) : undefined;

  const isSingleMarket = mode === 'earn' ? isSingleEarnMarket : isSingleBorrowMarket;

  const header =
    selectedAsset && !isSingleMarket ? (
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb
          modeLabel={modeLabel}
          token={selectedAsset.token}
          onBackToAssets={backToAssets}
        />
        {mode === 'borrow' && modeSwitch}
      </div>
    ) : (
      <div className="flex min-h-9 flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {modeSwitch}
        {filters}
      </div>
    );

  return (
    <section
      aria-label={modeLabel}
      className="lite-panel lite-enter lite-enter--markets flex min-h-0 flex-col"
    >
      {mode === 'earn' && (!selectedEarnAsset || isSingleEarnMarket) && (
        <EarnAssetTable
          earnAssets={visibleEarnAssets}
          isFetching={isEarnLoading}
          isReady={isEarnReady}
          onSelect={earnAsset => selectAsset(earnAsset.token.symbol)}
          header={header}
        />
      )}

      {mode === 'earn' && selectedEarnAsset && !isSingleEarnMarket && (
        <EarnMarketTable
          earnAsset={selectedEarnAsset}
          onSelect={market => selectMarket(getMarketSlug(market))}
          header={header}
        />
      )}

      {mode === 'borrow' && (!selectedBorrowAsset || isSingleBorrowMarket) && (
        <BorrowAssetTable
          borrowAssets={visibleBorrowAssets}
          isFetching={isBorrowLoading}
          isReady={isBorrowReady}
          onSelect={borrowAsset => selectAsset(borrowAsset.token.symbol)}
          header={header}
        />
      )}

      {mode === 'borrow' && selectedBorrowAsset && !isSingleBorrowMarket && (
        <BorrowMarketTable
          borrowAsset={selectedBorrowAsset}
          onSelect={market => selectMarket(getMarketSlug(market))}
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
