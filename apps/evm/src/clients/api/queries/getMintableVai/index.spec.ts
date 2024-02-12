import BigNumber from 'bignumber.js';

import vaiContractResponses from '__mocks__/contracts/vai';
import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAddress from '__mocks__/models/address';

import { Vai, VaiController } from 'packages/contracts';

import getMintableVai from '.';

describe('api/queries/getMintableVai', () => {
  test('returns the mintable VAI in the correct format on success', async () => {
    const getMintableVAIMock = vi.fn(async () => vaiControllerResponses.getMintableVAI);
    const mintCapMock = vi.fn(async () => vaiControllerResponses.mintCap);
    const totalSupplyMock = vi.fn(async () => vaiContractResponses.totalSupply);

    const fakeVaiControllerContract = {
      mintCap: mintCapMock,
      getMintableVAI: getMintableVAIMock,
    } as unknown as VaiController;

    const fakeVaiContract = {
      totalSupply: totalSupplyMock,
    } as unknown as Vai;

    const response = await getMintableVai({
      vaiContract: fakeVaiContract,
      vaiControllerContract: fakeVaiControllerContract,
      accountAddress: fakeAddress,
    });

    expect(getMintableVAIMock).toHaveBeenCalledTimes(1);
    expect(totalSupplyMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.mintableVaiMantissa instanceof BigNumber).toBeTruthy();
  });
});
