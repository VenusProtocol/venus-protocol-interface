/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Delimiter } from '../Delimiter';
import { ITableRowProps } from './types';
import { useStyles } from './styles';

interface ITableCardProps {
  rows: ITableRowProps[][];
  rowKeyIndex: number;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: ITableRowProps[]) => void;
  columns: { key: string; label: string; orderable: boolean }[];
  className?: string;
}

const TableCards: React.FC<ITableCardProps> = ({
  rows,
  rowKeyIndex,
  rowOnClick,
  columns,
  className,
}) => {
  const styles = useStyles();

  return (
    <div className={className}>
      {rows.map(row => {
        const rowKey = row[rowKeyIndex].value.toString();
        const [titleColumn, ...otherColumns] = columns;
        const titleCell = row.find(cell => titleColumn.key === cell.key);
        return (
          <Paper
            key={rowKey}
            css={styles.tableWrapperMobile}
            onClick={e => rowOnClick && rowOnClick(e, row)}
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
