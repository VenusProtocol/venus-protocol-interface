import type { MultiSelectOption } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { LiteEarnAsset } from '../types';
import { useBorrowAssets } from '../useBorrowAssets';
import type { useEarnAssets } from '../useEarnAssets';
import { useMarketName } from '../useMarketName';
import { BorrowAssetTable } from './BorrowAssetTable';
import { BorrowMarketTable } from './BorrowMarketTable';
import { Breadcrumb } from './Breadcrumb';
import { EarnAssetTable } from './EarnAssetTable';
import { EarnMarketTable } from './EarnMarketTable';
import { Filters } from './Filters';
import { MarketForm } from './MarketForm';
import { type MarketMode, ModeSwitch } from './ModeSwitch';
import { matchesCategories } from './matchesCategories';

export interface MarketExplorerProps {
  earnAssets: LiteEarnAsset[];
  categories: ReturnType<typeof useEarnAssets>['categories'];
  isEarnLoading: boolean;
  isEarnReady: boolean;
  mode: MarketMode;
  onModeChange: (mode: MarketMode) => void;
  selectedEarnAssetKey?: string;
  onSelectEarnAssetKey: (key: string | undefined) => void;
}

export const MarketExplorer: React.FC<MarketExplorerProps> = ({
  earnAssets,
  categories,
  isEarnLoading,
  isEarnReady,
  mode,
  onModeChange,
  selectedEarnAssetKey,
  onSelectEarnAssetKey,
}) => {
  const { t } = useTranslation();
  const getMarketName = useMarketName();
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLoanTokens, setSelectedLoanTokens] = useState<string[]>([]);
  // Selections hold ids, so each render resolves them against the latest query results
  const [selectedEarnMarketId, setSelectedEarnMarketId] = useState<string>();
  const [selectedBorrowAssetKey, setSelectedBorrowAssetKey] = useState<string>();
  const [selectedBorrowMarketId, setSelectedBorrowMarketId] = useState<string>();

  const { borrowAssets, isLoading: isBorrowLoading, isReady: isBorrowReady } = useBorrowAssets();

  const selectedEarnAsset = earnAssets.find(earnAsset => earnAsset.key === selectedEarnAssetKey);
  const selectedEarnMarket = selectedEarnAsset?.markets.find(
    market => market.id === selectedEarnMarketId,
  );
  const selectedBorrowAsset = borrowAssets.find(
    borrowAsset => borrowAsset.key === selectedBorrowAssetKey,
  );
  const selectedBorrowMarket = selectedBorrowAsset?.markets.find(
    market => market.id === selectedBorrowMarketId,
  );

  const clearSelectedMarket = () => {
    setSelectedEarnMarketId(undefined);
    setSelectedBorrowMarketId(undefined);
  };

  const backToAssets = () => {
    onSelectEarnAssetKey(undefined);
    setSelectedBorrowAssetKey(undefined);
    clearSelectedMarket();
  };

  const changeMode = (newMode: MarketMode) => {
    onModeChange(newMode);
    setSearchValue('');
  };

  const modeLabel = mode === 'earn' ? t('lite.modes.earn') : t('lite.modes.borrow');
  const selectedMarket = mode === 'earn' ? selectedEarnMarket : selectedBorrowMarket;
  const selectedAsset = mode === 'earn' ? selectedEarnAsset : selectedBorrowAsset;

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

  if (selectedMarket && selectedAsset) {
    return (
      <section
        aria-label={modeLabel}
        className="lite-panel lite-enter lite-enter--markets flex min-h-0 flex-col overflow-hidden backdrop-blur-glass"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 p-4">
          <Breadcrumb
            modeLabel={modeLabel}
            token={selectedAsset.token}
            marketName={getMarketName(selectedMarket)}
            onBackToAssets={backToAssets}
            onBackToMarkets={clearSelectedMarket}
          />
        </div>

        <div className="min-h-0 grow overflow-auto px-6 pb-4">
          <div className="mx-auto w-full max-w-140">
            <MarketForm mode={mode} market={selectedMarket} onClose={clearSelectedMarket} />
          </div>
        </div>
      </section>
    );
  }

  const header = selectedAsset ? (
    <div className="flex items-center justify-between gap-3">
      <Breadcrumb modeLabel={modeLabel} token={selectedAsset.token} onBackToAssets={backToAssets} />
      {modeSwitch}
    </div>
  ) : (
    <div className="flex min-h-9 items-center justify-between gap-3">
      {modeSwitch}
      {filters}
    </div>
  );

  return (
    <section
      aria-label={modeLabel}
      className="lite-panel lite-enter lite-enter--markets flex min-h-0 flex-col overflow-hidden backdrop-blur-glass"
    >
      {mode === 'earn' && !selectedEarnAsset && (
        <EarnAssetTable
          earnAssets={visibleEarnAssets}
          isFetching={isEarnLoading}
          isReady={isEarnReady}
          onSelect={earnAsset => onSelectEarnAssetKey(earnAsset.key)}
          header={header}
        />
      )}

      {mode === 'earn' && selectedEarnAsset && (
        <EarnMarketTable
          earnAsset={selectedEarnAsset}
          onSelect={market => setSelectedEarnMarketId(market.id)}
          header={header}
        />
      )}

      {mode === 'borrow' && !selectedBorrowAsset && (
        <BorrowAssetTable
          borrowAssets={visibleBorrowAssets}
          isFetching={isBorrowLoading}
          isReady={isBorrowReady}
          onSelect={borrowAsset => setSelectedBorrowAssetKey(borrowAsset.key)}
          header={header}
        />
      )}

      {mode === 'borrow' && selectedBorrowAsset && (
        <BorrowMarketTable
          borrowAsset={selectedBorrowAsset}
          onSelect={market => setSelectedBorrowMarketId(market.id)}
          header={header}
        />
      )}
    </section>
  );
};
