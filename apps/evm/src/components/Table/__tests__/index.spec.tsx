import { screen } from '@testing-library/react';

import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { Table, type TableColumn } from '..';

interface Row {
  id: string;
  value: number;
}

const data: Row[] = [
  { id: 'a', value: 1 },
  { id: 'b', value: 2 },
];

const columns: TableColumn<Row>[] = [
  {
    key: 'id',
    label: 'Id',
    selectOptionLabel: 'Id',
    renderCell: row => row.id,
  },
  {
    key: 'value',
    label: 'Value',
    selectOptionLabel: 'Value',
    renderCell: row => String(row.value),
    sortRows: (rowA, rowB, direction) =>
      direction === 'asc' ? rowA.value - rowB.value : rowB.value - rowA.value,
  },
];

describe('Table', () => {
  it('shows the sort select above the cards by default', () => {
    renderComponent(
      <Table data={data} columns={columns} rowKeyExtractor={row => row.id} breakpoint="lg" />,
    );

    expect(screen.getByText(en.table.cardsSelect.label)).toBeInTheDocument();
  });

  it('hides the sort select above the cards when card controls are off', () => {
    renderComponent(
      <Table
        data={data}
        columns={columns}
        rowKeyExtractor={row => row.id}
        breakpoint="lg"
        cardControls={false}
      />,
    );

    expect(screen.queryByText(en.table.cardsSelect.label)).not.toBeInTheDocument();
  });
});
