import { checkForComptrollerTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { VBEP_TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

import claimXvsReward from '.';

jest.mock('errors/transactionErrors');

describe('api/mutation/claimXvsReward', () => {
  test('send claim request with correct arguments and returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const claimVenusMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      'claimVenus(address,address[])': claimVenusMock,
      signer: fakeSigner,
    } as unknown as Comptroller;

    const response = await claimXvsReward({
      comptrollerContract: fakeContract,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(claimVenusMock).toHaveBeenCalledTimes(1);

    // TODO [VEN-198] Currently claiming all address until the pendingVenus function is updated with pending rewards
    const expectedVTokenAddresses = Object.values(VBEP_TOKENS).map(vToken => vToken.address);
    expect(claimVenusMock).toHaveBeenCalledWith(fakeSignerAddress, expectedVTokenAddresses);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
