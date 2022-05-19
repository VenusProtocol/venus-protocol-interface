import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';

import { TokenId } from 'types';
import { useUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import en from 'translation/translations/en.json';
import BorrowRepay from '.';

const asset = assetData[1];

jest.mock('clients/api');

describe('pages/Dashboard/BorrowRepayModal', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimitCents: new BigNumber('111'),
      userTotalBorrowBalanceCents: new BigNumber('91'),
    }));
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <BorrowRepay onClose={jest.fn()} asset={asset} isXvsEnabled />,
    );
    await waitFor(() => expect(getByText(en.borrowRepayModal.borrowTabTitle)));
  });

  it.each(['ust', 'luna'])('does not display borrow tab when asset is %s', async tokenId => {
    const fakeAsset = {
      ...asset,
      id: tokenId as TokenId,
    };

    const { queryByText } = renderComponent(() => (
      <BorrowRepay onClose={jest.fn()} asset={fakeAsset} isXvsEnabled />
    ));

    await waitFor(() => expect(queryByText(en.borrowRepayModal.borrowTabTitle)).toBeNull());
  });
});
