/** @jsxImportSource @emotion/react */
import React from 'react';
import { uid } from 'react-uid';
import TableMUI from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Delimiter } from '../Delimiter';
import Head from './Head';
import { useStyles } from './styles';
import { ITableProps, ITableRowProps, useTable } from './useTable';

export const Table = ({
  columns,
  data,
  title,
  minWidth,
  initialOrder,
  rowOnClick,
  rowKeyIndex,
  className,
  gridTemplateColumns,
  gridTemplateRowsMobile = '1fr',
  isMobileView,
}: ITableProps) => {
  const styles = useStyles();
  const { rows, orderBy, orderDirection, onRequestOrder, gridColumns } = useTable({
    columns,
    initialOrder,
    data,
    gridTemplateColumns,
    isMobileView,
  });

  return (
    <Paper css={[styles.root, isMobileView && styles.rootMobile]} className={className}>
      {title && <h4 css={[styles.title, isMobileView && styles.titleMobile]}>{title}</h4>}

      {isMobileView ? (
        <>
          {rows.map(([rowTitle, ...cells]) => (
            <Paper key={uid(cells)} css={styles.tableWrapperMobile}>
              <div css={styles.rowTitleMobile}>{rowTitle.render()}</div>
              <Delimiter css={styles.delimiterMobile} />
              <div
                css={[
                  styles.rowWrapperMobile,
                  styles.getTemplateColumns({ gridColumns }),
                  styles.getTemplateRows({ gridRows: gridTemplateRowsMobile }),
                ]}
              >
                {cells.map(cell => {
                  const currentColumn = columns.find(column => column.key === cell.key);
                  return (
                    <div key={uid(cell)} css={styles.cellMobile}>
                      <Typography variant="body2" css={styles.columnLabelMobile}>
                        {currentColumn?.label}
                      </Typography>
                      <span css={styles.cellValueMobile}>{cell.render()}</span>
                    </div>
                  );
                })}
              </div>
            </Paper>
          ))}
        </>
      ) : (
        <TableContainer>
          <TableMUI css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
            <Head
              columns={columns}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onRequestOrder={onRequestOrder}
              css={styles.getTemplateColumns({ gridColumns })}
            />

            {/* TODO: add loading state */}

            {/* TODO: add error state */}

            <TableBody>
              {rows.map(row => (
                <TableRow
                  hover
                  key={row[rowKeyIndex].value.toString()}
                  onClick={e => rowOnClick && rowOnClick(e, row)}
                  css={styles.getTemplateColumns({ gridColumns })}
                >
                  {row.map(({ key, render }: ITableRowProps) => {
                    const cellContent = render();
                    const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;
                    return (
                      <TableCell css={styles.cellWrapper} key={uid(key)} title={cellTitle}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </TableMUI>
        </TableContainer>
      )}
    </Paper>
  );
};
