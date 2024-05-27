import { waitFor } from '@testing-library/react';
import type Vi from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import {
  getVTokenApySimulations,
  useGetAsset,
  useGetIsolatedPoolVTokenLiquidationThreshold,
  useGetPoolLiquidationIncentive,
} from 'clients/api';

import CorePoolMarket from '..';
import TEST_IDS from '../../testIds';

describe('CorePoolMarket', () => {
  beforeEach(() => {
    (useGetAsset as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: assetData[0],
      },
    }));

    (getVTokenApySimulations as Vi.Mock).mockImplementation(() => ({
      apySimulations: vTokenApySimulations,
    }));

    (useGetPoolLiquidationIncentive as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        liquidationIncentivePercentage: 10,
      },
    }));

    (useGetIsolatedPoolVTokenLiquidationThreshold as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        liquidationThresholdPercentage: 80,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<CorePoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}`],
      routePath: '/:vTokenAddress',
    });
  });

  it('fetches market details and displays them correctly', async () => {
    const { getByTestId, queryByTestId } = renderComponent(<CorePoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}`],
      routePath: '/:vTokenAddress',
    });

    // Check interest rate model displays correctly
    await waitFor(() =>
      expect(getByTestId(TEST_IDS.interestRateModel).textContent).toMatchSnapshot(),
    );
    // Check supply info is not displayed
    expect(queryByTestId(TEST_IDS.supplyInfo)).toBeNull();
    // Check borrow info is not displayed
    expect(queryByTestId(TEST_IDS.borrowInfo)).toBeNull();
    // Check market info displays correctly
    expect(getByTestId(TEST_IDS.marketInfo).textContent).toMatchSnapshot();
  });
});
