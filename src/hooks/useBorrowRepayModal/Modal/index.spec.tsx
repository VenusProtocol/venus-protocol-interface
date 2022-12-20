import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { VToken } from 'types';
import { DISABLED_TOKENS } from 'utilities';

import { assetData } from '__mocks__/models/asset';
import { useGetMainAssets } from 'clients/api';
import { VBEP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import BorrowRepay from '.';

const asset = assetData[1];

jest.mock('clients/api');

describe('hooks/useBorrowRepayModal', () => {
  beforeEach(() => {
    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
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
      <BorrowRepay onClose={jest.fn()} vToken={asset.vToken} />,
    );
    await waitFor(() => expect(getByText(en.borrowRepayModal.borrowTabTitle)));
  });

  it.each(DISABLED_TOKENS)('does not display borrow tab when asset is %s', async token => {
    const fakeVToken: VToken = {
      ...VBEP_TOKENS.xvs, // This doesn't matter, only the underlying token is used
      underlyingToken: token,
    };

    const { queryByText } = renderComponent(() => (
      <BorrowRepay onClose={jest.fn()} vToken={fakeVToken} />
    ));

    await waitFor(() => expect(queryByText(en.borrowRepayModal.borrowTabTitle)).toBeNull());
  });
});
