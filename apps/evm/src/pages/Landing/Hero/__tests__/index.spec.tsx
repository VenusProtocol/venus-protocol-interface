import { renderComponent } from 'testUtils/render';

import { fireEvent } from '@testing-library/react';
import { en } from 'libs/translations';
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
});
