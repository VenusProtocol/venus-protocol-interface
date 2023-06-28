import { checkForComptrollerTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { Comptroller } from 'types/contracts';

import enterMarkets from '.';

vi.mock('errors/transactionErrors');

describe('api/mutation/enterMarkets', () => {
  test('returns contract receipt when request succeeds', async () => {
    const vTokenAddresses = ['0x3d759121234cd36F8124C21aFe1c6852d2bEd848'];

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const enterMarketsMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      enterMarkets: enterMarketsMock,
    } as unknown as Comptroller;

    const response = await enterMarkets({
      comptrollerContract: fakeContract,
      vTokenAddresses,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith(vTokenAddresses);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
