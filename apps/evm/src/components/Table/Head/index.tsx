/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import MuiTableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

import { cn } from '@venusprotocol/ui';
import { Icon } from '../../Icon';
import { useStyles } from '../styles';
import type { TableColumn } from '../types';

interface HeadProps<R> {
  columns: TableColumn<R>[];
  orderBy: TableColumn<R> | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  onRequestOrder: (column: TableColumn<R>) => void;
  controls: boolean;
  rowControlColumn: boolean;
  className?: string;
}

function Head<R>({
  columns,
  orderBy,
  orderDirection,
  onRequestOrder,
  className,
  controls,
  rowControlColumn,
}: HeadProps<R>) {
  const styles = useStyles();
  return (
    <MuiTableHead className={cn('h-14', className)}>
      <MuiTableRow>
        {columns.map(column => {
          const active = orderBy?.key === column.key;
          const orderable = !!column.sortRows || !!column.sortable;

          return (
            <MuiTableCell
              key={column.key}
              sortDirection={active ? orderDirection : false}
              align={column.align}
            >
              <MuiTableSortLabel
                css={styles.tableSortLabel({ orderable })}
                active={active}
                direction={active ? orderDirection : 'asc'}
                onClick={orderable ? () => onRequestOrder(column) : undefined}
                hideSortIcon={false}
                // @ts-expect-error Override IconComponent with null so it doesn't render
                IconComponent={null}
              >
                <span className="whitespace-nowrap">{column.label}</span>

                {controls && orderable && (
                  <div css={styles.tableSortLabelIconsContainer}>
                    <Icon
                      name="sort"
                      css={styles.tableSortLabelIcon({
                        active: active && orderDirection === 'asc',
                      })}
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionAsc size-2"
                    />
                    <Icon
                      name="sort"
                      css={styles.tableSortLabelIcon({
                        active: active && orderDirection === 'desc',
                      })}
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc size-2"
                    />
                  </div>
                )}

                {active && orderable && (
                  <Box component="span" sx={visuallyHidden}>
                    {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </MuiTableSortLabel>
            </MuiTableCell>
          );
        })}

        {rowControlColumn && <MuiTableCell className="w-8" />}
      </MuiTableRow>
    </MuiTableHead>
  );
}

export default Head;
