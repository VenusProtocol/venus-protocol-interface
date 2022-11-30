/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import MuiTableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import React from 'react';

import { Icon } from '../Icon';
import { useStyles } from './styles';
import { TableColumn } from './types';

interface HeadProps<R> {
  columns: TableColumn<R>[];
  orderBy: TableColumn<R> | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  onRequestOrder: (column: TableColumn<R>) => void;
  className?: string;
}

function Head<R>({ columns, orderBy, orderDirection, onRequestOrder, className }: HeadProps<R>) {
  const styles = useStyles();
  return (
    <MuiTableHead>
      <MuiTableRow className={className}>
        {columns.map(column => {
          const active = orderBy?.key === column.key;

          return (
            <MuiTableCell
              key={column.key}
              sortDirection={active ? orderDirection : false}
              align={column.align}
            >
              <MuiTableSortLabel
                css={styles.tableSortLabel({ orderable: !!column.sortRows })}
                active={active}
                direction={active ? orderDirection : 'asc'}
                onClick={column.sortRows ? () => onRequestOrder(column) : undefined}
                hideSortIcon={false}
                // @ts-expect-error Override IconComponent with null so it doesn't render
                IconComponent={null}
              >
                <span>{column.label}</span>

                {!!column.sortRows && (
                  <div css={styles.tableSortLabelIconsContainer}>
                    <Icon
                      name="sort"
                      size="8px"
                      css={styles.tableSortLabelIcon({
                        active: active && orderDirection === 'asc',
                      })}
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionAsc"
                    />
                    <Icon
                      name="sort"
                      size="8px"
                      css={styles.tableSortLabelIcon({
                        active: active && orderDirection === 'desc',
                      })}
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiTableSortLabel-icon MuiTableSortLabel-iconDirectionDesc"
                    />
                  </div>
                )}

                {active && !!column.sortRows && (
                  <Box component="span" sx={visuallyHidden}>
                    {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </MuiTableSortLabel>
            </MuiTableCell>
          );
        })}
      </MuiTableRow>
    </MuiTableHead>
  );
}

export default Head;
