import { cn } from '@venusprotocol/ui';

import { Icon, InfoIcon, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubYieldGroup } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { YieldGroupName } from '../../YieldGroupName';

export const useColumns = ({
  openPositionAccordionKeys,
  rowKeyExtractor,
}: {
  openPositionAccordionKeys: string[];
  rowKeyExtractor: (row: LiquidityHubYieldGroup) => string;
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<LiquidityHubYieldGroup>[] = [
    {
      key: 'source',
      label: t('liquidityHub.allocationDetails.table.sourceColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.table.sourceColumn.title'),
      renderCell: row => <YieldGroupName name={row.name} bgClassName={row.bgClassName} />,
    },
    {
      key: 'allocation',
      label: t('liquidityHub.allocationDetails.table.allocationColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.table.allocationColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.allocationCents, rowB.allocationCents, direction),
      align: 'right',
      renderCell: ({ allocationCents }) =>
        formatCentsToReadableValue({
          value: allocationCents,
        }),
    },
    {
      key: 'liquidity',
      label: t('liquidityHub.allocationDetails.table.liquidityColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.table.liquidityColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.liquidityCents, rowB.liquidityCents, direction),
      align: 'right',
      renderCell: ({ liquidityCents }) =>
        formatCentsToReadableValue({
          value: liquidityCents,
        }),
    },
    {
      key: 'averageApy',
      label: t('liquidityHub.allocationDetails.table.averageApyColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.table.averageApyColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(
          rowA.averageSupplyApyPercentage,
          rowB.averageSupplyApyPercentage,
          direction,
        ),
      align: 'right',
      renderCell: ({ averageSupplyApyPercentage }) =>
        formatPercentageToReadableValue(averageSupplyApyPercentage),
    },
    {
      key: 'capPercentage',
      label: t('liquidityHub.allocationDetails.table.capPercentageColumn.title'),
      selectOptionLabel: t('liquidityHub.allocationDetails.table.capPercentageColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.allocationCapPercentage, rowB.allocationCapPercentage, direction),
      align: 'right',
      renderCell: ({ allocationCapPercentage }) =>
        formatPercentageToReadableValue(allocationCapPercentage),
    },
    {
      key: 'capDollars',
      label: (
        <div className="flex items-center gap-x-2">
          <span>{t('liquidityHub.allocationDetails.table.capDollarsColumn.title')}</span>

          <InfoIcon tooltip={t('liquidityHub.allocationDetails.table.capDollarsColumn.tooltip')} />
        </div>
      ),
      selectOptionLabel: t('liquidityHub.allocationDetails.table.capDollarsColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.allocationCapCents, rowB.allocationCapCents, direction),
      align: 'right',
      renderCell: row => {
        const isOpen = openPositionAccordionKeys.includes(rowKeyExtractor(row));

        return (
          <div className="inline-flex items-center gap-x-2">
            <span>
              {row.allocationCapCents.isFinite()
                ? formatCentsToReadableValue({ value: row.allocationCapCents })
                : t('liquidityHub.allocationDetails.table.capDollarsColumn.unlimited')}
            </span>

            <Icon name="chevronDown" className={cn('size-3', isOpen && 'rotate-180')} />
          </div>
        );
      },
    },
  ];

  return columns;
};
