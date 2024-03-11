import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { XvsVesting } from 'libs/contracts';

import withdrawXvs from '.';

describe('withdrawXvs', () => {
  test('send vrt conversion with correct arguments and returns contract transaction when request succeeds', async () => {
    const withdrawVrtMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      withdraw: withdrawVrtMock,
    } as unknown as XvsVesting;

    const response = await withdrawXvs({
      xvsVestingContract: fakeContract,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(withdrawVrtMock).toHaveBeenCalledTimes(1);
    expect(withdrawVrtMock).toHaveBeenCalledWith();
  });
});
