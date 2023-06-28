/** @jsxImportSource @emotion/react */
import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Table } from '.';
import { columns, data, orderableColumns, useTableStyles } from './storiesUtils';

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as Meta<typeof Table>;

export const TableDefault = () => {
  const styles = useTableStyles();

  return (
    <Table
      data={data}
      columns={columns}
      title="Market Data"
      minWidth="650px"
      rowKeyExtractor={row => row.token.address}
      breakpoint="lg"
      css={styles.table}
    />
  );
};

export const WithOrderableColumns = () => {
  const styles = useTableStyles();

  return (
    <Table
      data={data}
      columns={orderableColumns}
      title="Market Data"
      minWidth="650px"
      rowKeyExtractor={row => row.token.address}
      breakpoint="lg"
      css={styles.table}
      initialOrder={{
        orderBy: columns[1],
        orderDirection: 'desc',
      }}
    />
  );
};
