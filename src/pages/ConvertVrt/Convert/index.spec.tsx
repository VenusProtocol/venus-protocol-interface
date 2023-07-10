import { waitFor } from '@testing-library/react';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Convert from '.';

vi.mock('clients/api');

describe('pages/ConvertVRT/Convert', () => {
  it('renders info that the conversion deadline has been reached', async () => {
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          logOut: vi.fn(),
          openAuthModal: vi.fn(),
          closeAuthModal: vi.fn(),
          provider: fakeProvider,
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
