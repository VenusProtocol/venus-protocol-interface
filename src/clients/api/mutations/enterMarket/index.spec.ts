import { checkForComptrollerTransactionError } from 'errors';
import { MainPoolComptroller } from 'packages/contractsNew';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { vBusd } from '__mocks__/models/vTokens';

import enterMarket from '.';

vi.mock('errors/transactionErrors');

describe('api/mutation/enterMarket', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const enterMarketsMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      enterMarkets: enterMarketsMock,
    } as unknown as MainPoolComptroller;

    const response = await enterMarket({
      comptrollerContract: fakeContract,
      vToken: vBusd,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith([vBusd.address]);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
