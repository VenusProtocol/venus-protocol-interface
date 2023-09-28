import { MainPoolComptroller, PoolLens, VenusLens } from 'packages/contractsNew';

import fakeMainPoolComptrollerContractResponses from '__mocks__/contracts/mainPoolComptroller';
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

const fakeMainPoolComptrollerContract = {
  getAllMarkets: async () => fakeMainPoolComptrollerContractResponses.getAllMarkets,
} as unknown as MainPoolComptroller;

describe('api/queries/getVTokens', () => {
  it('returns the vTokens on success', async () => {
    const response = await getVTokens({
      tokens,
      venusLensContract: fakeVenusLensContract,
      mainPoolComptrollerContract: fakeMainPoolComptrollerContract,
      poolLensContract: fakePoolLensContract,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
    });

    expect(response).matchSnapshot();
  });

  it('still functions without passing venusLensContract or mainPoolComptrollerContract', async () => {
    const response = await getVTokens({
      tokens,
      poolLensContract: fakePoolLensContract,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
    });

    expect(response).matchSnapshot();
  });
});
