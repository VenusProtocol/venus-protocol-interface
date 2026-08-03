import { screen } from '@testing-library/react';

import { VENUS_DOC_URL } from 'constants/production';
import { routes } from 'constants/routing';
import { renderComponent } from 'testUtils/render';
import { Footer } from '..';

describe('Footer', () => {
  it('renders footer links', () => {
    renderComponent(<Footer />);

    expect(screen.getByText('Documentation')).toHaveAttribute('href', VENUS_DOC_URL);
    expect(screen.getByText('Agent skills')).toHaveAttribute(
      'href',
      expect.stringContaining(routes.skills.path),
    );
    expect(screen.getByText('Privacy policy')).toHaveAttribute(
      'href',
      expect.stringContaining(routes.privacyPolicy.path),
    );
    expect(screen.getByText('Terms of use')).toHaveAttribute(
      'href',
      expect.stringContaining(routes.termsOfUse.path),
    );
  });
});
