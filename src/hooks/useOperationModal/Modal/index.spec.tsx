import { waitFor } from '@testing-library/react';
import React from 'react';
import { Pool } from 'types';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import BorrowRepay from '.';

const fakePool: Pool = poolData[0];
const fakeAsset = fakePool.assets[0];

vi.mock('clients/api');

describe('hooks/useBorrowRepayModal', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <BorrowRepay
        onClose={vi.fn()}
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />,
    );
    await waitFor(() => expect(getByText(en.operationModal.borrowTabTitle)));
  });
});
