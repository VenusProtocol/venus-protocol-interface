import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { CellGroup } from '..';

const cells = [
  { label: 'Total supply', value: '$1.64B' },
  { label: 'Total borrow', value: '$379.58M' },
];

describe('CellGroup', () => {
  it('exposes the horizontally scrollable group to the keyboard', () => {
    const { getByRole } = renderComponent(<CellGroup cells={cells} />);

    const group = getByRole('group', { name: en.cellGroup.ariaLabel });

    expect(group).toHaveAttribute('tabindex', '0');
  });

  it('lets the caller name the group', () => {
    const { getByRole } = renderComponent(<CellGroup cells={cells} ariaLabel="Market stats" />);

    expect(getByRole('group', { name: 'Market stats' })).toBeInTheDocument();
  });

  it('does not add a tab stop to the grid variant, which does not scroll', () => {
    const { queryByRole } = renderComponent(<CellGroup cells={cells} grid />);

    expect(queryByRole('group')).toBeNull();
  });
});
