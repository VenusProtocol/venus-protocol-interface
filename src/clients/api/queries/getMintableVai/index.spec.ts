import BigNumber from 'bignumber.js';

import vaiUnitrollerResponses from '__mocks__/contracts/vaiUnitroller';
import fakeAddress from '__mocks__/models/address';
import { VaiUnitroller } from 'types/contracts';

import getMintableVai from '.';

describe('api/queries/getMintableVai', () => {
  test('returns the mintable VAI in the correct format on success', async () => {
    const getMintableVAIMock = jest.fn(async () => vaiUnitrollerResponses.getMintableVAI);

    const fakeContract = {
      getMintableVAI: getMintableVAIMock,
    } as unknown as VaiUnitroller;

    const response = await getMintableVai({
      vaiControllerContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getMintableVAIMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.mintableVaiWei instanceof BigNumber).toBeTruthy();
  });
});
