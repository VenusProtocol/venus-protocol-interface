import {
  Apy,
  InfoIcon,
  LayeredValues,
  type Order,
  Table,
  type TableColumn,
  type TableProps,
  TokenGroup,
  TokenIconWithSymbol,
} from 'components';
import { routes } from 'constants/routing';
import { Controls } from 'containers/Controls';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { LiquidityHub } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
  getCombinedApy,
  getLiquidityHubCollateralTokens,
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
    return <RowControl className="-ml-6" vhToken={liquidityHub.vhToken} />;
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
      label: t('liquidityHubs.table.columns.asset'),
      selectOptionLabel: t('liquidityHubs.table.columns.asset'),
      renderCell: ({ vhToken }) => <TokenIconWithSymbol token={vhToken.underlyingToken} />,
    },
    {
      key: 'totalSupply',
      label: t('liquidityHubs.table.columns.totalSupply'),
      selectOptionLabel: t('liquidityHubs.table.columns.totalSupply'),
      align: 'right',
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
          i18nKey="liquidityHubs.table.columns.exposure.title"
          components={{
            InfoIcon: (
              <InfoIcon
                tooltip={t('liquidityHubs.table.columns.exposure.tooltip')}
                className="align-sub ml-1"
              />
            ),
          }}
        />
      ),
      selectOptionLabel: t('liquidityHubs.table.columns.exposure.selectionOptionLabel'),
      align: 'right',
      renderCell: ({ yieldGroups }) => (
        <TokenGroup
          tokens={getLiquidityHubCollateralTokens({ yieldGroups })}
          removeDuplicates
          limit={5}
        />
      ),
    },
    {
      key: 'supplyApy',
      label: t('liquidityHubs.table.columns.supplyApy'),
      selectOptionLabel: t('liquidityHubs.table.columns.supplyApy'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(
          getCombinedApy({
            type: 'supply',
            baseApyPercentage: rowA.supplyApyPercentage,
            tokenDistributions: rowA.supplyTokenDistributions,
          }).totalApyPercentage,
          getCombinedApy({
            type: 'supply',
            baseApyPercentage: rowB.supplyApyPercentage,
            tokenDistributions: rowB.supplyTokenDistributions,
          }).totalApyPercentage,
          direction,
        ),
      renderCell: ({
        vhToken,
        supplyApyPercentage,
        supplyTokenDistributions,
        userSupplyBalanceTokens,
      }) => (
        <Apy
          type="supply"
          token={vhToken.underlyingToken}
          baseApyPercentage={supplyApyPercentage}
          tokenDistributions={supplyTokenDistributions}
          userBalanceTokens={userSupplyBalanceTokens}
        />
      ),
    },
    {
      key: 'liquidity',
      label: t('liquidityHubs.table.columns.liquidity'),
      selectOptionLabel: t('liquidityHubs.table.columns.liquidity'),
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

  const getRowHref = (row: LiquidityHub) =>
    routes.liquidityHub.path.replace(':vhTokenAddress', row.vhToken.address);

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
      getRowHref={getRowHref}
      header={
        <Controls
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          showPausedAssetsToggle={false}
          searchInputPlaceholder={t('liquidityHubs.table.search.placeholder')}
        />
      }
      {...otherProps}
    />
  );
};
