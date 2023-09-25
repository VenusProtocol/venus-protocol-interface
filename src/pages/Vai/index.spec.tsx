import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Vai from '.';

describe('pages/Dashboard/Vai', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<Vai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => getByText(en.vai.tabMint));
  });

  it('renders mint tab by default and lets user switch to repay tab', async () => {
    const { getByText } = renderComponent(<Vai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check mint tab is displayed by default
    await waitFor(() => getByText(en.vai.mintVai.submitButtonLabel));

    // Click on "Repay VAI" tab
    const repayVaiTabButton = getByText(en.vai.tabRepay).closest('button') as HTMLButtonElement;
    fireEvent.click(repayVaiTabButton);

    // Check repay tab is now displaying
    await waitFor(() => getByText(en.vai.repayVai.submitButtonLabel));
  });
});
