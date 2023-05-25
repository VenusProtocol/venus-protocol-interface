import { waitFor } from '@testing-library/react';
import React from 'react';
import { Pool, VToken } from 'types';

import { poolData } from '__mocks__/models/pools';
import { DISABLED_TOKENS } from 'constants/disabledTokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import BorrowRepay from '.';

const fakePool: Pool = poolData[0];
const fakeAsset = fakePool.assets[0];

jest.mock('clients/api');

describe('hooks/useBorrowRepayModal', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <BorrowRepay
        onClose={jest.fn()}
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />,
    );
    await waitFor(() => expect(getByText(en.operationModal.borrowTabTitle)));
  });

  it.each(DISABLED_TOKENS)('disables correct tabs when asset is %s', async disabledToken => {
    const fakeVToken: VToken = {
      ...fakeAsset.vToken,
      underlyingToken: disabledToken.token,
    };

    const { queryByText } = renderComponent(() => (
      <BorrowRepay
        onClose={jest.fn()}
        vToken={fakeVToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />
    ));

    if (disabledToken.disabledActions.includes('borrow')) {
      await waitFor(() => expect(queryByText(en.operationModal.borrowTabTitle)).toBeNull());
    } else {
      await waitFor(() => expect(queryByText(en.operationModal.borrowTabTitle)).toBeTruthy());
    }

    if (disabledToken.disabledActions.includes('repay')) {
      await waitFor(() => expect(queryByText(en.operationModal.repayTabTitle)).toBeNull());
    } else {
      await waitFor(() => expect(queryByText(en.operationModal.repayTabTitle)).toBeTruthy());
    }

    if (disabledToken.disabledActions.includes('supply')) {
      await waitFor(() => expect(queryByText(en.operationModal.supplyTabTitle)).toBeNull());
    } else {
      await waitFor(() => expect(queryByText(en.operationModal.supplyTabTitle)).toBeTruthy());
    }

    if (disabledToken.disabledActions.includes('withdraw')) {
      await waitFor(() => expect(queryByText(en.operationModal.withdrawTabTitle)).toBeNull());
    } else {
      await waitFor(() => expect(queryByText(en.operationModal.withdrawTabTitle)).toBeTruthy());
    }
  });
});
