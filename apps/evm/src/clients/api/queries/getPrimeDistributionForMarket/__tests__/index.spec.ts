import type { PublicClient } from 'viem';

import { vUsdt } from '__mocks__/models/vTokens';

import getPrimeDistributionForMarket from '..';

vi.mock('libs/contracts');

describe('getPrimeDistributionForMarket', () => {
  it('returns the amount of rewards distributed for a given market', async () => {
    const rewards = '1000000000';
    const fakePrimeContractAddress = '0x00000000000000000000000000000000PrImE';

    const readContractMock = vi.fn(async () => BigInt(rewards));

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getPrimeDistributionForMarket({
      vTokenAddress: vUsdt.address,
      primeContractAddress: fakePrimeContractAddress as `0x${string}`,
      publicClient: fakePublicClient,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakePrimeContractAddress,
      abi: expect.any(Object),
      functionName: 'incomeDistributionYearly',
      args: [vUsdt.address],
    });
    expect(response).toMatchSnapshot();
  });
});
