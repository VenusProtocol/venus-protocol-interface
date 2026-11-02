import type { PublicClient } from 'viem';

import fakeAccountAddress, { altAddress } from '__mocks__/models/address';

import { getUserPrimeApys } from '..';

const workingVTokenAddress = '0x1000000000000000000000000000000000000001';
const failingVTokenAddress = '0x1000000000000000000000000000000000000002';

describe('getUserPrimeApys', () => {
  it('keeps the other markets when the Prime APR of one market cannot be read', async () => {
    const publicClient = {
      readContract: vi.fn(async ({ args }: { args: readonly string[] }) => {
        if (args[0] === failingVTokenAddress) {
          throw new Error('arithmetic underflow or overflow');
        }

        return { supplyAPR: 1000n, borrowAPR: 0n };
      }),
    } as unknown as PublicClient;

    const { userPrimeApyMap } = await getUserPrimeApys({
      publicClient,
      primeContractAddress: altAddress,
      accountAddress: fakeAccountAddress,
      primeVTokenAddresses: [workingVTokenAddress, failingVTokenAddress],
      primeVersion: 2,
    });

    expect(userPrimeApyMap.has(workingVTokenAddress)).toBe(true);
    expect(userPrimeApyMap.has(failingVTokenAddress)).toBe(false);
  });
});
