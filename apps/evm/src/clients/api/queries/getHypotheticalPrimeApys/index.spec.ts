import { BigNumber } from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import fakeAccountAddress from '__mocks__/models/address';
import { vXvs } from '__mocks__/models/vTokens';

import { Prime } from 'libs/contracts';

import getHypotheticalPrimeApys from '.';

describe('getHypotheticalPrimeApys', () => {
  test('returns the simulated Prime APYs', async () => {
    const fakeBorrowAprPercentage = BN.from('34');
    const fakeSupplyAprPercentage = BN.from('26');
    const fakeUserBorrowBalanceMantissa = new BigNumber('100000000000000000000');
    const fakeUserSupplyBalanceMantissa = new BigNumber('200000000000000000000');
    const fakeUserXvsStakedMantissa = new BigNumber('1000000000000000000000');
    const fakeCappedSupply = new BigNumber('200000000000000000000');
    const fakeCappedBorrow = new BigNumber('100000000000000000000');
    const fakeBorrowCapUsd = new BigNumber('200000000000000000000');
    const fakeSupplyCapUsd = new BigNumber('400000000000000000000');
    const fakeTotalScore = new BigNumber('10');
    const fakeUserScore = new BigNumber('1');

    const fakePrimeContract = {
      estimateAPR: vi.fn(async () => ({
        supplyAPR: fakeSupplyAprPercentage,
        borrowAPR: fakeBorrowAprPercentage,
        cappedSupply: fakeCappedSupply,
        cappedBorrow: fakeCappedBorrow,
        borrowCapUSD: fakeBorrowCapUsd,
        supplyCapUSD: fakeSupplyCapUsd,
        totalScore: fakeTotalScore,
        userScore: fakeUserScore,
      })),
    } as unknown as Prime;

    const response = await getHypotheticalPrimeApys({
      primeContract: fakePrimeContract,
      accountAddress: fakeAccountAddress,
      vTokenAddress: vXvs.address,
      userXvsStakedMantissa: fakeUserXvsStakedMantissa,
      userSupplyBalanceMantissa: fakeUserSupplyBalanceMantissa,
      userBorrowBalanceMantissa: fakeUserBorrowBalanceMantissa,
    });

    expect(fakePrimeContract.estimateAPR).toHaveBeenCalledTimes(1);
    expect(fakePrimeContract.estimateAPR).toHaveBeenCalledWith(
      vXvs.address,
      fakeAccountAddress,
      fakeUserBorrowBalanceMantissa.toFixed(),
      fakeUserSupplyBalanceMantissa.toFixed(),
      fakeUserXvsStakedMantissa.toFixed(),
    );

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
