/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCoinsToReadableValue, formatApy } from 'utilities/common';
import { Asset, TokenId } from 'types';
import { switchAriaLabel, Token, Toggle } from 'components';
import { Table, ITableProps } from 'components/v2/Table';
import { useTranslation } from 'translation';

export interface ISupplyMarketTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  setSelectedAsset: (asset: Asset | undefined) => void;
  collateralOnChange: (asset: Asset) => void;
}

export const SupplyMarketTable: React.FC<ISupplyMarketTableUiProps> = ({
  assets,
  isXvsEnabled,
  collateralOnChange,
  setSelectedAsset,
}) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true },
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
      key: 'apy',
      render: () => {
        const apy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        return formatApy(apy);
      },
      value: asset.supplyApy.toString(),
    },
    {
      key: 'wallet',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.walletBalance,
          tokenId: asset.symbol as TokenId,
          shorthand: true,
        }),
      value: asset.walletBalance.toString(),
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
      title={t('markets.supplyMarketTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'asc',
      }}
      rowOnClick={rowOnClick}
      rowKeyIndex={0}
      gridTemplateColumns="120px 1fr 1fr 1fr"
    />
  );
};

export default SupplyMarketTable;
