import { LegacyPoolComptroller, PoolLens, VenusLens } from 'libs/contracts';

import fakeLegacyPoolComptrollerContractResponses from '__mocks__/contracts/legacyPoolComptroller';
import fakePoolLensContractResponses from '__mocks__/contracts/poolLens';
import fakeVenusLensContractResponses from '__mocks__/contracts/venusLens';
import fakePoolRegistryContractAddress from '__mocks__/models/address';
import tokens from '__mocks__/models/tokens';

import getVTokens from '..';

const fakePoolLensContract = {
  getAllPools: async () => fakePoolLensContractResponses.getAllPools,
} as unknown as PoolLens;

const fakeVenusLensContract = {
  callStatic: {
    vTokenMetadataAll: async () => fakeVenusLensContractResponses.vTokenMetadataAll,
  },
} as unknown as VenusLens;

const fakeLegacyPoolComptrollerContract = {
  getAllMarkets: async () => fakeLegacyPoolComptrollerContractResponses.getAllMarkets,
} as unknown as LegacyPoolComptroller;

describe('api/queries/getVTokens', () => {
  it('returns the vTokens on success', async () => {
    const response = await getVTokens({
      tokens,
      venusLensContract: fakeVenusLensContract,
      legacyPoolComptrollerContract: fakeLegacyPoolComptrollerContract,
      poolLensContract: fakePoolLensContract,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
    });

    expect(response).matchSnapshot();
  });

  it('still functions without passing venusLensContract or legacyPoolComptrollerContract', async () => {
    const response = await getVTokens({
      tokens,
      poolLensContract: fakePoolLensContract,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
    });

    expect(response).matchSnapshot();
  });
});
