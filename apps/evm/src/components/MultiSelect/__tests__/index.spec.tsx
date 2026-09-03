import { fireEvent, screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { MultiSelect } from '..';

describe('MultiSelect', () => {
  const options = [
    { value: 'first', label: 'First option' },
    { value: 'last', label: 'Last option' },
  ];

  const renderMultiSelect = () =>
    renderComponent(
      <MultiSelect
        options={options}
        value={[]}
        onChange={vi.fn()}
        placeholder="All options"
        renderCount={count => `${count} options`}
        title="Select options"
        resetLabel="Reset"
      />,
    );

  it('clips the options to the menu edge, so the highlight of the last option stays within its border', () => {
    renderMultiSelect();

    fireEvent.click(screen.getByRole('button', { name: 'All options' }));

    // An open dropdown renders its options in both the desktop menu and the mobile modal;
    // the desktop menu comes first, and is the element the accent border is passed to
    const menu = screen.getAllByText('Last option')[0].closest('.border-blue');

    expect(menu).toHaveClass('overflow-hidden');
    expect(menu).not.toHaveClass('overflow-visible');
  });
});
