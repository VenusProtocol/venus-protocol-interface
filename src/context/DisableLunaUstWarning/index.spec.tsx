import { waitFor } from '@testing-library/react';
import React from 'react';
import { Pool } from 'types';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetMainPool } from 'clients/api';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

describe('context/DisableLunaUstWarning', () => {
  it.each([
    TESTNET_VBEP_TOKENS['0xf206af85bc2761c4f876d27bd474681cfb335efa'],
    TESTNET_VBEP_TOKENS['0x9c3015191d39cf1930f92eb7e7bcbd020bca286a'],
  ])('displays warning modal if %s is enabled as collateral', async vToken => {
    const customPool: Pool = {
      ...poolData[0],
      assets: [
        {
          ...poolData[0].assets[0],
          vToken,
          isCollateralOfUser: true,
        },
      ],
    };

    (useGetMainPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: customPool,
      },
      isLoading: false,
    }));

    // We render a fragment because the DisableLunaUstWarning provider is
    // already added to the DOM by the renderComponent function
    const { getByText } = renderComponent(<></>);

    await waitFor(() => expect(getByText(en.lunaUstWarningModal.title)));
  });
});
