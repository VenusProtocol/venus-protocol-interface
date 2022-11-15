import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { DISABLED_TOKENS } from 'utilities';

import { assetData } from '__mocks__/models/asset';
import { useGetUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import BorrowRepay from '.';

const asset = assetData[1];

jest.mock('clients/api');

describe('hooks/useBorrowRepayModal', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <BorrowRepay onClose={jest.fn()} asset={asset} includeXvs />,
    );
    await waitFor(() => expect(getByText(en.borrowRepayModal.borrowTabTitle)));
  });

  it.each(DISABLED_TOKENS)('does not display borrow tab when asset is %s', async token => {
    const fakeAsset = {
      ...asset,
      token,
    };

    const { queryByText } = renderComponent(() => (
      <BorrowRepay onClose={jest.fn()} asset={fakeAsset} includeXvs />
    ));

    await waitFor(() => expect(queryByText(en.borrowRepayModal.borrowTabTitle)).toBeNull());
  });
});
