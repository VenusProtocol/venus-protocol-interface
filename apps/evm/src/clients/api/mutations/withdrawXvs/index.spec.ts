import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { XvsVesting } from 'libs/contracts';

import withdrawXvs from '.';

describe('withdrawXvs', () => {
  test('send vrt conversion with correct arguments and returns contract transaction when request succeeds', async () => {
    const withdrawVrtMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        withdraw: withdrawVrtMock,
      },
      signer: fakeSigner,
    } as unknown as XvsVesting;

    const response = await withdrawXvs({
      xvsVestingContract: fakeContract,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [],
      methodName: 'withdraw',
    });
  });
});
