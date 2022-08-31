/** @jsxImportSource @emotion/react */
import { Table, TableCardRowOnClickProps, TableRowProps } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import generateRow from './generateRow';
import { useStyles } from './styles';
import { ColumnName } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columns.asset')
// t('marketTable.columns.supplyApyLtv')
// t('marketTable.columns.borrowApy')
// t('marketTable.columns.market')
// t('marketTable.columns.riskLevel')
// t('marketTable.columns.collateral')
// t('marketTable.columns.walletBalance')
// t('marketTable.columns.liquidity')

export interface MarketTableProps
  extends Partial<Omit<TableCardRowOnClickProps, 'columns' | 'rowKeyIndex' | 'breakpoint'>>,
    Pick<TableCardRowOnClickProps, 'breakpoint'> {
  assets: Asset[];
  isXvsEnabled: boolean;
  marketType: 'supply' | 'borrow';
  columns: ColumnName[];
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  marketType,
  isXvsEnabled,
  columns,
  ...otherTableProps
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const rowKeyExtractor = (row: TableRowProps[]) => {
    // Generate key using data that's unique to the row (asset and market)
    let key = `${row.find(cell => cell.key === 'asset')?.value || ''}`;

    const marketCell = row.find(cell => cell.key === 'market');
    if (marketCell) {
      key += `-${marketCell.value}`;
    }

    return key;
  };

  const headColumns = useMemo(
    () =>
      columns.map((column, index) => ({
        key: column,
        label: t(`marketTable.columns.${column}`),
        orderable: true,
        align: index === 0 ? 'left' : 'right',
      })),
    [JSON.stringify(columns)],
  );

  // Format assets to rows
  const data: TableCardRowOnClickProps['data'] = useMemo(
    () =>
      assets.map(asset =>
        generateRow({
          asset,
          isXvsEnabled,
          columns,
          // TODO: render collateral modal and pass function to generateRow to
          // enable/disable asset as collateral
          collateralOnChange: () => {},
          marketLinkCss: styles.marketLink,
        }),
      ),
    [JSON.stringify(assets), JSON.stringify(columns)],
  );

  // TODO: add row on click function to open supply or borrow modal

  // TODO: handle responsiveness

  return (
    <Table
      columns={headColumns}
      data={data}
      css={styles.cardContentGrid}
      rowKeyExtractor={rowKeyExtractor}
      {...otherTableProps}
    />
  );
};
