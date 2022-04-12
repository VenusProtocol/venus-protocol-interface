import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react';

import renderComponent from 'testUtils/renderComponent';
import MintRepayVai from '.';

jest.mock('clients/api');

describe('pages/Dashboard/MintRepayVai', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<MintRepayVai />);
    await waitFor(() => getByText('Mint/Repay VAI'));
  });

  it('renders mint tab by default and lets user switch to repay tab', async () => {
    const { getByText } = renderComponent(<MintRepayVai />);

    // Check mint tab is display by default
    await waitFor(() => getByText('Available VAI limit'));

    // Click on "Repay VAI" tab
    const repayVaiTabButton = getByText('Repay VAI').closest('button') as HTMLButtonElement;
    fireEvent.click(repayVaiTabButton);

    // Check repay tab is now displaying
    await waitFor(() => getByText('Repay VAI balance'));
  });
});
