/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCoinsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { Asset, TokenId } from 'types';
import { Table, ITableProps, Token, Toggle } from 'components';
import { useTranslation } from 'translation';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles } from './styles';

export interface ISupplyMarketTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  rowOnClick: (e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => void;
  collateralOnChange: (asset: Asset) => void;
}

export const SupplyMarketTable: React.FC<ISupplyMarketTableUiProps> = ({
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
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true },
      { key: 'collateral', label: t('markets.columns.collateral'), orderable: true },
    ],
    [],
  );

  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => {
    const supplyApy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;

    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.symbol as TokenId} />,
        value: asset.id,
      },
      {
        key: 'apy',
        render: () => formatToReadablePercentage(supplyApy),
        value: supplyApy.toNumber(),
      },
      {
        key: 'wallet',
        render: () =>
          formatCoinsToReadableValue({
            value: asset.walletBalance,
            tokenId: asset.symbol as TokenId,
            shorthand: true,
          }),
        value: asset.walletBalance.toFixed(),
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
    ];
  });

  return (
    <Table
      title={t('markets.supplyMarketTableTitle')}
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
      css={[sharedStyles.marketTable, sharedStyles.generalMarketTable, styles.cardContentGrid]}
    />
  );
};

export default SupplyMarketTable;
