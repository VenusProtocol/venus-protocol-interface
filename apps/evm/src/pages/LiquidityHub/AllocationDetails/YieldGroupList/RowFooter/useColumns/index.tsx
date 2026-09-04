import { Apy, InfoIcon, LayeredValues, type TableColumn } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubSource, LiquidityHubYieldGroup, Token } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import { CollateralGroup } from './CollateralGroup';
import { RatingGroup } from './RatingGroup';

export const useColumns = ({
  yieldGroup,
  underlyingToken,
}: {
  yieldGroup: LiquidityHubYieldGroup;
  underlyingToken: Token;
}) => {
  const { t } = useTranslation();

  let nameColumnContent = t('liquidityHub.allocationDetails.yieldGroup.nameColumn.title.market');

  if (yieldGroup.type === 'frv') {
    nameColumnContent = t('liquidityHub.allocationDetails.yieldGroup.nameColumn.title.vault');
  } else if (yieldGroup.type === 'centrifuge') {
    nameColumnContent = t('liquidityHub.allocationDetails.yieldGroup.nameColumn.title.fund');
  }

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

  if (yieldGroup.sources.some(source => source.collaterals.length > 0)) {
    columns.push({
      key: 'collateral',
      label: t('liquidityHub.allocationDetails.yieldGroup.collateralColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.collateralColumn.title'),
      align: 'right',
      renderCell: ({ collaterals }) => <CollateralGroup collaterals={collaterals} />,
    });
  }

  if (yieldGroup.sources.some(source => source.ratings.length > 0)) {
    columns.push({
      key: 'rating',
      label: (
        <div className="inline-flex items-center gap-x-2">
          <span>{t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.title')}</span>

          <InfoIcon tooltip={t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.tooltip')} />
        </div>
      ),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.title'),
      align: 'right',
      renderCell: ({ ratings }) => <RatingGroup ratings={ratings} />,
    });
  }

  return columns;
};
