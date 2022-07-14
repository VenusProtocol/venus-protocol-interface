/** @jsxImportSource @emotion/react */
import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Table } from '.';
import { columns, rows, useTableStyles } from './storiesUtils';

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Table>;

export const TableDefault = () => {
  const styles = useTableStyles();
  return (
    <Table
      columns={columns}
      data={rows}
      title="Market Data"
      minWidth="650px"
      rowKeyIndex={0}
      tableCss={styles.tableCss}
      cardsCss={styles.cardsCss}
      css={styles.table}
    />
  );
};

export const WithInitialOrderDefault = () => {
  const styles = useTableStyles();
  return (
    <Table
      columns={columns}
      data={rows}
      title="Market Data"
      minWidth="650px"
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      tableCss={styles.tableCss}
      cardsCss={styles.cardsCss}
      css={styles.table}
    />
  );
};

export const WithCustomColumnsWidth = () => {
  const styles = useTableStyles();
  return (
    <Table
      columns={columns}
      data={rows}
      title="Market Data"
      rowKeyIndex={0}
      gridTemplateColumnsCards="100px 1fr 1fr 140px"
      tableCss={styles.tableCss}
      cardsCss={styles.cardsCss}
      css={styles.table}
    />
  );
};

export const WithMultipleRows = () => {
  const styles = useTableStyles();
  return (
    <Table
      columns={columns}
      data={rows}
      title="Market Data"
      minWidth="650px"
      rowKeyIndex={0}
      tableCss={styles.tableCss}
      cardsCss={styles.cardsCss}
      css={[styles.table, styles.cardContentGrid]}
    />
  );
};
