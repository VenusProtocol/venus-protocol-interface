import { cn } from '@venusprotocol/ui';

import { Icon, LayeredValues, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import {
  compareNumbers,
  compareStrings,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { TokenPair } from '../../../TokenPair';
import type { Row } from '../types';

export const useColumns = ({
  openPositionAccordionKeys,
  setOpenAccordionKeys,
  rowKeyExtractor,
}: {
  openPositionAccordionKeys: string[];
  setOpenAccordionKeys: (setter: (currOpenKeys: string[]) => string[]) => void;
  rowKeyExtractor: (row: Row) => string;
}) => {
  const { t } = useTranslation();
  const getPositionLabel = (row: Row) => `${row.longToken.symbol}/${row.shortToken.symbol}`;

  const handleTokenPairClick = (e: React.MouseEvent, row: Row) => {
    e.stopPropagation();

    const rowKey = rowKeyExtractor(row);

    setOpenAccordionKeys(currOpenKeys =>
      currOpenKeys.includes(rowKey)
        ? currOpenKeys.filter(key => key !== rowKey)
        : [...currOpenKeys, rowKey],
    );
  };

  const columns: TableColumn<Row>[] = [
    {
      key: 'position',
      label: t('yieldPlus.positions.table.positionColumn.title'),
      selectOptionLabel: t('yieldPlus.positions.table.positionColumn.title'),
      sortRows: (rowA, rowB, direction) => {
        const positionLabelComparison = compareStrings(
          getPositionLabel(rowA),
          getPositionLabel(rowB),
          direction,
        );

        if (positionLabelComparison !== 0) {
          return positionLabelComparison;
        }

        return compareNumbers(rowA.leverageFactor, rowB.leverageFactor, direction);
      },
      renderCell: row => (
        <button
          className="flex items-center gap-x-2 h-full w-full cursor-pointer"
          type="button"
          onClick={e => handleTokenPairClick(e, row)}
        >
          <TokenPair shortToken={row.shortToken} longToken={row.longToken} size="sm" />

          <div className="px-1 py-0.5 rounded-lg border border-light-grey text-light-grey text-b2s">
            {row.leverageFactor}x
          </div>

          <Icon
            name="chevronDown"
            className={cn(
              openPositionAccordionKeys.includes(rowKeyExtractor(row)) && 'rotate-180',
              'size-3',
            )}
          />
        </button>
      ),
    },
    {
      key: 'long',
      label: t('yieldPlus.positions.table.longColumn.title'),
      selectOptionLabel: t('yieldPlus.positions.table.longColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.longBalanceCents, rowB.longBalanceCents, direction),
      align: 'right',
      renderCell: ({ longToken, longBalanceTokens, longBalanceCents }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: longBalanceTokens,
            token: longToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: longBalanceCents,
          })}
        />
      ),
    },
    {
      key: 'short',
      label: t('yieldPlus.positions.table.shortColumn.title'),
      selectOptionLabel: t('yieldPlus.positions.table.shortColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.shortBalanceCents, rowB.shortBalanceCents, direction),
      align: 'right',
      renderCell: ({ shortToken, shortBalanceTokens, shortBalanceCents }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: shortBalanceTokens,
            token: shortToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: shortBalanceCents,
          })}
        />
      ),
    },
    {
      key: 'pnl',
      label: t('yieldPlus.positions.table.pnlColumn.title'),
      selectOptionLabel: t('yieldPlus.positions.table.pnlColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.unrealizedPnlCents, rowB.unrealizedPnlCents, direction),
      align: 'right',
      renderCell: ({ unrealizedPnlCents, unrealizedPnlPercentage }) => (
        <LayeredValues
          className={cn(unrealizedPnlCents >= 0 ? 'text-green' : 'text-red')}
          bottomValueClassName="text-inherit"
          topValueClassName="text-p3s"
          topValue={formatCentsToReadableValue({
            value: unrealizedPnlCents,
          })}
          bottomValue={formatPercentageToReadableValue(unrealizedPnlPercentage)}
        />
      ),
    },
    {
      key: 'entryPrice',
      label: t('yieldPlus.positions.table.entryPrice.title'),
      selectOptionLabel: t('yieldPlus.positions.table.entryPrice.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.entryPriceCents, rowB.entryPriceCents, direction),
      align: 'right',
      renderCell: ({ shortToken, entryPriceCents, entryPriceTokens }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: entryPriceTokens,
            token: shortToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: entryPriceCents,
            shorten: false,
            maxDecimalPlaces: 6,
          })}
        />
      ),
    },
    {
      key: 'liquidationPrice',
      label: t('yieldPlus.positions.table.liquidationPrice.title'),
      selectOptionLabel: t('yieldPlus.positions.table.liquidationPrice.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.liquidationPriceCents, rowB.liquidationPriceCents, direction),
      align: 'right',
      renderCell: ({ shortToken, liquidationPriceCents, liquidationPriceTokens }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: liquidationPriceTokens,
            token: shortToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: liquidationPriceCents,
            shorten: false,
            maxDecimalPlaces: 6,
          })}
        />
      ),
    },
  ];

  return columns;
};
