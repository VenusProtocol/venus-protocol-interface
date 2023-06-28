import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import fakeAddress from '__mocks__/models/address';
import fakeSigner from '__mocks__/models/signer';
import { VrtToken } from 'types/contracts';

import getAllowance from '.';

const fakeSpenderAddress = '0x000000000000000000000000000000000sPeNdEr';

describe('api/queries/getAllowance', () => {
  test('returns the allowance on success', async () => {
    const fakeAllowanceWei = BN.from(10000);

    const vrtAllowanceMock = vi.fn(async () => fakeAllowanceWei);

    const fakeContract = {
      allowance: vrtAllowanceMock,
      signer: fakeSigner,
    } as unknown as VrtToken;

    const response = await getAllowance({
      tokenContract: fakeContract,
      spenderAddress: fakeSpenderAddress,
      accountAddress: fakeAddress,
    });

    expect(vrtAllowanceMock).toHaveBeenCalledTimes(1);
    expect(vrtAllowanceMock).toHaveBeenCalledWith(fakeAddress, fakeSpenderAddress);
    expect(response.allowanceWei instanceof BigNumber).toBe(true);
    expect(response).toEqual({
      allowanceWei: new BigNumber(fakeAllowanceWei.toString()),
    });
  });
});
