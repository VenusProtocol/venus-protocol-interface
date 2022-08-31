/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { BREAKPOINTS } from 'theme/MuiThemeProvider/muiTheme';

import { Delimiter } from '../Delimiter';
import { useStyles } from './styles';
import { TableRowProps } from './types';

interface TableCardProps {
  rows: TableRowProps[][];
  rowKeyExtractor: (row: TableRowProps[]) => string;
  columns: { key: string; label: string; orderable: boolean }[];
  breakpoint: keyof typeof BREAKPOINTS['values'];
  className?: string;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: TableRowProps[]) => void;
  getRowHref?: (row: TableRowProps[]) => string;
}

const TableCards: React.FC<TableCardProps> = ({
  rows,
  rowKeyExtractor,
  rowOnClick,
  getRowHref,
  breakpoint,
  columns,
}) => {
  const styles = useStyles();

  return (
    <div css={styles.getCardsContainer({ breakpoint })}>
      {rows.map(row => {
        const rowKey = rowKeyExtractor(row);
        const [titleColumn, ...otherColumns] = columns;
        const titleCell = row.find(cell => titleColumn.key === cell.key);

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
            <div css={styles.rowTitleMobile}>{titleCell?.render()}</div>
            <Delimiter css={styles.delimiterMobile} />
            <div className="table__table-cards__card-content" css={styles.rowWrapperMobile}>
              {otherColumns.map(column => {
                const currentCell = row.find(cell => column.key === cell.key);
                return (
                  <div key={`${rowKey}-${currentCell?.key}`} css={styles.cellMobile}>
                    <Typography variant="tiny" css={styles.cellTitleMobile}>
                      {column?.label}
                    </Typography>

                    <Typography variant="small2" css={styles.cellValueMobile}>
                      {currentCell?.render()}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </Paper>
        );
      })}
    </div>
  );
};

export default TableCards;
