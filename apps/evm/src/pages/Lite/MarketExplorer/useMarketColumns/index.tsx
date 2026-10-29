import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';
import type { TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';

interface AmountColumnInput<R> {
  key: string;
  label: string;
  getTokens: (row: R) => BigNumber;
  getCents: (row: R) => BigNumber;
  getToken: (row: R) => Token;
}

export const useMarketColumns = () => {
  const { t } = useTranslation();

  const buildAmountColumn = <R,>({
    key,
    label,
    getTokens,
    getCents,
    getToken,
  }: AmountColumnInput<R>): TableColumn<R> => ({
    key,
    label,
    selectOptionLabel: label,
    align: 'right',
    sortRows: (rowA, rowB, direction) =>
      (getCents(rowA).comparedTo(getCents(rowB)) ?? 0) * (direction === 'asc' ? 1 : -1),
    renderCell: row => (
      <div className="tabular-nums">
        <p>
          {formatTokensToReadableValue({
            value: getTokens(row),
            token: getToken(row),
            addSymbol: false,
          })}
        </p>

        <p className="text-light-grey">{formatCentsToReadableValue({ value: getCents(row) })}</p>
      </div>
    ),
  });

  const buildApyColumn = <R,>({
    renderCell,
    sortRows,
  }: Pick<TableColumn<R>, 'renderCell' | 'sortRows'>): TableColumn<R> => ({
    key: 'apy',
    label: t('lite.columns.apy'),
    selectOptionLabel: t('lite.columns.apy'),
    align: 'right',
    renderCell: (row, index) => (
      <div className={cn('flex flex-wrap items-center justify-end gap-2 whitespace-nowrap')}>
        {renderCell?.(row, index)}
      </div>
    ),
    sortRows,
  });

  return { buildAmountColumn, buildApyColumn };
};
