import { fireEvent, waitFor } from '@testing-library/react';

import { useGetPool } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import { poolData } from '__mocks__/models/pools';

import YieldPlus from '..';

describe('YieldPlus', () => {
  it('lets user change long and short tokens', async () => {
    vi.mocked(useGetPool).mockReturnValue({
      isLoading: false,
      data: {
        pool: {
          ...poolData[0],
          assets: poolData[0].assets.map(asset => ({
            ...asset,
            disabledTokenActions: [],
          })),
        },
      },
    } as ReturnType<typeof useGetPool>);

    const { getByRole, getByText, getAllByText } = renderComponent(<YieldPlus />);

    await waitFor(() => expect(getByText('BNB/USDT')).toBeInTheDocument());

    fireEvent.click(getByRole('button', { name: /long/i }));
    fireEvent.click(getAllByText('USDC')[0]);

    await waitFor(() => expect(getByText('USDC/USDT')).toBeInTheDocument());

    fireEvent.click(getByRole('button', { name: /short/i }));
    fireEvent.click(getAllByText('BUSD')[0]);

    await waitFor(() => expect(getByText('USDC/BUSD')).toBeInTheDocument());
  });
});
