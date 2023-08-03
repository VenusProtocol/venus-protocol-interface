import { ContractTypeByName } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';

import approveToken from '.';

describe('api/mutations/revokeSpendingLimit', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const approveTokenMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      approve: approveTokenMock,
    } as unknown as ContractTypeByName<'bep20'>;

    const response = await approveToken({
      tokenContract: fakeContract,
      spenderAddress: fakeAddress,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(approveTokenMock).toHaveBeenCalledTimes(1);
    expect(approveTokenMock).toHaveBeenCalledWith(fakeAddress, 0);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
