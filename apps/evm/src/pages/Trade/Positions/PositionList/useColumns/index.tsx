import { cn } from '@venusprotocol/ui';

import { Icon, InfoIcon, LayeredValues, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import { TokenPair } from 'pages/Trade/TokenPair';
import { formatLiquidationPriceTokensToReadableValue } from 'pages/Trade/formatLiquidationPriceTokensToReadableValue';
import type { TradePosition } from 'types';
import {
  compareBigNumbers,
  compareNumbers,
  compareStrings,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export const useColumns = ({
  openPositionAccordionKeys,
  onPositionAccordionClick,
  rowKeyExtractor,
}: {
  openPositionAccordionKeys: string[];
  onPositionAccordionClick: (row: TradePosition) => unknown;
  rowKeyExtractor: (row: TradePosition) => string;
}) => {
  const { t } = useTranslation();
  const getPositionLabel = (row: TradePosition) =>
    `${row.longAsset.vToken.underlyingToken.symbol}/${row.shortAsset.vToken.underlyingToken.symbol}`;

  const toggleAccordion = (row: TradePosition, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onPositionAccordionClick(row);
  };

  const columns: TableColumn<TradePosition>[] = [
    {
      key: 'position',
      label: t('trade.positions.table.positionColumn.title'),
      selectOptionLabel: t('trade.positions.table.positionColumn.title'),
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
        <div className="flex items-center gap-x-2 h-full w-full">
          <TokenPair
            shortToken={row.shortAsset.vToken.underlyingToken}
            longToken={row.longAsset.vToken.underlyingToken}
            size="sm"
          />

          <div className="px-1 py-0.5 rounded-lg border border-light-grey text-light-grey text-b2s">
            {row.leverageFactor}x
          </div>

          <button
            className="w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer transition-colors hover:bg-background-hover"
            onClick={e => toggleAccordion(row, e)}
            type="button"
          >
            <Icon
              name="chevronDown"
              className={cn(
                openPositionAccordionKeys.includes(rowKeyExtractor(row)) && 'rotate-180',
                'size-3',
              )}
            />
          </button>
        </div>
      ),
    },
    {
      key: 'long',
      label: t('trade.positions.table.longColumn.title'),
      selectOptionLabel: t('trade.positions.table.longColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.longBalanceCents, rowB.longBalanceCents, direction),
      align: 'right',
      renderCell: ({ longAsset, longBalanceTokens, longBalanceCents }) => (
        <LayeredValues
          className="whitespace-nowrap"
          topValue={formatTokensToReadableValue({
            value: longBalanceTokens,
            token: longAsset.vToken.underlyingToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: longBalanceCents,
          })}
        />
      ),
    },
    {
      key: 'short',
      label: t('trade.positions.table.shortColumn.title'),
      selectOptionLabel: t('trade.positions.table.shortColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.shortBalanceCents, rowB.shortBalanceCents, direction),
      align: 'right',
      renderCell: ({ shortAsset, shortBalanceTokens, shortBalanceCents }) => (
        <LayeredValues
          className="whitespace-nowrap"
          topValue={formatTokensToReadableValue({
            value: shortBalanceTokens,
            token: shortAsset.vToken.underlyingToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: shortBalanceCents,
          })}
        />
      ),
    },
    {
      key: 'pnl',
      label: t('trade.positions.table.pnlColumn.title'),
      selectOptionLabel: t('trade.positions.table.pnlColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.unrealizedPnlCents, rowB.unrealizedPnlCents, direction),
      align: 'right',
      renderCell: ({ unrealizedPnlCents, unrealizedPnlPercentage }) => (
        <LayeredValues
          className={cn('whitespace-nowrap', unrealizedPnlCents >= 0 ? 'text-green' : 'text-red')}
          bottomValueClassName="text-inherit"
          topValueClassName="font-semibold"
          topValue={formatCentsToReadableValue({
            value: unrealizedPnlCents,
          })}
          bottomValue={formatPercentageToReadableValue(unrealizedPnlPercentage)}
        />
      ),
    },
    {
      key: 'entryPrice',
      label: (
        <div className="flex items-center gap-x-1">
          <span>{t('trade.positions.table.entryPrice.title')}</span>

          <InfoIcon tooltip={t('trade.positions.table.entryPrice.tooltip')} />
        </div>
      ),
      selectOptionLabel: t('trade.positions.table.entryPrice.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.entryPriceTokens, rowB.entryPriceTokens, direction),
      align: 'right',
      renderCell: ({ shortAsset, entryPriceTokens }) => (
        <LayeredValues
          className="whitespace-nowrap"
          topValue={formatTokensToReadableValue({
            value: entryPriceTokens,
            token: shortAsset.vToken.underlyingToken,
            addSymbol: false,
          })}
        />
      ),
    },
    {
      key: 'liquidationPrice',
      label: t('trade.positions.table.liquidationPrice.title'),
      selectOptionLabel: t('trade.positions.table.liquidationPrice.title'),
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.liquidationPriceTokens, rowB.liquidationPriceTokens, direction),
      align: 'right',
      renderCell: ({ shortAsset, liquidationPriceTokens }) => (
        <LayeredValues
          className="whitespace-nowrap"
          topValue={formatLiquidationPriceTokensToReadableValue({
            value: liquidationPriceTokens,
            token: shortAsset.vToken.underlyingToken,
            t,
          })}
        />
      ),
    },
  ];

  return columns;
};
