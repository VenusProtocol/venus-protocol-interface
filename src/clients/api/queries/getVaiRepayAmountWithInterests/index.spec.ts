import { Multicall } from 'ethereum-multicall';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getVaiRepayAmountWithInterests from '.';

describe('api/queries/getVaiRepayAmountWithInterests', () => {
  test('throws an error when request fails', async () => {
    const fakeMulticall = {
      call: async () => {
        throw new Error('Fake error message');
      },
    } as unknown as Multicall;

    try {
      await getVaiRepayAmountWithInterests({
        multicall: fakeMulticall,
        accountAddress: fakeAddress,
        vaiControllerContractAddress: 'fake-address',
      });

      throw new Error('getVaiRepayAmountWithInterests should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI fee with interests', async () => {
    const fakeMulticall = {
      call: vi.fn(async () => fakeMulticallResponses.vaiController.getVaiRepayTotalAmount),
    } as unknown as Multicall;

    const response = await getVaiRepayAmountWithInterests({
      multicall: fakeMulticall,
      accountAddress: fakeAddress,
      vaiControllerContractAddress: 'fake-address',
    });

    expect(fakeMulticall.call).toHaveBeenCalledTimes(1);
    expect((fakeMulticall.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(response).toMatchSnapshot();
  });
});
