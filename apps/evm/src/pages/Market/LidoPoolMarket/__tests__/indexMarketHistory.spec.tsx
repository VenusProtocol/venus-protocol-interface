import { waitFor } from '@testing-library/react';
import type Vi from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { marketSnapshots } from '__mocks__/models/marketSnapshots';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { getMarketHistory, getVTokenApySimulations, useGetAsset } from 'clients/api';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import LidoPoolMarket from '..';
import TEST_IDS from '../../testIds';

vi.mock('hooks/useGetChainMetadata');

describe('LidoPoolMarket - Feature flag enabled: marketHistory', () => {
  beforeEach(() => {
    (useGetChainMetadata as Vi.Mock).mockImplementation(() => CHAIN_METADATA[ChainId.SEPOLIA]);

    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'marketHistory',
    );

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

  it('fetches market details and displays them correctly', async () => {
    const { getByTestId } = renderComponent(<LidoPoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}`],
      routePath: '/:vTokenAddress',
      chainId: ChainId.SEPOLIA,
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
