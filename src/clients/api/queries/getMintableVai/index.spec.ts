import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAddress from '__mocks__/models/address';

import getMintableVai from '.';

describe('api/queries/getMintableVai', () => {
  test('returns the mintable VAI in the correct format on success', async () => {
    const getMintableVAIMock = vi.fn(async () => vaiControllerResponses.getMintableVAI);

    const fakeContract = {
      getMintableVAI: getMintableVAIMock,
    } as unknown as ContractTypeByName<'vaiController'>;

    const response = await getMintableVai({
      vaiControllerContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getMintableVAIMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.mintableVaiWei instanceof BigNumber).toBeTruthy();
  });
});
