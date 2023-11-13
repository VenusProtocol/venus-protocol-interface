import { waitFor } from '@testing-library/react';
import { en } from 'packages/translations';
import React from 'react';
import { ChainId } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';

import Convert from '.';

describe('pages/ConvertVRT/Convert', () => {
  it('renders info that the conversion deadline has been reached', async () => {
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          logOut: vi.fn(),
          openAuthModal: vi.fn(),
          closeAuthModal: vi.fn(),
          switchChain: vi.fn(),
          provider: fakeProvider,
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert />
      </AuthContext.Provider>,
    );
    const infoMessage = getByText(en.convertVrt.infoConversionCompleted);
    await waitFor(() => expect(infoMessage).toBeVisible());
  });
});
