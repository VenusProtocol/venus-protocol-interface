/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCoinsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { Asset, TokenId } from 'types';
import { Table, ITableProps, Token, Toggle } from 'components';
import { useTranslation } from 'translation';

export interface ISuppliedTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  rowOnClick: (e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => void;
  collateralOnChange: (asset: Asset) => void;
}

export const SuppliedTable: React.FC<ISuppliedTableUiProps> = ({
  assets,
  isXvsEnabled,
  collateralOnChange,
  rowOnClick,
}) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apyEarned', label: t('markets.columns.apyEarned'), orderable: true },
      { key: 'balance', label: t('markets.columns.balance'), orderable: true },
      { key: 'collateral', label: t('markets.columns.collateral'), orderable: true },
    ],
    [],
  );
  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token symbol={asset.symbol as TokenId} />,
      value: asset.id,
    },
    {
      key: 'apyEarned',
      render: () => {
        const apy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        return formatToReadablePercentage(apy);
      },
      value: asset.supplyApy.toString(),
    },
    {
      key: 'balance',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.supplyBalance,
          tokenId: asset.symbol as TokenId,
          shorthand: true,
        }),
      value: asset.supplyBalance.toString(),
    },
    {
      key: asset.collateral.toString(),
      value: asset.collateral,
      render: () =>
        +asset.collateralFactor.toString() ? (
          <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
        ) : (
          PLACEHOLDER_KEY
        ),
    },
  ]);
  return (
    <Table
      title={t('markets.suppliedTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apyEarned',
        orderDirection: 'asc',
      }}
      rowOnClick={rowOnClick}
      rowKeyIndex={0}
      gridTemplateColumns="120px 1fr 1fr 1fr"
    />
  );
};

export default SuppliedTable;
