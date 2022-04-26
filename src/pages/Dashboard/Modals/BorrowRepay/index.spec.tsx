import React from 'react';
import { waitFor } from '@testing-library/react';

import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import en from 'translation/translations/en.json';
import BorrowRepay from '.';

const asset = assetData[1];

jest.mock('clients/api');

describe('pages/Dashboard/SupplyWithdrawModal', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<BorrowRepay onClose={jest.fn()} asset={asset} />);
    await waitFor(() => expect(getByText(en.borrowRepayModal.borrowTabTitle)));
  });
});
