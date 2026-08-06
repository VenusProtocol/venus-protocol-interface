import { screen } from '@testing-library/react';

import { MAIN_PRODUCTION_HOST } from 'constants/production';
import { renderComponent } from 'testUtils/render';
import { TestEnvWarning } from '..';

describe('TestEnvWarning', () => {
  it('shows the testnet warning in CI testnet config', () => {
    renderComponent(<TestEnvWarning />);

    expect(screen.getByText(/This is a test environment/i)).toBeInTheDocument();
    expect(screen.getByText('Go to the official Venus Protocol website')).toHaveAttribute(
      'href',
      `https://${MAIN_PRODUCTION_HOST}`,
    );
  });
});
