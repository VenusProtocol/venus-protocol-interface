import { BigNumber } from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { Prime } from 'packages/contracts';

import fakeAccountAddress from '__mocks__/models/address';
import { vXvs } from '__mocks__/models/vTokens';

import getHypotheticalPrimeApys from '.';

describe('getHypotheticalPrimeApys', () => {
  test('returns the simulated Prime APYs', async () => {
    const fakeBorrowAprPercentage = BN.from('34');
    const fakeSupplyAprPercentage = BN.from('26');
    const fakeUserBorrowBalanceMantissa = new BigNumber('100000000000000000000');
    const fakeUserSupplyBalanceMantissa = new BigNumber('200000000000000000000');
    const fakeUserXvsStakedMantissa = new BigNumber('1000000000000000000000');

    const fakePrimeContract = {
      estimateAPR: vi.fn(async () => ({
        supplyAPR: fakeSupplyAprPercentage,
        borrowAPR: fakeBorrowAprPercentage,
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
        "borrowApyPercentage": "3.4582968502661515",
        "supplyApyPercentage": "2.633999809916232",
      }
    `);
  });
});
