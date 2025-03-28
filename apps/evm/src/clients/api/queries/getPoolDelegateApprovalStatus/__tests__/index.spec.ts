import fakeAddress from '__mocks__/models/address';
import type { PublicClient } from 'viem';

import { getPoolDelegateApprovalStatus } from '..';

describe('getPoolDelegateApprovalStatus', () => {
  test('returns the delegate approval status on success', async () => {
    const fakeDelegateAddress = '0x1112223330000aaaaabbbbbaabbb654321888999';
    const fakePoolComptrollerAddress = '0x0000000000000000000000000000000000000000';
    const fakeApprovedDelegatesResponse = { isDelegateeApproved: true };
    const readContractMock = vi.fn(() => true);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getPoolDelegateApprovalStatus({
      publicClient: fakePublicClient,
      poolComptrollerAddress: fakePoolComptrollerAddress,
      delegateeAddress: fakeDelegateAddress,
      accountAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: fakePoolComptrollerAddress,
      functionName: 'approvedDelegates',
      args: [fakeAddress, fakeDelegateAddress],
    });
    expect(response).toEqual(fakeApprovedDelegatesResponse);
  });
});
