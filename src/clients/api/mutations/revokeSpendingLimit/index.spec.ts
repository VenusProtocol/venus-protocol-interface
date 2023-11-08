import { Bep20 } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';

import approveToken from '.';

describe('revokeSpendingLimit', () => {
  test('returns contract transaction when request succeeds', async () => {
    const approveTokenMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      approve: approveTokenMock,
    } as unknown as Bep20;

    const response = await approveToken({
      tokenContract: fakeContract,
      spenderAddress: fakeAddress,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(approveTokenMock).toHaveBeenCalledTimes(1);
    expect(approveTokenMock).toHaveBeenCalledWith(fakeAddress, 0);
  });
});
