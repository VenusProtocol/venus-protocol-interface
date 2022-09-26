/** @jsxImportSource @emotion/react */
import { Select, TableRowProps } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';

import { routes } from 'constants/routing';
import { MarketTable } from 'containers/MarketTable';
import { useShowMdDownCss } from 'hooks/responsive';

import { useStyles } from './styles';

export interface TableProps {
  pool: Pool;
}

export const Table: React.FC<TableProps> = ({ pool }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const showMdDownCss = useShowMdDownCss();

  const getRowHref = (row: TableRowProps[]) =>
    routes.market.path.replace(':poolId', pool.id).replace(':vTokenId', `${row[0].value}`);

  // TODO: add all options
  const mobileSelectOptions = [
    {
      value: 'liquidity',
      label: 'Liquidity',
    },
  ];

  return (
    <>
      {/* TODO: add logic to sort table on mobile */}
      <Select
        css={[styles.mobileSelect, showMdDownCss]}
        label={t('market.tables.mobileSelect.label')}
        title={t('market.tables.mobileSelect.title')}
        // TODO: wire up
        value={mobileSelectOptions[0].value}
        onChange={console.log}
        options={mobileSelectOptions}
        ariaLabel={t('market.tables.mobileSelect.ariaLabelFor')}
      />

      <MarketTable
        getRowHref={getRowHref}
        assets={pool.assets}
        breakpoint="xl"
        columns={[
          'asset',
          'treasuryTotalSupply',
          'labeledSupplyApyLtv',
          'treasuryTotalBorrow',
          'labeledBorrowApy',
          'liquidity',
        ]}
        initialOrder={{
          orderBy: 'liquidity',
          orderDirection: 'desc',
        }}
      />
    </>
  );
};

export default Table;
