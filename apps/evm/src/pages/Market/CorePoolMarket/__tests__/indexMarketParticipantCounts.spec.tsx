import { waitFor } from '@testing-library/react';
import type Vi from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { getVTokenApySimulations, useGetAsset } from 'clients/api';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import CorePoolMarket from '..';
import TEST_IDS from '../../testIds';

describe('CorePoolMarket - Feature flag enabled: marketParticipantCounts', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'marketParticipantCounts',
    );

    (useGetAsset as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: assetData[0],
      },
    }));

    (getVTokenApySimulations as Vi.Mock).mockImplementation(() => ({
      apySimulations: vTokenApySimulations,
    }));
  });

  it('fetches market details and displays them correctly', async () => {
    const { getByTestId } = renderComponent(<CorePoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}`],
      routePath: '/:vTokenAddress',
    });

    // Check interest rate model displays correctly
    await waitFor(() =>
      expect(getByTestId(TEST_IDS.interestRateModel).textContent).toMatchSnapshot(),
    );
    // Check supply info displays correctly
    expect(getByTestId(TEST_IDS.supplyInfo).textContent).toMatchSnapshot();
    // Check borrow info displays correctly
    expect(getByTestId(TEST_IDS.borrowInfo).textContent).toMatchSnapshot();
    // Check market info displays correctly
    expect(getByTestId(TEST_IDS.marketInfo).textContent).toMatchSnapshot();
  });
});
