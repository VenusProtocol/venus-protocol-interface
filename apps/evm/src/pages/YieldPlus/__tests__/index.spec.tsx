import { fireEvent, waitFor } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import YieldPlus from '..';

describe('YieldPlus', () => {
  it('lets user change long and short tokens', async () => {
    const { getByRole, getByText, getAllByText } = renderComponent(<YieldPlus />);

    await waitFor(() => expect(getByText('BNB/USDT')).toBeInTheDocument());

    fireEvent.click(getByRole('button', { name: /long/i }));
    fireEvent.click(getAllByText('XVS')[0]);

    await waitFor(() => expect(getByText('BNB/XVS')).toBeInTheDocument());

    fireEvent.click(getByRole('button', { name: /short/i }));
    fireEvent.click(getAllByText('USDT')[0]);

    await waitFor(() => expect(getByText('USDT/XVS')).toBeInTheDocument());
  });
});
