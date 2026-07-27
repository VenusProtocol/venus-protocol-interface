import Box from '@mui/material/Box';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import MuiTableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

import { cn } from '@venusprotocol/ui';
import { Icon } from '../../Icon';
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
                className={cn(
                  orderable ? 'cursor-pointer!' : 'cursor-auto!',
                  'flex-row! [&_.MuiSvgIcon-root]:ml-2 [&_.MuiSvgIcon-root]:block [&_.MuiSvgIcon-root]:rotate-0 [&_.MuiTableSortLabel-iconDirectionDesc]:rotate-180 [&_span.MuiTableSortLabel-icon]:hidden [&.MuiTableSortLabel-root.Mui-active:hover]:text-grey [&.MuiTableSortLabel-root.Mui-active:hover_.MuiTableSortLabel-iconDirectionAsc]:opacity-50! [&.MuiTableSortLabel-root.Mui-active:hover_.MuiTableSortLabel-iconDirectionDesc]:opacity-50!',
                )}
                active={active}
                direction={active ? orderDirection : 'asc'}
                onClick={orderable ? () => onRequestOrder(column) : undefined}
                hideSortIcon={false}
                // @ts-expect-error Override IconComponent with null so it doesn't render
                IconComponent={null}
              >
                <span className="whitespace-nowrap text-grey">{column.label}</span>

                {controls && orderable && (
                  <div className="-mt-0.5">
                    <Icon
                      name="sort"
                      className={cn(
                        'MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionAsc size-2 fill-white text-white',
                        active && orderDirection === 'asc' && 'fill-green text-green',
                      )}
                    />
                    <Icon
                      name="sort"
                      className={cn(
                        'MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc size-2 fill-white text-white',
                        active && orderDirection === 'desc' && 'fill-green text-green',
                      )}
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
