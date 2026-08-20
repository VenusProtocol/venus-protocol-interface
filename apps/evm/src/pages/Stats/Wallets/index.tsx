import { useMemo, useState } from 'react';

import type { RiskDashboardWalletsRiskStatus } from 'clients/api';
import { Select } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { getAddress } from 'viem';
import { AssetMultiSelect, type AssetMultiSelectOption } from './AssetMultiSelect';
import { WALLETS_PAGE_PARAM_KEY, WalletsTable } from './WalletsTable';

export const Wallets: React.FC = () => {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage } = useUrlPagination({
    paramKey: WALLETS_PAGE_PARAM_KEY,
  });

  const [riskStatus, setRiskStatus] = useState<RiskDashboardWalletsRiskStatus | ''>('');
  const [marketAddresses, setMarketAddresses] = useState<string[]>([]);
  const [suppliedMarketAddresses, setSuppliedMarketAddresses] = useState<string[]>([]);
  const [borrowedMarketAddresses, setBorrowedMarketAddresses] = useState<string[]>([]);

  const vTokens = useGetVTokens();
  const assetOptions = useMemo<AssetMultiSelectOption[]>(
    () =>
      vTokens
        .map(vToken => ({
          value: getAddress(vToken.address),
          label: vToken.underlyingToken.symbol,
          iconSrc: vToken.underlyingToken.iconSrc,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [vTokens],
  );

  const handleRiskStatusChange = (value: string | number) => {
    if (
      value === '' ||
      value === 'at_risk' ||
      value === 'eligible_for_liquidation' ||
      value === 'bad_debt'
    ) {
      setRiskStatus(value);
      setCurrentPage(0);
    }
  };

  const handleMarketChange = (values: string[]) => {
    setMarketAddresses(values);
    setCurrentPage(0);
  };

  const handleSuppliedChange = (values: string[]) => {
    setSuppliedMarketAddresses(values);
    setCurrentPage(0);
  };

  const handleBorrowedChange = (values: string[]) => {
    setBorrowedMarketAddresses(values);
    setCurrentPage(0);
  };

  const riskStatusOptions: { value: RiskDashboardWalletsRiskStatus | ''; label: string }[] = [
    { value: '', label: t('statsPage.walletsTable.riskStatus.all') },
    { value: 'at_risk', label: t('statsPage.walletsTable.riskStatus.atRisk') },
    {
      value: 'eligible_for_liquidation',
      label: t('statsPage.walletsTable.riskStatus.eligibleForLiquidation'),
    },
    { value: 'bad_debt', label: t('statsPage.walletsTable.riskStatus.badDebt') },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label={t('statsPage.walletsTable.filters.riskStatus')}
          value={riskStatus}
          options={riskStatusOptions}
          onChange={handleRiskStatusChange}
        />

        <AssetMultiSelect
          label={t('statsPage.walletsTable.filters.market')}
          options={assetOptions}
          selectedValues={marketAddresses}
          onChange={handleMarketChange}
        />

        <AssetMultiSelect
          label={t('statsPage.walletsTable.filters.suppliedAssets')}
          options={assetOptions}
          selectedValues={suppliedMarketAddresses}
          onChange={handleSuppliedChange}
        />

        <AssetMultiSelect
          label={t('statsPage.walletsTable.filters.borrowedAssets')}
          options={assetOptions}
          selectedValues={borrowedMarketAddresses}
          onChange={handleBorrowedChange}
        />
      </div>

      <WalletsTable
        riskStatus={riskStatus === '' ? undefined : riskStatus}
        marketAddresses={marketAddresses}
        suppliedMarketAddresses={suppliedMarketAddresses}
        borrowedMarketAddresses={borrowedMarketAddresses}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
