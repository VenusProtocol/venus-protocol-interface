import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { convertTokensToWei } from 'utilities';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAccountAddress from '__mocks__/models/address';
import { getVaiCalculateRepayAmount } from 'clients/api';
import formatToOutput from 'clients/api/queries/getVaiCalculateRepayAmount/formatToOutput';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Vai from '.';

jest.mock('clients/api');

describe('pages/Dashboard/Vai', () => {
  beforeEach(() => {
    (getVaiCalculateRepayAmount as jest.Mock).mockImplementation(() =>
      formatToOutput({
        repayAmountWei: convertTokensToWei({
          value: new BigNumber(0),
          token: TOKENS.vai,
        }),
        contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayInterests,
      }),
    );
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(() => <Vai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => getByText(en.vai.tabMint));
  });

  it('renders mint tab by default and lets user switch to repay tab', async () => {
    const { getByText } = renderComponent(() => <Vai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check mint tab is display by default
    await waitFor(() => getByText(en.vai.mintVai.enableToken));

    // Click on "Repay VAI" tab
    const repayVaiTabButton = getByText(en.vai.tabRepay).closest('button') as HTMLButtonElement;
    fireEvent.click(repayVaiTabButton);

    // Check repay tab is now displaying
    await waitFor(() => getByText(en.vai.repayVai.enableToken));
  });
});
