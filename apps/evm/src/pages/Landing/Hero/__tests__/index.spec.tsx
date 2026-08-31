import { renderComponent } from 'testUtils/render';

import { fireEvent } from '@testing-library/react';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import type { Mock } from 'vitest';
import { Hero } from '..';

vi.mock('../Galaxy', () => ({
  Galaxy: () => <div data-testid="hero-galaxy" />,
}));

describe('Hero', () => {
  it('renders correctly', () => {
    const { container } = renderComponent(<Hero />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders borrow tab correctly', () => {
    const { container, getByText } = renderComponent(<Hero />);

    // Click on borrow tab
    fireEvent.click(getByText(en.landing.hero.borrow));

    expect(container.textContent).toMatchSnapshot();
  });

  it('sends the call to action to the liquidity hub when it is enabled', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: { name: string }) => name === 'liquidityHub',
    );

    const { getByText, queryByText } = renderComponent(<Hero />);

    expect(queryByText(en.landing.hero.startNow)).toBeNull();
    expect(getByText(en.landing.hero.earnNow).getAttribute('href')).toContain(
      routes.liquidityHubs.path,
    );
  });

  it('sends the call to action to the core markets when the liquidity hub is disabled', () => {
    const { getByText, queryByText } = renderComponent(<Hero />);

    expect(queryByText(en.landing.hero.earnNow)).toBeNull();
    expect(getByText(en.landing.hero.startNow).getAttribute('href')).toContain(
      routes.markets.path.replace(':poolComptrollerAddress', ''),
    );
  });
});
