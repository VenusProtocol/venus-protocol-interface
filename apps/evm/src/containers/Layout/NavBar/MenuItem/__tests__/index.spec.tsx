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
});
