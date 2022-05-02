import React from 'react';
import BigNumber from 'bignumber.js';

import { useUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import en from 'translation/translations/en.json';
import { TokenId } from 'types';
import EnableToken from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');

const fakeAccountAddress = '0x0';
const fakeAsset = { ...assetData[0], isEnabled: true };

describe('pages/Dashboard/MintRepayVai/MintVai', () => {
  it('asks the user to enable token if not enabled', async () => {
    const disabledFakeAsset = { ...fakeAsset, isEnabled: false };
    (useUserMarketInfo as jest.Mock).mockImplementationOnce(() => ({
      assets: [disabledFakeAsset],
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAccountAddress,
          },
        }}
      >
        <EnableToken
          assetId={disabledFakeAsset.id as TokenId}
          symbol={disabledFakeAsset.symbol}
          isEnabled={disabledFakeAsset.isEnabled}
          title="Enable token to proceed"
          vtokenAddress={fakeAccountAddress}
          tokenInfo={[]}
        >
          Content
        </EnableToken>
      </AuthContext.Provider>,
    );
    const enableToMintText = en.mintRepayVai.mintVai.enableToken;
    const enableTextSupply = getByText(enableToMintText);
    expect(enableTextSupply).toHaveTextContent(enableToMintText);
  });

  it('renders content when token is enabled', async () => {
    const enabledFakeAsset = { ...fakeAsset };
    (useUserMarketInfo as jest.Mock).mockImplementationOnce(() => ({
      assets: [enabledFakeAsset],
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAccountAddress,
          },
        }}
      >
        <EnableToken
          assetId={enabledFakeAsset.id as TokenId}
          symbol={enabledFakeAsset.symbol}
          isEnabled={enabledFakeAsset.isEnabled}
          title="Enable token to proceed"
          vtokenAddress={fakeAccountAddress}
          tokenInfo={[]}
        >
          Content
        </EnableToken>
      </AuthContext.Provider>,
    );
    const enableToMintText = en.mintRepayVai.mintVai.enableToken;
    const enableTextSupply = getByText(enableToMintText);
    expect(enableTextSupply).toHaveTextContent(enableToMintText);
  });
});
