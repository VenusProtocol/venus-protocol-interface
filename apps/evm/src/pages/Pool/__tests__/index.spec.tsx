import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { waitFor } from '@testing-library/react';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import type { Pool } from 'types';
import PoolPage from '..';

const customFakePool: Pool = {
  ...poolData[0],
  eModeGroups: [],
  userEModeGroup: undefined,
};

describe('Pool', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));
  });

  it('renders correctly', async () => {
    const { container } = renderComponent(<PoolPage />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));

    expect(container.textContent).toMatchSnapshot();
  });
});
