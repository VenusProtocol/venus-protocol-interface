import {
  InfoIcon,
  LayeredValues,
  type Order,
  Table,
  type TableColumn,
  type TableProps,
  TokenGroup,
  TokenIconWithSymbol,
} from 'components';
import { Controls } from 'containers/Controls';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { LiquidityHub } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { RowControl } from './RowControl';

export interface LiquidityHubTableProps
  extends Omit<TableProps<LiquidityHub>, 'columns' | 'rowKeyExtractor'> {}

export const LiquidityHubTable: React.FC<LiquidityHubTableProps> = ({
  className,
  data,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();

  const [userChainSettings] = useUserChainSettings();

  const [searchValue, setSearchValue] = useState('');

  const renderRowControl = (liquidityHub: LiquidityHub) => {
    return <RowControl className="-ml-6" liquidityHub={liquidityHub} />;
  };

  const filteredData = data.filter(row => {
    // Handle user settings
    if (
      userChainSettings.showUserAssetsOnly &&
      !row.userSupplyBalanceCents?.isGreaterThan(0) &&
      !row.userWalletBalanceCents?.isGreaterThan(0)
    ) {
      return;
    }

    // Handle search
    return (
      !searchValue ||
      row.vhToken.underlyingToken.symbol.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const columns: TableColumn<LiquidityHub>[] = [
    {
      key: 'asset',
      label: t('liquidityHub.table.columns.asset'),
      selectOptionLabel: t('liquidityHub.table.columns.asset'),
      renderCell: ({ vhToken }) => <TokenIconWithSymbol token={vhToken.underlyingToken} />,
    },
    {
      key: 'totalSupply',
      label: t('liquidityHub.table.columns.totalSupply'),
      selectOptionLabel: t('liquidityHub.table.columns.totalSupply'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.supplyBalanceCents, rowB.supplyBalanceCents, direction),
      renderCell: ({ vhToken, supplyBalanceTokens, supplyBalanceCents }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: supplyBalanceTokens,
            token: vhToken.underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({
            value: supplyBalanceCents,
          })}
        />
      ),
    },
    {
      key: 'exposure',
      label: (
        <Trans
          i18nKey="liquidityHub.table.columns.exposure.title"
          components={{
            InfoIcon: (
              <InfoIcon
                tooltip={t('liquidityHub.table.columns.exposure.tooltip')}
                className="align-sub ml-1"
              />
            ),
          }}
        />
      ),
      selectOptionLabel: t('liquidityHub.table.columns.exposure.selectionOptionLabel'),
      renderCell: ({ sources }) => (
        <TokenGroup tokens={sources.flatMap(source => source.collateralTokens)} limit={5} />
      ),
    },
    {
      key: 'supplyApy',
      label: t('liquidityHub.table.columns.supplyApy'),
      selectOptionLabel: t('liquidityHub.table.columns.supplyApy'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.supplyApyPercentage, rowB.supplyApyPercentage, direction),
      renderCell: ({ supplyApyPercentage }) => formatPercentageToReadableValue(supplyApyPercentage),
    },
    {
      key: 'liquidity',
      label: t('liquidityHub.table.columns.liquidity'),
      selectOptionLabel: t('liquidityHub.table.columns.liquidity'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.liquidityCents, rowB.liquidityCents, direction),
      renderCell: ({ vhToken, liquidityTokens, liquidityCents }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: liquidityTokens,
            token: vhToken.underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({
            value: liquidityCents,
          })}
        />
      ),
    },
  ];

  const initialOrder: Order<LiquidityHub> = {
    orderBy: columns[3],
    orderDirection: 'desc',
  };

  return (
    <Table
      data={filteredData}
      columns={columns}
      rowKeyExtractor={row => row.vhToken.address}
      controls
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      className={className}
      renderRowControl={renderRowControl}
      initialOrder={initialOrder}
      header={
        <Controls
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          showPausedAssetsToggle={false}
          searchInputPlaceholder={t('liquidityHub.table.search.placeholder')}
        />
      }
      {...otherProps}
    />
  );
};
