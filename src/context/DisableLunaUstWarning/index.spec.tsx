import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';

import { assetData } from '__mocks__/models/asset';
import { useGetMainAssets } from 'clients/api';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

vi.mock('clients/api');

describe('context/DisableLunaUstWarning', () => {
  it.each([
    TESTNET_VBEP_TOKENS['0xf206af85bc2761c4f876d27bd474681cfb335efa'],
    TESTNET_VBEP_TOKENS['0x9c3015191d39cf1930f92eb7e7bcbd020bca286a'],
  ])('displays warning modal if %s is enabled as collateral', async vToken => {
    const customAssets: Asset[] = [
      ...assetData,
      {
        ...assetData[0],
        vToken,
        isCollateralOfUser: true,
      },
    ];

    (useGetMainAssets as vi.Mock).mockImplementation(() => ({
      data: {
        assets: customAssets,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
      },
      isLoading: false,
    }));

    // We render a fragment because the DisableLunaUstWarning provider is
    // already added to the DOM by the renderComponent function
    const { getByText } = renderComponent(<></>);

    await waitFor(() => expect(getByText(en.lunaUstWarningModal.title)));
  });
});
