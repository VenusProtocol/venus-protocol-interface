/** @jsxImportSource @emotion/react */
import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import { Icon } from '../Icon';
import { useStyles } from './styles';

interface IHeadProps<C extends { key: string; label: string; orderable: boolean }[]> {
  columns: C;
  orderBy: string | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  onRequestOrder: (property: C[number]['key']) => void;
}

function Head<C extends { key: string; label: string; orderable: boolean }[]>({
  columns,
  orderBy,
  orderDirection,
  onRequestOrder,
}: IHeadProps<C>) {
  const styles = useStyles();
  return (
    <TableHead>
      <TableRow>
        {columns.map((col: C[number]) => {
          const active = orderBy === col.key;
          return (
            <TableCell key={col.key} sortDirection={active ? orderDirection : false}>
              <TableSortLabel
                css={styles.tableSortLabel({ orderable: col.orderable })}
                active={active}
                direction={active ? orderDirection : 'asc'}
                onClick={col.orderable ? () => onRequestOrder(col.key) : undefined}
                hideSortIcon={false}
                // @ts-expect-error Override IconComponent with null so it doesn't render
                IconComponent={null}
              >
                <span>{col.label}</span>
                {col.orderable && (
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
                {active && col.orderable && (
                  <Box component="span" sx={visuallyHidden}>
                    {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default Head;
