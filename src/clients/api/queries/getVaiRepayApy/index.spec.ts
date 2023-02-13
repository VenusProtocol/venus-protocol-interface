import BigNumber from 'bignumber.js';

import vaiControllerResponses from '__mocks__/contracts/vaiController';
import { VaiController } from 'types/contracts';

import getVaiRepayApy from '.';

describe('api/queries/getVaiRepayApy', () => {
  test('returns the VAI repay APY in the correct format on success', async () => {
    const callMock = jest.fn(async () => vaiControllerResponses.getVAIRepayRatePerBlock);
    const getVAIRepayRatePerBlockMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getVAIRepayRatePerBlock: getVAIRepayRatePerBlockMock,
      },
    } as unknown as VaiController;

    const response = await getVaiRepayApy({
      vaiControllerContract: fakeContract,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getVAIRepayRatePerBlockMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.repayApyPercentage instanceof BigNumber).toBeTruthy();
  });
});
