/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import {
  formatTokensToReadableValue,
  formatToReadablePercentage,
  formatCentsToReadableValue,
} from 'utilities';
import { Asset } from 'types';
import { Table, TableProps, Token, Toggle, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from './styles';
import { useStyles as useSharedStyles } from '../styles';

export interface ISuppliedTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  rowOnClick: (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => void;
  collateralOnChange: (asset: Asset) => void;
}

export const SuppliedTable: React.FC<ISuppliedTableUiProps> = ({
  assets,
  isXvsEnabled,
  collateralOnChange,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const sharedStyles = useSharedStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false, align: 'left' },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true, align: 'right' },
      { key: 'balance', label: t('markets.columns.balance'), orderable: true, align: 'right' },
      {
        key: 'collateral',
        label: t('markets.columns.collateral'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token tokenId={asset.id} />,
      value: asset.id,
      align: 'left',
    },
    {
      key: 'apy',
      render: () => {
        const apy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        return formatToReadablePercentage(apy);
      },
      value: asset.supplyApy.toFixed(),
      align: 'right',
    },
    {
      key: 'balance',
      render: () => (
        <LayeredValues
          topValue={formatCentsToReadableValue({
            value: asset.supplyBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
          })}
          bottomValue={formatTokensToReadableValue({
            value: asset.supplyBalance,
            tokenId: asset.id,
            minimizeDecimals: true,
          })}
        />
      ),
      value: asset.supplyBalance.toFixed(),
      align: 'right',
    },
    {
      key: 'collateral',
      render: () =>
        asset.collateralFactor.toNumber() ? (
          <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
        ) : (
          PLACEHOLDER_KEY
        ),
      value: asset.collateral,
      align: 'right',
    },
  ]);

  return (
    <Table
      title={t('markets.suppliedTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowOnClick={rowOnClick}
      rowKeyIndex={0}
      tableCss={sharedStyles.table}
      cardsCss={sharedStyles.cards}
      css={[sharedStyles.marketTable, styles.cardContentGrid]}
    />
  );
};

export default SuppliedTable;
