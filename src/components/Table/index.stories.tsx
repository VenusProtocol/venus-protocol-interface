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
      rowKeyExtractor={row => `${row[0].value}`}
      breakpoint="lg"
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
      rowKeyExtractor={row => `${row[0].value}`}
      breakpoint="lg"
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
      rowKeyExtractor={row => `${row[0].value}`}
      gridTemplateColumnsCards="100px 1fr 1fr 140px"
      breakpoint="lg"
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
      rowKeyExtractor={row => `${row[0].value}`}
      breakpoint="lg"
      css={[styles.table, styles.cardContentGrid]}
    />
  );
};
