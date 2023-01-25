import { checkForComptrollerTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { Comptroller } from 'types/contracts';

import exitMarket from '.';

jest.mock('errors/transactionErrors');

describe('api/mutation/exitMarket', () => {
  test('returns contract receipt when request succeeds', async () => {
    const vTokenAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const exitMarketMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      exitMarket: exitMarketMock,
    } as unknown as Comptroller;

    const response = await exitMarket({
      comptrollerContract: fakeContract,
      vTokenAddress,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(exitMarketMock).toHaveBeenCalledTimes(1);
    expect(exitMarketMock).toHaveBeenCalledWith(vTokenAddress);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
