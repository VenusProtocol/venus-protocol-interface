import { BigNumber as BN } from 'ethers';

import fakeAddress from '__mocks__/models/address';

import { PoolLens } from 'packages/contracts';

import getVTokenBalancesAll from '..';

describe('api/queries/getVTokenBalancesAll', () => {
  it('returns the APY simulations in the correct format on success', async () => {
    const vTokenBalancesAllCallMock = vi.fn(async () => [
      {
        balanceOf: BN.from('10000'),
        balanceOfUnderlying: BN.from('20000'),
        borrowBalanceCurrent: BN.from('300'),
        tokenAllowance: BN.from('40000000000000000'),
        tokenBalance: BN.from('5000'),
        vToken: fakeAddress,
      },
    ]);

    const fakeContract = {
      callStatic: {
        vTokenBalancesAll: vTokenBalancesAllCallMock,
      },
    } as unknown as PoolLens;

    const response = await getVTokenBalancesAll({
      poolLensContract: fakeContract,
      vTokenAddresses: [''],
      account: fakeAddress,
    });

    expect(vTokenBalancesAllCallMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
