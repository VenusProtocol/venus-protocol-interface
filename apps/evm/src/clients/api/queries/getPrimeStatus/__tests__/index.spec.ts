import type { Address, PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';
import { NULL_ADDRESS } from 'constants/address';

import getPrimeStatus from '..';

const mockPeriodInSeconds = 600n;
const mockMinimumStakedXvs = 1000n;
const mockMaximumStakedXvs = 10000n;
const tokenLimit = 1000n;
const claimedTokens = 300n;
const mockXvsVaultPoolId = 1n;
const mockPrimeMarkets: Address[] = [];
const mockXvsVault = '0x1000000000000000000000000000000000000000';
const mockRewardTokenAddress = '0x2000000000000000000000000000000000000000';
const fakePrimeContractAddress = '0x3000000000000000000000000000000000000000';

describe('getPrimeStatus', () => {
  it('returns the data describing the status of the Prime contract', async () => {
    const fakePublicClient = {
      multicall: vi.fn(async () => [
        { result: mockPeriodInSeconds },
        { result: mockMaximumStakedXvs },
        { result: mockMinimumStakedXvs },
        { result: claimedTokens },
        { result: tokenLimit },
        { result: mockPrimeMarkets },
        { result: mockXvsVault },
        { result: mockXvsVaultPoolId },
        { result: mockRewardTokenAddress },
        { result: mockPeriodInSeconds },
      ]),
    } as unknown as PublicClient;

    const response = await getPrimeStatus({
      accountAddress: fakeAccountAddress,
      primeContractAddress: fakePrimeContractAddress,
      publicClient: fakePublicClient,
    });

    expect(fakePublicClient.multicall).toHaveBeenCalledTimes(1);
    expect(fakePublicClient.multicall).toHaveBeenCalledWith({
      contracts: expect.arrayContaining([
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'STAKING_PERIOD',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'MAXIMUM_XVS_CAP',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'MINIMUM_STAKED_XVS',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'totalRevocable',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'revocableLimit',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'getAllMarkets',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'xvsVault',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'xvsVaultPoolId',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'xvsVaultRewardToken',
        }),
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'claimTimeRemaining',
          args: [fakeAccountAddress],
        }),
      ]),
    });

    expect(response).toMatchSnapshot();
  });

  it('uses NULL_ADDRESS when no account address is provided', async () => {
    const fakePublicClient = {
      multicall: vi.fn(async () => [
        { result: mockPeriodInSeconds },
        { result: mockMaximumStakedXvs },
        { result: mockMinimumStakedXvs },
        { result: claimedTokens },
        { result: tokenLimit },
        { result: mockPrimeMarkets },
        { result: mockXvsVault },
        { result: mockXvsVaultPoolId },
        { result: mockRewardTokenAddress },
        { result: mockPeriodInSeconds },
      ]),
    } as unknown as PublicClient;

    await getPrimeStatus({
      primeContractAddress: fakePrimeContractAddress,
      publicClient: fakePublicClient,
    });

    expect(fakePublicClient.multicall).toHaveBeenCalledWith({
      contracts: expect.arrayContaining([
        expect.objectContaining({
          address: fakePrimeContractAddress,
          functionName: 'claimTimeRemaining',
          args: [NULL_ADDRESS],
        }),
      ]),
    });
  });
});
