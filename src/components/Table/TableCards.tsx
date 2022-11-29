/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { Delimiter } from '../Delimiter';
import { useStyles } from './styles';
import { TableProps, TableRow } from './types';

type TableCardProps<R extends TableRow> = Pick<
  TableProps<R>,
  'data' | 'rowKeyExtractor' | 'rowOnClick' | 'getRowHref' | 'breakpoint' | 'columns'
>;

export function TableCards<R extends TableRow>({
  data,
  rowKeyExtractor,
  rowOnClick,
  getRowHref,
  breakpoint,
  columns,
}: TableCardProps<R>) {
  const styles = useStyles();

  const [titleColumn, ...otherColumns] = columns;

  return (
    <div css={styles.getCardsContainer({ breakpoint })}>
      {data.map(row => {
        const rowKey = rowKeyExtractor(row);

        return (
          <Paper
            key={rowKey}
            css={styles.tableWrapperMobile({ clickable: !!(rowOnClick || getRowHref) })}
            onClick={rowOnClick && ((e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row))}
            component={
              getRowHref
                ? ({ children, ...props }) => (
                    <div {...props}>
                      <Link to={getRowHref(row)}>{children}</Link>
                    </div>
                  )
                : 'div'
            }
          >
            <div css={styles.rowTitleMobile}>{titleColumn.renderCell(row)}</div>

            <Delimiter css={styles.delimiterMobile} />

            <div className="table__table-cards__card-content" css={styles.rowWrapperMobile}>
              {otherColumns.map(column => (
                <div key={`${rowKey}-${column.key}`} css={styles.cellMobile}>
                  <Typography variant="tiny" css={styles.cellTitleMobile}>
                    {column.label}
                  </Typography>

                  <Typography variant="small2" css={styles.cellValueMobile}>
                    {column.renderCell(row)}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>
        );
      })}
    </div>
  );
}

export default TableCards;
