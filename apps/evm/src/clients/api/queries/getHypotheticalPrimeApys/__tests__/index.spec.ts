import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';
import { vXvs } from '__mocks__/models/vTokens';

import getHypotheticalPrimeApys from '..';

describe('getHypotheticalPrimeApys', () => {
  test('returns the simulated Prime APYs on success', async () => {
    const fakePrimeContractAddress = '0x00000000000000000000000000000000PrImE';
    const fakeBorrowAprPercentage = 34n;
    const fakeSupplyAprPercentage = 26n;
    const fakeUserBorrowBalanceMantissa = new BigNumber('100000000000000000000');
    const fakeUserSupplyBalanceMantissa = new BigNumber('200000000000000000000');
    const fakeUserXvsStakedMantissa = new BigNumber('1000000000000000000000');
    const fakeCappedSupply = 200000000000000000000n;
    const fakeCappedBorrow = 100000000000000000000n;
    const fakeBorrowCapUsd = 200000000000000000000n;
    const fakeSupplyCapUsd = 400000000000000000000n;
    const fakeTotalScore = 10n;
    const fakeUserScore = 1n;

    const readContractMock = vi.fn(async () => ({
      supplyAPR: fakeSupplyAprPercentage,
      borrowAPR: fakeBorrowAprPercentage,
      cappedSupply: fakeCappedSupply,
      cappedBorrow: fakeCappedBorrow,
      borrowCapUSD: fakeBorrowCapUsd,
      supplyCapUSD: fakeSupplyCapUsd,
      totalScore: fakeTotalScore,
      userScore: fakeUserScore,
    }));

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getHypotheticalPrimeApys({
      publicClient: fakePublicClient,
      primeContractAddress: fakePrimeContractAddress,
      accountAddress: fakeAccountAddress,
      vTokenAddress: vXvs.address,
      userXvsStakedMantissa: fakeUserXvsStakedMantissa,
      userSupplyBalanceMantissa: fakeUserSupplyBalanceMantissa,
      userBorrowBalanceMantissa: fakeUserBorrowBalanceMantissa,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: fakePrimeContractAddress,
      functionName: 'estimateAPR',
      args: [
        vXvs.address,
        fakeAccountAddress,
        BigInt(fakeUserBorrowBalanceMantissa.toFixed()),
        BigInt(fakeUserSupplyBalanceMantissa.toFixed()),
        BigInt(fakeUserXvsStakedMantissa.toFixed()),
      ],
    });

    expect(response).toMatchInlineSnapshot(`
      {
        "borrowApyPercentage": "0.3405770666813801",
        "borrowCapCents": "20000",
        "borrowCapMantissa": "100000000000000000000",
        "supplyApyPercentage": "0.2603373646915319",
        "supplyCapCents": "40000",
        "supplyCapMantissa": "200000000000000000000",
        "userPrimeRewardsShare": "0.1",
      }
    `);
  });
});
