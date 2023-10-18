import { waitFor } from '@testing-library/react';
import { Pool } from 'types';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { vLuna, vUst } from '__mocks__/models/vTokens';
import { useGetMainPool } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

describe('context/DisableLunaUstWarning', () => {
  it.each([vUst, vLuna])('displays warning modal if %s is enabled as collateral', async vToken => {
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
