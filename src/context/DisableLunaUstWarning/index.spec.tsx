import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';

import { assetData } from '__mocks__/models/asset';
import { useGetUserMarketInfo } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

jest.mock('clients/api');

describe('context/DisableLunaUstWarning', () => {
  it.each([TOKENS.ust.id, TOKENS.luna.id])(
    'displays warning modal if %s is enabled as collateral',
    async tokenId => {
      const customAssets: Asset[] = [
        ...assetData,
        {
          ...assetData[0],
          id: tokenId as Asset['id'],
          collateral: true,
        },
      ];

      (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
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
    },
  );
});
