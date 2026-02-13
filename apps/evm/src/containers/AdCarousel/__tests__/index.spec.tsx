import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import { AdCarousel } from '..';
import { store } from '../store';

describe('AdCarousel', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => true);
  });

  it('displays correctly', () => {
    const { container } = renderComponent(<AdCarousel />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays nothing if user previously hid the carousel', () => {
    store.getState().hideAdCarousel();

    const { container } = renderComponent(<AdCarousel />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('hide banners if user hides it', () => {
    const { container } = renderComponent(<AdCarousel />);

    fireEvent.click(screen.getByRole('button'));

    expect(store.getState().doNotShowAdCarousel).toBe(true);
    expect(container.textContent).toMatchSnapshot();
  });
});
