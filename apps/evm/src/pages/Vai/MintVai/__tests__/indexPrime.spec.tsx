import { waitFor } from '@testing-library/dom';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { useGetPrimeToken } from 'clients/api';
import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'packages/translations';

import MintVai from '..';
import TEST_IDS from '../../testIds';

describe('MintVai - Feature enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime' || name === 'vaiMintPrimeOnlyWarning',
    );
  });

  it('hides the form and displays a warning if user does not have a Prime token', async () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
      },
    }));

    const { getByTestId, queryByText } = renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.primeOnlyWarning)));
    expect(queryByText(en.vai.mintVai.walletBalance)).toBeNull();
  });

  it('shows the form when user has a Prime token', async () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: true,
      },
    }));

    const { queryByText } = renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(queryByText(en.vai.mintVai.walletBalance)).toBeNull());
  });
});
