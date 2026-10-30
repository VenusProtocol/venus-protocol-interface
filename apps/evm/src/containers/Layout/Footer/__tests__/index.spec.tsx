import { screen } from '@testing-library/react';

import {
  VENUS_COMMUNITY_URL,
  VENUS_DOC_URL,
  VENUS_FLUX_URL,
  VENUS_GITHUB_URL,
  VENUS_TELEGRAM_URL,
  VENUS_X_URL,
} from 'constants/production';
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

  it('points each social icon at its own destination', () => {
    const { container } = renderComponent(<Footer />);

    const hrefs = Array.from(container.querySelectorAll('footer a:has(svg)')).map(link =>
      link.getAttribute('href'),
    );

    expect(hrefs).toEqual([
      VENUS_COMMUNITY_URL,
      VENUS_TELEGRAM_URL,
      VENUS_X_URL,
      VENUS_GITHUB_URL,
    ]);
    expect(hrefs).not.toContain(VENUS_FLUX_URL);
    expect(hrefs.some(href => href?.includes('discord'))).toBe(false);
  });
});
