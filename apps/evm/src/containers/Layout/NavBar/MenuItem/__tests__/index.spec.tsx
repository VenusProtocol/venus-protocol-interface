import { fireEvent } from '@testing-library/react';
import { renderComponent } from 'testUtils/render';

import { MenuItem } from '..';

const externalLinkIconSelector = 'svg path[d="M3 3H9V9"]';

describe('MenuItem', () => {
  it('marks a link to another site with the external link icon', () => {
    const { container, getByRole } = renderComponent(
      <MenuItem item={{ label: 'Flux', href: 'https://flux.venus.io' }} onClick={vi.fn()} />,
    );

    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(container.querySelector(externalLinkIconSelector)).not.toBeNull();
  });

  it('shows no external link icon on an in-app link', () => {
    const { container } = renderComponent(
      <MenuItem item={{ label: 'Prime', to: '/prime' }} onClick={vi.fn()} />,
    );

    expect(container.querySelector(externalLinkIconSelector)).toBeNull();
  });

  it('exposes the submenu open state so the tag effect also plays while it is expanded', () => {
    const { getAllByRole } = renderComponent(
      <MenuItem
        item={{
          label: 'Earn',
          tagLabel: '3.74%',
          items: [{ to: '/vaults', label: 'Venus Vault' }],
        }}
        onClick={vi.fn()}
      />,
    );

    const [accordionTrigger, dropdownTrigger] = getAllByRole('button', { name: /Earn/ });

    expect(accordionTrigger).toHaveAttribute('data-nav-item');
    expect(dropdownTrigger).toHaveAttribute('data-nav-item');
    expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'false');

    const initialExpandedState = accordionTrigger.getAttribute('aria-expanded');
    fireEvent.click(accordionTrigger);

    expect(accordionTrigger).toHaveAttribute(
      'aria-expanded',
      String(initialExpandedState !== 'true'),
    );
  });
});
