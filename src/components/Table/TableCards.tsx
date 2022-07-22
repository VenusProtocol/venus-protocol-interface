/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { Delimiter } from '../Delimiter';
import { useStyles } from './styles';
import { TableRowProps } from './types';

interface TableCardProps {
  rows: TableRowProps[][];
  rowKeyIndex: number;
  columns: { key: string; label: string; orderable: boolean }[];
  className?: string;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: TableRowProps[]) => void;
  getRowHref?: (row: TableRowProps[]) => string;
}

const TableCards: React.FC<TableCardProps> = ({
  rows,
  rowKeyIndex,
  rowOnClick,
  getRowHref,
  columns,
  className,
}) => {
  const styles = useStyles();

  return (
    <div className={className}>
      {rows.map((row, idx) => {
        const rowKey = `${row[rowKeyIndex].value.toString()}-${idx}-cards`;
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
                    <Typography variant="body2" css={styles.columnLabelMobile}>
                      {column?.label}
                    </Typography>
                    <div css={styles.cellValueMobile}>{currentCell?.render()}</div>
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
