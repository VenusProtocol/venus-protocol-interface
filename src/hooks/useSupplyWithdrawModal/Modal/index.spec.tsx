import { waitFor } from '@testing-library/dom';
import React from 'react';
import { Pool, VToken } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
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

  it.each(DISABLED_TOKENS)('does not display supply tab when asset is %s', async token => {
    const customFakeVToken: VToken = {
      ...fakeAsset.vToken,
      underlyingToken: token,
    };

    const { queryByText } = renderComponent(
      () => (
        <SupplyWithdraw
          onClose={jest.fn()}
          vToken={customFakeVToken}
          poolComptrollerAddress={fakePool.comptrollerAddress}
        />
      ),
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => expect(queryByText(en.supplyWithdrawModal.supplyTabTitle)).toBeNull());
  });
});
