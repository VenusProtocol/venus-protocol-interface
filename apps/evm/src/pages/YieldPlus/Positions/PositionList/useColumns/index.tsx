import { cn } from '@venusprotocol/ui';

import { Icon, LayeredValues, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import { TokenPair } from 'pages/YieldPlus/TokenPair';
import type { YieldPlusPosition } from 'types';
import {
  compareNumbers,
  compareStrings,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export const useColumns = ({
  openPositionAccordionKeys,
  setOpenAccordionKeys,
  rowKeyExtractor,
}: {
  openPositionAccordionKeys: string[];
  setOpenAccordionKeys: (setter: (currOpenKeys: string[]) => string[]) => void;
  rowKeyExtractor: (row: YieldPlusPosition) => string;
}) => {
  const { t } = useTranslation();
  const getPositionLabel = (row: YieldPlusPosition) =>
    `${row.longAsset.vToken.underlyingToken.symbol}/${row.shortAsset.vToken.underlyingToken.symbol}`;

  const handleTokenPairClick = (e: React.MouseEvent, row: YieldPlusPosition) => {
    e.stopPropagation();

    const rowKey = rowKeyExtractor(row);

    setOpenAccordionKeys(currOpenKeys =>
      currOpenKeys.includes(rowKey)
        ? currOpenKeys.filter(key => key !== rowKey)
        : [...currOpenKeys, rowKey],
    );
  };

  const columns: TableColumn<YieldPlusPosition>[] = [
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
          <TokenPair
            shortToken={row.shortAsset.vToken.underlyingToken}
            longToken={row.longAsset.vToken.underlyingToken}
            size="sm"
          />

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
      renderCell: ({ longAsset, longBalanceTokens, longBalanceCents }) => (
        <LayeredValues
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
      label: t('yieldPlus.positions.table.shortColumn.title'),
      selectOptionLabel: t('yieldPlus.positions.table.shortColumn.title'),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.shortBalanceCents, rowB.shortBalanceCents, direction),
      align: 'right',
      renderCell: ({ shortAsset, shortBalanceTokens, shortBalanceCents }) => (
        <LayeredValues
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
      renderCell: ({ shortAsset, entryPriceCents, entryPriceTokens }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: entryPriceTokens,
            token: shortAsset.vToken.underlyingToken,
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
      renderCell: ({ shortAsset, liquidationPriceCents, liquidationPriceTokens }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: liquidationPriceTokens,
            token: shortAsset.vToken.underlyingToken,
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
