import fakeAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import MAX_UINT256 from 'constants/maxUint256';
import { Bep20 } from 'types/contracts';

import approveToken from '.';

describe('api/mutations/approveToken', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const approveTokenMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      approve: approveTokenMock,
    } as unknown as Bep20;

    const response = await approveToken({
      tokenContract: fakeContract,
      spenderAddress: fakeAddress,
      allowance: MAX_UINT256.toFixed(),
    });

    expect(response).toBe(fakeContractReceipt);
    expect(approveTokenMock).toHaveBeenCalledTimes(1);
    expect(approveTokenMock).toHaveBeenCalledWith(fakeAddress, MAX_UINT256.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
