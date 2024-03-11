import { waitFor } from '@testing-library/react';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';
import type { Pool } from 'types';

import BorrowRepay from '.';

const fakePool: Pool = poolData[0];
const fakeAsset = fakePool.assets[0];

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
