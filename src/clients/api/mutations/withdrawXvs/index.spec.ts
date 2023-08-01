import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import withdrawXvs from '.';

describe('api/mutation/withdrawXvs', () => {
  test('send vrt conversion with correct arguments and returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const withdrawVrtMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      withdraw: withdrawVrtMock,
    } as unknown as ContractTypeByName<'xvsVesting'>;

    const response = await withdrawXvs({
      xvsVestingContract: fakeContract,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(withdrawVrtMock).toHaveBeenCalledTimes(1);
    expect(withdrawVrtMock).toHaveBeenCalledWith();
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
