import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { PageStatHeader } from '..';

const cells = [
  { label: 'Total supply', value: '$1.64B' },
  { label: 'Total borrow', value: '$379.58M' },
  { label: 'Available liquidity', value: '$1.26B' },
  { label: 'Assets', value: '42' },
];

describe('PageStatHeader', () => {
  it('exposes the horizontally scrollable stat strip to the keyboard', () => {
    const { getByRole } = renderComponent(<PageStatHeader title="Core pool" cells={cells} />);

    const group = getByRole('group', { name: en.cellGroup.ariaLabel });

    expect(group).toHaveAttribute('tabindex', '0');
    expect(group).toHaveTextContent('Assets');
  });
});
