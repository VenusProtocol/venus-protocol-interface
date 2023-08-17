import { checkForComptrollerTransactionError } from 'errors';
import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';

import enterMarket from '.';

vi.mock('errors/transactionErrors');

describe('api/mutation/enterMarket', () => {
  test('returns contract receipt when request succeeds', async () => {
    const vToken = TESTNET_VBEP_TOKENS['0x08e0a5575de71037ae36abfafb516595fe68e5e4'];

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const enterMarketsMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      enterMarkets: enterMarketsMock,
    } as unknown as ContractTypeByName<'mainPoolComptroller'>;

    const response = await enterMarket({
      comptrollerContract: fakeContract,
      vToken,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith([vToken.address]);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForComptrollerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
