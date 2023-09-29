import { checkForComptrollerTransactionError } from 'errors';
import { MainPoolComptroller } from 'packages/contractsNew';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { vBusd } from '__mocks__/models/vTokens';

import exitMarket from '.';

vi.mock('errors/transactionErrors');

describe('api/mutation/exitMarket', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const exitMarketMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      exitMarket: exitMarketMock,
    } as unknown as MainPoolComptroller;

    const response = await exitMarket({
      comptrollerContract: fakeContract,
      vToken: vBusd,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(exitMarketMock).toHaveBeenCalledTimes(1);
    expect(exitMarketMock).toHaveBeenCalledWith(vBusd.address);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
