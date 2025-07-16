import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { poolData } from '__mocks__/models/pools';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { getVTokenApySimulations, useGetAsset } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import IsolatedPoolMarket from '..';
import TEST_IDS from '../../testIds';

describe('IsolatedPoolMarket - Feature flag enabled: marketParticipantCounts', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'marketParticipantCounts',
    );

    (useGetAsset as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: assetData[0],
      },
    }));

    (getVTokenApySimulations as Mock).mockImplementation(() => ({
      apySimulations: vTokenApySimulations,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<IsolatedPoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}/${poolData[0].comptrollerAddress}`],
      routePath: '/:vTokenAddress/:poolComptrollerAddress',
    });
  });

  it('fetches market details and displays them correctly', async () => {
    const { getByTestId } = renderComponent(<IsolatedPoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}/${poolData[0].comptrollerAddress}`],
      routePath: '/:vTokenAddress/:poolComptrollerAddress',
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.interestRateModel)).toBeInTheDocument());

    // Check interest rate model displays correctly
    expect(getByTestId(TEST_IDS.interestRateModel).textContent).toMatchSnapshot();
    // Check supply info displays correctly
    expect(getByTestId(TEST_IDS.supplyInfo).textContent).toMatchSnapshot();
    // Check borrow info displays correctly
    expect(getByTestId(TEST_IDS.borrowInfo).textContent).toMatchSnapshot();
    // Check market info displays correctly
    expect(getByTestId(TEST_IDS.marketInfo).textContent).toMatchSnapshot();
  });
});
