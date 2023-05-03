import { waitFor } from '@testing-library/react';
import React from 'react';
import { Pool, VToken } from 'types';

import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { DISABLED_TOKENS } from 'constants/disabledTokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import SupplyWithdraw from '.';

const fakePool: Pool = poolData[0];
const fakeAsset = fakePool.assets[0];

jest.mock('clients/api');

describe('hooks/useSupplyWithdrawModal', () => {
  beforeEach(() => {
    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: fakePool,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(() => (
      <SupplyWithdraw
        onClose={jest.fn()}
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />
    ));
  });

  it.each(DISABLED_TOKENS)(
    'does not display supply or/and withdraw tabs when asset is %o',
    async disabledToken => {
      const fakeVToken: VToken = {
        ...fakeAsset.vToken,
        underlyingToken: disabledToken.token,
      };

      const { queryByText } = renderComponent(() => (
        <SupplyWithdraw
          onClose={jest.fn()}
          vToken={fakeVToken}
          poolComptrollerAddress={fakePool.comptrollerAddress}
        />
      ));

      if (disabledToken.disabledActions.includes('supply')) {
        await waitFor(() => expect(queryByText(en.supplyWithdrawModal.supplyTabTitle)).toBeNull());
      } else {
        await waitFor(() =>
          expect(queryByText(en.supplyWithdrawModal.supplyTabTitle)).toBeTruthy(),
        );
      }

      if (disabledToken.disabledActions.includes('withdraw')) {
        await waitFor(() =>
          expect(queryByText(en.supplyWithdrawModal.withdrawTabTitle)).toBeNull(),
        );
      } else {
        await waitFor(() =>
          expect(queryByText(en.supplyWithdrawModal.withdrawTabTitle)).toBeTruthy(),
        );
      }
    },
  );
});
