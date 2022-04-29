/** @jsxImportSource @emotion/react */
import React, { FC, ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { Delimiter, Table } from 'components';
import { ITableProps } from 'components/v2/Table/useTable';
import { useStyles } from './styles';

interface IAssetCardMobile extends Pick<ITableProps, 'columns' | 'data' | 'rowOnClick'> {
  title: ReactNode | string;
}

export const AssetCardMobile: FC<IAssetCardMobile> = ({ title, columns, data, rowOnClick }) => {
  const styles = useStyles();
  return (
    <Paper css={styles.tableContainer}>
      <div css={styles.title}>{title}</div>
      <Delimiter css={styles.delimiter} />
      <Table
        columns={columns}
        data={data}
        initialOrder={{
          orderBy: 'apyEarned',
          orderDirection: 'asc',
        }}
        rowOnClick={rowOnClick}
        rowKeyIndex={0}
      />
    </Paper>
  );
};
