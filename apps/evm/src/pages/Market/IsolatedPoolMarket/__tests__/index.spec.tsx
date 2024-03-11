import { waitFor } from '@testing-library/react';
import type Vi from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { poolData } from '__mocks__/models/pools';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { getVTokenApySimulations, useGetAsset } from 'clients/api';

import IsolatedPoolMarket from '..';
import TEST_IDS from '../../testIds';

describe('IsolatedPoolMarket', () => {
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
  });

  it('renders without crashing', () => {
    renderComponent(<IsolatedPoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}/${poolData[0].comptrollerAddress}`],
      routePath: '/:vTokenAddress/:poolComptrollerAddress',
    });
  });

  it('fetches market details and displays them correctly', async () => {
    const { getByTestId, queryByTestId } = renderComponent(<IsolatedPoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}/${poolData[0].comptrollerAddress}`],
      routePath: '/:vTokenAddress/:poolComptrollerAddress',
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
