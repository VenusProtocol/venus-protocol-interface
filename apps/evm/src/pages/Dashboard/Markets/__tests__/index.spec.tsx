import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { Markets } from '..';

vi.mock('hooks/useCollateral');

describe('Markets', () => {
  it('shows the placeholder when the user has no positions', () => {
    const emptyPool: Pool = {
      ...poolData[0],
      userSupplyBalanceCents: new BigNumber(0),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: emptyPool,
      },
    }));

    const { container } = renderComponent(<Markets />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('shows the markets tabs when the user has positions', async () => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));

    const user = userEvent.setup();
    const { container } = renderComponent(<Markets />);

    await waitFor(() => expect(screen.getByText(en.dashboard.markets.title)).toBeInTheDocument());

    expect(container.textContent).toMatchSnapshot();

    // Go to Borrow tab
    await user.click(screen.getByRole('button', { name: en.dashboard.markets.borrowTabTitle }));

    expect(container.textContent).toContain('40 USDT');
  });
});
