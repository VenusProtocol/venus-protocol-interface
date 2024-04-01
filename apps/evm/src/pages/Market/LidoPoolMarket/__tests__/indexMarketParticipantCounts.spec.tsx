import { waitFor } from '@testing-library/react';
import type Vi from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { vXvs } from '__mocks__/models/vTokens';
import { getVTokenApySimulations, useGetAsset } from 'clients/api';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import LidoPoolMarket from '..';
import TEST_IDS from '../../testIds';

vi.mock('hooks/useGetChainMetadata');

describe('LidoPoolMarket - Feature flag enabled: marketParticipantCounts', () => {
  beforeEach(() => {
    (useGetChainMetadata as Vi.Mock).mockImplementation(() => CHAIN_METADATA[ChainId.SEPOLIA]);

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
    const { getByTestId, queryByTestId } = renderComponent(<LidoPoolMarket />, {
      routerInitialEntries: [`/${vXvs.address}`],
      routePath: '/:vTokenAddress',
      chainId: ChainId.SEPOLIA,
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
