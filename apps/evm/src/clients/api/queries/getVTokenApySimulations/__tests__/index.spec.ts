import type { MulticallParameters, PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';

import { getVTokenApySimulations } from '..';

const fakeInterestRateModelContractAddress = fakeAddress;

const readContractMock = vi.fn(async () => 100000000000000000n);
const multicallMock = vi.fn(async ({ contracts }: MulticallParameters) =>
  contracts.map(c => ({ result: c.functionName === 'getSupplyRate' ? 1000000000n : 2000000000n })),
);

const fakePublicClient = {
  readContract: readContractMock,
  multicall: multicallMock,
} as unknown as PublicClient;

describe('getVTokenApySimulations', () => {
  it('returns the APY simulations in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      publicClient: fakePublicClient,
      interestRateModelContractAddress: fakeInterestRateModelContractAddress,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
      blocksPerDay: 28800,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(multicallMock).toHaveBeenCalledTimes(2);
    expect(response).toMatchSnapshot();
  });

  it('returns the APY simulations of an isolated asset on a chain with block based rates in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      publicClient: fakePublicClient,
      interestRateModelContractAddress: fakeInterestRateModelContractAddress,
      isIsolatedPoolMarket: true,
      asset: assetData[0],
      blocksPerDay: 28800,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(multicallMock).toHaveBeenCalledTimes(2);
    expect(response).toMatchSnapshot();
  });

  it('returns the APY simulations of an isolated asset on a chain with time based rates in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      publicClient: fakePublicClient,
      interestRateModelContractAddress: fakeInterestRateModelContractAddress,
      isIsolatedPoolMarket: true,
      asset: assetData[0],
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(multicallMock).toHaveBeenCalledTimes(2);
    expect(response).toMatchSnapshot();
  });
});
