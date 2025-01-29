import type { Mock } from 'vitest';

import { renderComponent } from 'testUtils/render';

import { useGetPrimeToken } from 'clients/api';

import { Banner } from '..';

describe('Banner', () => {
  beforeEach(() => {
    (useGetPrimeToken as Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Banner />);
  });
});
