import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useGetSpokePools } from 'clients/api';
import { type CellProps, MultiSelect, Page, PageStatHeader, Spinner } from 'components';
import { Controls } from 'containers/Controls';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { SpokeAsset } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { NoResults } from './NoResults';
import { SpokePoolCard } from './SpokePoolCard';
import { useFilters } from './useFilters';

const multiSelectClassName = 'sm:flex-1/3 sm:min-w-45 xl:flex-none';

const SpokePools: React.FC = () => {
  const { t } = useTranslation();
  const [userChainSettings] = useUserChainSettings();
  const [searchValue, setSearchValue] = useState('');
  const { accountAddress } = useAccountAddress();
  const { data: getSpokePoolsData, isLoading: isGetSpokePoolsLoading } = useGetSpokePools({
    accountAddress,
  });
  const spokePools = getSpokePoolsData?.spokePools ?? [];

  const {
    loanAssets: selectedLoanAssets,
    loanAssetOptions,
    setLoanAssets,
    collaterals: selectedCollaterals,
    collateralOptions,
    setCollaterals,
    pools: selectedPools,
    poolOptions,
    setPools,
    reset: resetFilters,
  } = useFilters({ spokePools });

  const handleResetAll = () => {
    resetFilters();
    setSearchValue('');
  };

  // Collateral in a spoke pool is not borrowable, so its cash is not available liquidity
  const { totalBorrowCents, availableLiquidityCents } = spokePools.reduce(
    (acc, spokePool) => {
      const poolLoanAssets = spokePool.assets.filter(({ isBorrowable }) => isBorrowable);

      return {
        totalBorrowCents: acc.totalBorrowCents.plus(
          poolLoanAssets.reduce(
            (assetAcc, asset) => assetAcc.plus(asset.borrowBalanceCents),
            new BigNumber(0),
          ),
        ),
        availableLiquidityCents: acc.availableLiquidityCents.plus(
          poolLoanAssets.reduce(
            (assetAcc, asset) => assetAcc.plus(asset.liquidityCents),
            new BigNumber(0),
          ),
        ),
      };
    },
    { totalBorrowCents: new BigNumber(0), availableLiquidityCents: new BigNumber(0) },
  );

  const cells: CellProps[] = [
    {
      label: t('spokePools.stats.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
    {
      label: t('spokePools.stats.availableLiquidity'),
      value: formatCentsToReadableValue({ value: availableLiquidityCents }),
    },
    {
      label: t('spokePools.stats.pools'),
      value: spokePools.length,
    },
  ];

  const matchesSearch = (asset: SpokeAsset) =>
    asset.vToken.underlyingToken.symbol.toLowerCase().includes(searchValue.toLowerCase());

  const isVisible = (asset: SpokeAsset) => userChainSettings.showPausedAssets || !asset.isInactive;

  // An empty group means no constraint: values are OR-ed within a group, and groups are
  // AND-ed together
  const filteredSpokePools = spokePools
    .map(spokePool => {
      const visibleAssets = spokePool.assets.filter(isVisible);
      const loanAssets = visibleAssets.filter(asset => asset.isBorrowable);
      const collaterals = visibleAssets.filter(asset => !asset.isBorrowable);

      return { spokePool, visibleAssets, loanAssets, collaterals };
    })
    .filter(({ spokePool, visibleAssets, loanAssets, collaterals }) => {
      if (selectedPools.length > 0 && !selectedPools.includes(spokePool.name)) {
        return false;
      }

      if (
        selectedCollaterals.length > 0 &&
        !collaterals.some(asset =>
          selectedCollaterals.includes(asset.vToken.underlyingToken.symbol),
        )
      ) {
        return false;
      }

      if (
        userChainSettings.showUserAssetsOnly &&
        !visibleAssets.some(
          asset =>
            asset.userSupplyBalanceTokens.isGreaterThan(0) ||
            asset.userBorrowBalanceTokens.isGreaterThan(0) ||
            asset.userWalletBalanceTokens.isGreaterThan(0),
        )
      ) {
        return false;
      }

      return loanAssets.length > 0;
    })
    .map(({ spokePool, loanAssets, collaterals }) => ({
      spokePool,
      collaterals,
      loanAssets: loanAssets.filter(asset => {
        if (
          selectedLoanAssets.length > 0 &&
          !selectedLoanAssets.includes(asset.vToken.underlyingToken.symbol)
        ) {
          return false;
        }

        return (
          !searchValue ||
          matchesSearch(asset) ||
          collaterals.some(collateral => matchesSearch(collateral))
        );
      }),
    }))
    .filter(({ loanAssets }) => loanAssets.length > 0);

  const filters = (
    <div className="grid grid-cols-2 sm:flex gap-3 w-full xl:w-fit">
      <MultiSelect
        className={multiSelectClassName}
        options={loanAssetOptions}
        value={selectedLoanAssets}
        onChange={setLoanAssets}
        placeholder={t('spokePools.filter.allLoanAssets')}
        renderCount={count => t('spokePools.filter.nLoanAssets', { count })}
        title={t('spokePools.filter.selectLoanAssets')}
        resetLabel={t('spokePools.filter.reset')}
      />

      <MultiSelect
        className={multiSelectClassName}
        options={collateralOptions}
        value={selectedCollaterals}
        onChange={setCollaterals}
        placeholder={t('spokePools.filter.allCollaterals')}
        renderCount={count => t('spokePools.filter.nCollaterals', { count })}
        title={t('spokePools.filter.selectCollaterals')}
        resetLabel={t('spokePools.filter.reset')}
      />

      <MultiSelect
        className={multiSelectClassName}
        options={poolOptions}
        value={selectedPools}
        onChange={setPools}
        placeholder={t('spokePools.filter.allPools')}
        renderCount={count => t('spokePools.filter.nPools', { count })}
        title={t('spokePools.filter.selectPools')}
        resetLabel={t('spokePools.filter.reset')}
      />
    </div>
  );

  let poolsDom: React.ReactNode = filteredSpokePools.map(
    ({ spokePool, loanAssets, collaterals }) => (
      <SpokePoolCard
        key={spokePool.comptrollerAddress}
        spokePool={spokePool}
        loanAssets={loanAssets}
        collaterals={collaterals}
      />
    ),
  );

  if (isGetSpokePoolsLoading) {
    poolsDom = <Spinner />;
  } else if (filteredSpokePools.length === 0) {
    poolsDom = <NoResults onReset={handleResetAll} />;
  }

  return (
    <Page>
      <div className="space-y-5 sm:space-y-12">
        <PageStatHeader
          title={t('spokePools.header')}
          description={t('spokePools.description')}
          cells={cells}
        />

        <div className="space-y-6">
          <Controls
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            searchInputPlaceholder={t('spokePools.filter.searchPlaceholder')}
            showPausedAssetsToggle
            filters={filters}
          />

          {poolsDom}
        </div>
      </div>
    </Page>
  );
};

export default SpokePools;
