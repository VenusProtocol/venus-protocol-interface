import { renderComponent } from 'testUtils/render';

import { MenuIcon } from '..';

describe('MenuIcon', () => {
  it.each(['core', 'liquidityHub', 'vault', 'spoke'] as const)(
    'keeps the animated parts of the %s icon free of a transform attribute, so they stay in place',
    name => {
      const { container } = renderComponent(<MenuIcon name={name} />);
      const animatedParts = container.querySelectorAll('[data-nav-part]');

      expect(animatedParts.length).toBeGreaterThan(0);
      animatedParts.forEach(part => expect(part).not.toHaveAttribute('transform'));
    },
  );
});
