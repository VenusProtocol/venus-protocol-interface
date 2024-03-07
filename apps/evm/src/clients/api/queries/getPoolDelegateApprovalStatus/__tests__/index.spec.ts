import fakeAddress from '__mocks__/models/address';
import fakeSigner from '__mocks__/models/signer';

import { IsolatedPoolComptroller } from 'libs/contracts';

import getPoolDelegateApprovalStatus from '..';

describe('api/queries/getPoolDelegateApprovalStatus', () => {
  test('returns the delegate approval status on success', async () => {
    const fakeDelegateAddress = '0x1112223330000aaaaabbbbbaabbb654321888999';
    const fakeApprovedDelegatesResponse = { isDelegateeApproved: true };
    const approvedDelegatesMock = vi.fn(() => true);

    const fakeContract = {
      approvedDelegates: approvedDelegatesMock,
      signer: fakeSigner,
    } as unknown as IsolatedPoolComptroller;

    const response = await getPoolDelegateApprovalStatus({
      poolComptrollerContract: fakeContract,
      delegateeAddress: fakeDelegateAddress,
      accountAddress: fakeAddress,
    });

    expect(approvedDelegatesMock).toHaveBeenCalledTimes(1);
    expect(approvedDelegatesMock).toHaveBeenCalledWith(fakeAddress, fakeDelegateAddress);
    expect(response).toEqual(fakeApprovedDelegatesResponse);
  });
});
