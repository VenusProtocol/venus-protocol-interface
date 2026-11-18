import { fireEvent, screen, within } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { MultiSelect } from '..';

describe('MultiSelect', () => {
  const options = [
    { value: 'first', label: 'First option' },
    { value: 'last', label: 'Last option' },
  ];

  const manyOptions = [
    { value: 'AMDB', label: 'AMDB' },
    { value: 'MSFTB', label: 'MSFTB' },
    { value: 'TSLAB', label: 'TSLAB' },
    { value: 'MSTRB', label: 'MSTRB' },
    { value: 'METAB', label: 'METAB' },
    { value: 'BPNC', label: 'BPNC' },
    { value: 'MRNAB', label: 'MRNAB' },
  ];

  const renderMultiSelect = (
    optionsToRender: { value: string; label: React.ReactNode }[] = options,
  ) =>
    renderComponent(
      <MultiSelect
        options={optionsToRender}
        value={[]}
        onChange={vi.fn()}
        placeholder="All options"
        renderCount={count => `${count} options`}
        title="Select options"
        resetLabel="Reset"
        searchPlaceholder="Search option"
        noResultsLabel="No results found"
      />,
    );

  const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'All options' }));

  it('clips the options to the menu edge, so the highlight of the last option stays within its border', () => {
    renderMultiSelect();

    openMenu();

    // An open dropdown renders its options in both the desktop menu and the mobile modal;
    const menu = screen.getAllByText('Last option')[0].closest('.venus-multiselect-menu');

    expect(menu).toHaveClass('overflow-hidden');
    expect(menu).not.toHaveClass('overflow-visible');
  });

  it('does not show a search field when there are 6 options or fewer', () => {
    renderMultiSelect();

    openMenu();

    expect(screen.queryByPlaceholderText('Search option')).not.toBeInTheDocument();
  });

  it('shows a search field when there are more than 6 options', () => {
    renderMultiSelect([...manyOptions, { value: 'XAUM', label: 'XAUM' }]);

    openMenu();

    expect(screen.getAllByPlaceholderText('Search option')[0]).toBeInTheDocument();
  });

  it('lists options starting with the query before options containing it', () => {
    renderMultiSelect(manyOptions);

    openMenu();
    fireEvent.change(screen.getAllByPlaceholderText('Search option')[0], {
      target: { value: 'm' },
    });

    const optionLabels = manyOptions.map(option => option.label);
    const rowLabels = screen
      .getAllByRole('button')
      .map(button => button.textContent)
      .filter((text): text is string => optionLabels.includes(text ?? ''));

    // Desktop menu comes first in the DOM.
    expect(rowLabels.slice(0, 5)).toEqual(['MSFTB', 'MSTRB', 'METAB', 'MRNAB', 'AMDB']);
  });

  it('shows the no results label when nothing matches the query', () => {
    renderMultiSelect(manyOptions);

    openMenu();
    fireEvent.change(screen.getAllByPlaceholderText('Search option')[0], {
      target: { value: 'zzz' },
    });

    expect(screen.getAllByText('No results found')[0]).toBeInTheDocument();
  });

  it('clears the query and selection from the no results reset button', () => {
    const onChange = vi.fn();
    renderComponent(
      <MultiSelect
        options={manyOptions}
        value={['AMDB']}
        onChange={onChange}
        placeholder="All options"
        renderCount={count => `${count} options`}
        title="Select options"
        resetLabel="Reset"
        searchPlaceholder="Search option"
        noResultsLabel="No results found"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'AMDB' }));
    fireEvent.change(screen.getAllByPlaceholderText('Search option')[0], {
      target: { value: 'zzz' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset filters' })[0]);

    expect(onChange).toHaveBeenCalledWith([]);
    expect(screen.getAllByPlaceholderText('Search option')[0]).toHaveValue('');
  });

  it('searches the search text of options whose label is not a string', () => {
    renderComponent(
      <MultiSelect
        options={[
          { value: 'institution', label: <span>Institution</span>, searchText: 'Institution' },
          ...manyOptions,
        ]}
        value={[]}
        onChange={vi.fn()}
        placeholder="All options"
        renderCount={count => `${count} options`}
        title="Select options"
        resetLabel="Reset"
        searchPlaceholder="Search option"
        noResultsLabel="No results found"
      />,
    );

    openMenu();
    fireEvent.change(screen.getAllByPlaceholderText('Search option')[0], {
      target: { value: 'instit' },
    });

    // The desktop menu comes first in the DOM.
    const menu = screen.getAllByText('Institution')[0].closest('.venus-multiselect-menu');

    expect(within(menu as HTMLElement).queryByText('AMDB')).not.toBeInTheDocument();
  });
});
