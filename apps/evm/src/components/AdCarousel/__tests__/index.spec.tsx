import type { Mock } from 'vitest';

import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import { AdCarousel } from '..';

describe('AdCarousel', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => true);
  });

  it('displays correctly', () => {
    const { container } = renderComponent(<AdCarousel />);

    expect(container.textContent).toMatchSnapshot();
  });
});
