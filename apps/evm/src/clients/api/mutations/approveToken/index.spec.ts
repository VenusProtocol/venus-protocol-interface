import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';

import MAX_UINT256 from 'constants/maxUint256';
import { Bep20 } from 'libs/contracts';

import approveToken from '.';

describe('approveToken', () => {
  test('returns contract transaction when request succeeds', async () => {
    const approveTokenMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      approve: approveTokenMock,
    } as unknown as Bep20;

    const response = await approveToken({
      tokenContract: fakeContract,
      spenderAddress: fakeAddress,
      allowance: MAX_UINT256.toFixed(),
    });

    expect(response).toBe(fakeContractTransaction);
    expect(approveTokenMock).toHaveBeenCalledTimes(1);
    expect(approveTokenMock).toHaveBeenCalledWith(fakeAddress, MAX_UINT256.toFixed());
  });
});
