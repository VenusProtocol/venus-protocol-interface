/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCoinsToReadableValue, formatApy } from 'utilities/common';
import { Asset, TokenId } from 'types';
import { switchAriaLabel, Token, Toggle } from 'components';
import { Table, ITableProps } from 'components/v2/Table';
import { useTranslation } from 'translation';

export interface ISuppliedTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  setSelectedAsset: (asset: Asset | undefined) => void;
  collateralOnChange: (asset: Asset) => void;
}

export const SuppliedTable: React.FC<ISuppliedTableUiProps> = ({
  assets,
  isXvsEnabled,
  collateralOnChange,
  setSelectedAsset,
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
        return formatApy(apy);
      },
      value: asset.supplyApy.toString(),
    },
    {
      key: 'balance',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.supplyBalance,
          tokenId: asset.symbol as TokenId,
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
  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => {
    if ((e.target as HTMLElement).ariaLabel !== switchAriaLabel) {
      const asset = assets.find((value: Asset) => value.id === row[0].value);
      if (asset) {
        setSelectedAsset(asset);
      }
    }
  };
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
    />
  );
};

export default SuppliedTable;
