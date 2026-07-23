import { screen } from '@testing-library/react';

import type { Order, TableColumn } from 'components/Table';
import { renderComponent } from 'testUtils/render';
import { CompactTableCardList } from '..';

interface Row {
  id: string;
  title: string;
  value: number;
}

const rows: Row[] = [
  { id: 'first', title: 'First row', value: 1 },
  { id: 'second', title: 'Second row', value: 2 },
];

const columns: TableColumn<Row>[] = [
  {
    key: 'title',
    label: 'Title',
    selectOptionLabel: 'Title',
    renderCell: row => <span data-testid="row-title">{row.title}</span>,
  },
  {
    key: 'value',
    label: 'Value',
    selectOptionLabel: 'Value',
    renderCell: row => row.value.toString(),
    sortRows: (rowA, rowB, direction) =>
      direction === 'asc' ? rowA.value - rowB.value : rowB.value - rowA.value,
  },
];

const order: Order<Row> = {
  orderBy: columns[1],
  orderDirection: 'desc',
};

describe('CompactTableCardList', () => {
  it('sorts rows and renders actions, footers, and delimiters', () => {
    const { container } = renderComponent(
      <CompactTableCardList
        columns={columns}
        data={rows}
        rowKeyExtractor={row => row.id}
        order={order}
        renderRowAction={row => <button type="button">Open {row.title}</button>}
        renderRowFooter={row => <div>Footer {row.title}</div>}
      />,
    );

    expect(screen.getAllByTestId('row-title').map(element => element.textContent)).toEqual([
      'Second row',
      'First row',
    ]);
    expect(screen.getByRole('button', { name: 'Open First row' })).toBeInTheDocument();
    expect(screen.getByText('Footer Second row')).toBeInTheDocument();
    expect(container.querySelectorAll('hr')).toHaveLength(1);
  });
});
