import type BigNumber from 'bignumber.js';
import type { TableColumn, TableProps } from 'components';
import { useIsMdDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';

const MOBILE_COLUMN_WIDTHS = ['58%', '42%'];

interface AmountColumnInput<R> {
  key: string;
  label: string;
  getTokens: (row: R) => BigNumber;
  getCents: (row: R) => BigNumber;
  getToken: (row: R) => Token;
}

export const useMarketColumns = () => {
  const { t } = useTranslation();
  const isMobile = useIsMdDown();

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

        <p className="text-secondary">{formatCentsToReadableValue({ value: getCents(row) })}</p>
      </div>
    ),
  });

  const buildApyColumn = <R,>({
    renderCell,
    sortRows,
    secondary,
  }: Pick<TableColumn<R>, 'renderCell' | 'sortRows'> & {
    secondary?: { label: string; getCents: (row: R) => BigNumber };
  }): TableColumn<R> => ({
    key: 'apy',
    label: t('lite.columns.apy'),
    selectOptionLabel: t('lite.columns.apy'),
    align: 'right',
    renderCell: (row, index) => (
      <div>
        <div className="flex flex-wrap items-center justify-end gap-2 whitespace-nowrap font-semibold [&>*]:justify-end">
          {renderCell?.(row, index)}
        </div>

        {isMobile && secondary && (
          <p className="mt-1 text-xs text-secondary">
            {formatCentsToReadableValue({ value: secondary.getCents(row) })} {secondary.label}
          </p>
        )}
      </div>
    ),
    sortRows,
  });

  const getTableProps = <R,>({
    columns,
    columnWidths,
  }: {
    columns: TableColumn<R>[];
    columnWidths: string[];
  }): Pick<
    TableProps<R>,
    | 'columns'
    | 'columnWidths'
    | 'breakpoint'
    | 'size'
    | 'stickyHeader'
    | 'hideCardDelimiter'
    | 'className'
    | 'tableContainerClassName'
  > => ({
    columns: isMobile ? columns.slice(0, 2) : columns,
    columnWidths: isMobile ? MOBILE_COLUMN_WIDTHS : columnWidths,
    breakpoint: isMobile ? undefined : 'md',
    size: 'compact',
    stickyHeader: true,
    hideCardDelimiter: true,
    className: 'rounded-[7px] border-0 md:border-0',
    tableContainerClassName: 'lite-table-scroll rounded-b-[7px] md:max-h-100 md:overscroll-contain',
  });

  return { buildAmountColumn, buildApyColumn, getTableProps, isMobile };
};
