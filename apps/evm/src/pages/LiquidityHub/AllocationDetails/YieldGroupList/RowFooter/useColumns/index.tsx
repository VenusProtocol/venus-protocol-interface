import { Apy, LayeredValues, type TableColumn, TokenGroup } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubSource, LiquidityHubYieldGroup, Token } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';

export const useColumns = ({
  yieldGroup,
  underlyingToken,
}: {
  yieldGroup: LiquidityHubYieldGroup;
  underlyingToken: Token;
}) => {
  const { t } = useTranslation();

  const nameColumnContent =
    yieldGroup.type === 'institutionCapital'
      ? t('liquidityHub.allocationDetails.yieldGroup.nameColumn.title.vault')
      : t('liquidityHub.allocationDetails.yieldGroup.nameColumn.title.market');

  const shouldDisplayLockEndDate = yieldGroup.sources.some(source => !!source.lockEndDate);

  const columns: TableColumn<LiquidityHubSource>[] = [
    {
      key: 'name',
      label: nameColumnContent,
      selectOptionLabel: nameColumnContent,
      renderCell: row => row.name,
    },
    {
      key: 'apy',
      label: t('liquidityHub.allocationDetails.yieldGroup.apyColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.apyColumn.title'),
      align: 'right',
      renderCell: ({ supplyApyPercentage, supplyTokenDistributions }) => (
        <Apy
          type="supply"
          token={underlyingToken}
          baseApyPercentage={supplyApyPercentage}
          tokenDistributions={supplyTokenDistributions}
        />
      ),
    },
    {
      key: 'allocation',
      label: t('liquidityHub.allocationDetails.yieldGroup.allocationColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.allocationColumn.title'),
      align: 'right',
      renderCell: ({ allocationCents, allocationTokens }) => (
        <LayeredValues
          className="text-end"
          topValue={formatTokensToReadableValue({
            value: allocationTokens,
            token: underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({
            value: allocationCents,
          })}
        />
      ),
    },
    {
      key: 'liquidity',
      label: t('liquidityHub.allocationDetails.yieldGroup.liquidityColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.liquidityColumn.title'),
      align: 'right',
      renderCell: ({ liquidityCents, liquidityTokens }) => (
        <LayeredValues
          className="text-end"
          topValue={formatTokensToReadableValue({
            value: liquidityTokens,
            token: underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({
            value: liquidityCents,
          })}
        />
      ),
    },
  ];

  if (shouldDisplayLockEndDate) {
    columns.push({
      key: 'lockEndDate',
      label: t('liquidityHub.allocationDetails.yieldGroup.lockEndDateColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.lockEndDateColumn.title'),
      align: 'right',
      renderCell: ({ lockEndDate }) =>
        lockEndDate
          ? t('liquidityHub.allocationDetails.yieldGroup.lockEndDateColumn.date', {
              date: lockEndDate,
            })
          : PLACEHOLDER_KEY,
    });
  }

  columns.push({
    key: 'collateral',
    label: t('liquidityHub.allocationDetails.yieldGroup.collateralColumn.title'),
    selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.collateralColumn.title'),
    align: 'right',
    renderCell: ({ collateralTokens }) => <TokenGroup tokens={collateralTokens} limit={5} />,
  });

  return columns;
};
