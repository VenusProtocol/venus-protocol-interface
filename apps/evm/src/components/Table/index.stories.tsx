import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { Button } from '@venusprotocol/ui';
import { Table } from '.';
import { Delimiter } from '../Delimiter';
import { type Row, columns, data, orderableColumns } from './storiesUtils';
import type { Order, TableColumn } from './types';

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof Table>;

export const TableDefault = () => (
  <Table
    data={data}
    columns={columns}
    title="Market Data"
    minWidth="650px"
    rowKeyExtractor={row => row.token.address}
    breakpoint="lg"
    className="max-w-225"
  />
);

export const WithOrderableColumns = () => (
  <Table
    data={data}
    columns={orderableColumns}
    title="Market Data"
    minWidth="650px"
    rowKeyExtractor={row => row.token.address}
    breakpoint="lg"
    className="max-w-225"
    initialOrder={{
      orderBy: orderableColumns[1],
      orderDirection: 'desc',
    }}
  />
);

export const SecondaryVariant = () => (
  <Table
    data={data.slice(0, 3)}
    columns={orderableColumns}
    rowKeyExtractor={row => row.token.address}
    initialOrder={{
      orderBy: orderableColumns[2],
      orderDirection: 'asc',
    }}
    rowOnClick={console.log}
    renderRowControl={() => (
      <Button className="h-8 px-3" variant="secondary">
        Manage
      </Button>
    )}
    variant="secondary"
    tableLayout="auto"
    size="sm"
    className="max-w-225 border-0"
  />
);

export const WithHeaderAndNoControls = () => (
  <Table
    data={data}
    columns={orderableColumns}
    title="Market Data"
    rowKeyExtractor={row => row.token.address}
    controls={false}
    breakpoint="md"
    className="max-w-225"
    header={
      <div>
        <p className="text-b1r text-grey">Header content</p>
        <Delimiter className="mt-4" />
      </div>
    }
  />
);

export const Fetching = () => (
  <Table
    data={data.slice(0, 2)}
    columns={orderableColumns}
    rowKeyExtractor={row => row.token.address}
    breakpoint="md"
    isFetching
    className="max-w-225"
  />
);

export const EmptyPlaceholder = () => (
  <Table
    data={[]}
    columns={orderableColumns}
    rowKeyExtractor={row => row.token.address}
    breakpoint="md"
    className="max-w-225"
    placeholder={
      <div className="rounded-lg border border-dark-blue-hover p-6 text-center text-grey">
        No markets found
      </div>
    }
  />
);

export const CardsWithCustomColumns = () => (
  <Table
    data={data}
    columns={orderableColumns}
    cardColumns={[orderableColumns[0], orderableColumns[2], orderableColumns[1]]}
    title="Market Data"
    rowKeyExtractor={row => row.token.address}
    initialOrder={{
      orderBy: orderableColumns[0],
      orderDirection: 'asc',
    }}
    breakpoint="xl"
    cardClassName="border-lightGrey"
    selectVariant="secondary"
    className="max-w-225"
  />
);

export const RowFooterAndLinks = () => (
  <Table
    data={data.slice(0, 3)}
    columns={orderableColumns}
    rowKeyExtractor={row => row.token.address}
    breakpoint="lg"
    tableLayout="auto"
    hideCardDelimiter
    getRowHref={row => `/market/${row.token.address}`}
    renderRowFooter={(row, rowIndex) => (
      <div className="bg-cards px-4 py-3 text-b2r text-grey">
        Footer #{rowIndex + 1}: {row.token.symbol} details
      </div>
    )}
    renderRowControl={() => (
      <button
        className="rounded-lg border border-blue px-2 py-1 text-b2s text-light-grey hover:bg-dark-blue-hover"
        type="button"
      >
        Action
      </button>
    )}
    className="max-w-225"
  />
);

export const ClickableRows = () => {
  const [lastAction, setLastAction] = useState('Click a row or action button');

  return (
    <div className="space-y-4">
      <p className="text-b1r text-grey">Last action: {lastAction}</p>

      <Table
        data={data.slice(0, 3)}
        columns={orderableColumns}
        rowKeyExtractor={row => row.token.address}
        rowOnClick={(_, row) => setLastAction(`Clicked ${row.token.symbol} row`)}
        renderRowControl={row => (
          <Button
            className="h-8 px-3"
            onClick={e => {
              e.stopPropagation();
              setLastAction(`Clicked ${row.token.symbol} action`);
            }}
            variant="secondary"
          >
            Manage
          </Button>
        )}
        breakpoint="lg"
        className="max-w-225"
      />
    </div>
  );
};

const serverSortableColumns: TableColumn<Row>[] = orderableColumns.map(column => ({
  ...column,
  sortRows: undefined,
  sortable: column.key !== 'collateral',
}));

export const ControlledServerSorting = () => {
  const [order, setOrder] = useState<Order<Row>>({
    orderBy: serverSortableColumns[1],
    orderDirection: 'desc',
  });

  return (
    <Table
      data={data}
      columns={serverSortableColumns}
      rowKeyExtractor={row => row.token.address}
      order={order}
      onOrderChange={setOrder}
      breakpoint="lg"
      className="max-w-225"
    />
  );
};
