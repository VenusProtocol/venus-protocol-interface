import { waitFor } from '@testing-library/react';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Convert from '.';

jest.mock('clients/api');

describe('pages/ConvertVRT/Convert', () => {
  it('renders info that the conversion deadline has been reached', async () => {
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          status: 'connected',
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
