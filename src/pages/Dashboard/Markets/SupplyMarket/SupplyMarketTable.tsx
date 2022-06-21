/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatTokensToReadableValue, formatToReadablePercentage } from 'utilities';
import { Asset } from 'types';
import { Table, TableProps, Token, Toggle } from 'components';
import { useTranslation } from 'translation';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles } from './styles';

export interface ISupplyMarketTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  rowOnClick: (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => void;
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
      { key: 'asset', label: t('markets.columns.asset'), orderable: false, align: 'left' },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true, align: 'right' },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true, align: 'right' },
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
  const rows: TableProps['data'] = assets.map(asset => {
    const supplyApy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;

    return [
      {
        key: 'asset',
        render: () => <Token tokenId={asset.id} />,
        value: asset.id,
        align: 'left',
      },
      {
        key: 'apy',
        render: () => formatToReadablePercentage(supplyApy),
        value: supplyApy.toNumber(),
        align: 'right',
      },
      {
        key: 'wallet',
        render: () =>
          formatTokensToReadableValue({
            value: asset.walletBalance,
            tokenId: asset.id,
            minimizeDecimals: true,
          }),
        value: asset.walletBalance.toFixed(),
        align: 'right',
      },
      {
        key: 'collateral',
        render: () =>
          asset.collateralFactor.toNumber() || asset.collateral ? (
            <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
          ) : (
            PLACEHOLDER_KEY
          ),
        value: asset.collateral,
        align: 'right',
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
