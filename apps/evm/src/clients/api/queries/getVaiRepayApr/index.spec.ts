import BigNumber from 'bignumber.js';

import vaiControllerResponses from '__mocks__/contracts/vaiController';

import { VaiController } from 'libs/contracts';

import getVaiRepayApr from '.';

describe('api/queries/getVaiRepayApr', () => {
  test('returns the VAI repay APR in the correct format on success', async () => {
    const getVAIRepayRateMock = vi.fn(async () => vaiControllerResponses.getVAIRepayRate);

    const fakeContract = {
      getVAIRepayRate: getVAIRepayRateMock,
    } as unknown as VaiController;

    const response = await getVaiRepayApr({
      vaiControllerContract: fakeContract,
    });

    expect(getVAIRepayRateMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.repayAprPercentage instanceof BigNumber).toBeTruthy();
  });
});
