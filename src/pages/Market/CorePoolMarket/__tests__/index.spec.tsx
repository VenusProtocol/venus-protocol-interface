import { waitFor } from '@testing-library/react';
import React from 'react';
import Vi from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { marketSnapshots } from '__mocks__/models/marketSnapshots';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { getMarketHistory, getVTokenApySimulations, useGetAsset } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import CorePoolMarket from '..';
import TEST_IDS from '../../testIds';

describe('pages/Market/CorePoolMarket', () => {
  beforeEach(() => {
    (useGetAsset as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: assetData[0],
      },
    }));

    (getMarketHistory as Vi.Mock).mockImplementation(() => ({
      marketSnapshots,
    }));

    (getVTokenApySimulations as Vi.Mock).mockImplementation(() => ({
      apySimulations: vTokenApySimulations,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<CorePoolMarket />, {
      routerOpts: {
        routerInitialEntries: [`/${vXvs.address}`],
        routePath: '/:vTokenAddress',
      },
    });
  });

  it('fetches market details and displays them correctly', async () => {
    const { getByTestId } = renderComponent(<CorePoolMarket />, {
      routerOpts: {
        routerInitialEntries: [`/${vXvs.address}`],
        routePath: '/:vTokenAddress',
      },
    });

    // Check supply info displays correctly
    await waitFor(() => expect(getByTestId(TEST_IDS.supplyInfo).textContent).toMatchSnapshot());
    // Check borrow info displays correctly
    expect(getByTestId(TEST_IDS.borrowInfo).textContent).toMatchSnapshot();
    // Check interest rate model displays correctly
    expect(getByTestId(TEST_IDS.interestRateModel).textContent).toMatchSnapshot();
    // Check market info displays correctly
    expect(getByTestId(TEST_IDS.marketInfo).textContent).toMatchSnapshot();
  });
});
