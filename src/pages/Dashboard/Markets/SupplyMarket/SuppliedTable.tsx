/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import {
  formatCoinsToReadableValue,
  formatToReadablePercentage,
  formatCentsToReadableValue,
} from 'utilities/common';
import { Asset, TokenId } from 'types';
import { Table, ITableProps, Token, Toggle, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { useIsSmDown, useIsLgDown } from 'hooks/responsive';
import { useStyles } from './styles';

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
  const isSmDown = useIsSmDown();
  const isLgDown = useIsLgDown();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
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
      key: 'apy',
      render: () => {
        const apy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        return formatToReadablePercentage(apy);
      },
      value: asset.supplyApy.toFixed(),
    },
    {
      key: 'balance',
      render: () => (
        <LayeredValues
          topValue={formatCentsToReadableValue({
            value: asset.supplyBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
          })}
          bottomValue={formatCoinsToReadableValue({
            value: asset.supplyBalance,
            tokenId: asset.id as TokenId,
            shorthand: true,
          })}
        />
      ),
      value: asset.supplyBalance.toFixed(),
    },
    {
      key: 'collateral',
      value: asset.collateral,
      render: () =>
        asset.collateralFactor.toNumber() ? (
          <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
        ) : (
          PLACEHOLDER_KEY
        ),
    },
  ]);

  return (
    <Table
      title={isLgDown && !isSmDown ? undefined : t('markets.suppliedTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowOnClick={rowOnClick}
      rowKeyIndex={0}
      gridTemplateColumns={styles.getGridTemplateColumns({ isCardLayout: isSmDown })}
    />
  );
};

export default SuppliedTable;
