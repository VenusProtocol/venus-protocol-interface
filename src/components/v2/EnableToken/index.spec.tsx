import React from 'react';
import BigNumber from 'bignumber.js';

import { useUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import { TokenId } from 'types';
import EnableToken from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');

const fakeAccountAddress = '0x0';
const fakeAsset = { ...assetData[0], isEnabled: true };
const fakeContent = 'Fake Content';

describe('components/EnableToken', () => {
  it('asks the user to enable token if not enabled', async () => {
    const disabledFakeAsset = { ...fakeAsset, isEnabled: false };
    (useUserMarketInfo as jest.Mock).mockImplementationOnce(() => ({
      assets: [disabledFakeAsset],
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
    const { getByText } = renderComponent(
      <EnableToken
        assetId={disabledFakeAsset.id as TokenId}
        isEnabled={disabledFakeAsset.isEnabled}
        title="Enable token to proceed"
        vtokenAddress={fakeAccountAddress}
        tokenInfo={[]}
      >
        {fakeContent}
      </EnableToken>,
    );
    expect(getByText('Enable token to proceed'));
  });

  it('renders content when token is enabled', async () => {
    const enabledFakeAsset = { ...fakeAsset };
    (useUserMarketInfo as jest.Mock).mockImplementationOnce(() => ({
      assets: [enabledFakeAsset],
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
    const { getByText } = renderComponent(
      <EnableToken
        assetId={enabledFakeAsset.id as TokenId}
        isEnabled={enabledFakeAsset.isEnabled}
        title="Enable token to proceed"
        vtokenAddress={fakeAccountAddress}
        tokenInfo={[]}
      >
        {fakeContent}
      </EnableToken>,
    );
    expect(getByText(fakeContent));
  });
});
