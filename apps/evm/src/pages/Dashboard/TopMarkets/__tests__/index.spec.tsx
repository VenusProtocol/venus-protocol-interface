import { fireEvent, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import { TopMarkets } from '..';

describe('TopMarkets', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));
  });

  it('shows top supply markets by default', async () => {
    const { container } = renderComponent(<TopMarkets />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));

    expect(container.textContent).toMatchSnapshot();
  });

  it('shows top borrow markets when selecting borrow tab', async () => {
    const { container, queryAllByRole } = renderComponent(<TopMarkets />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));

    const buttons = queryAllByRole('button');

    // Click on "Borrow" tab
    fireEvent.click(buttons[1]);

    expect(container.textContent).toMatchSnapshot();
  });
});
