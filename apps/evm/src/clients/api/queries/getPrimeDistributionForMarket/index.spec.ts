import BigNumber from 'bignumber.js';

import { vUsdt } from '__mocks__/models/vTokens';

import { Prime } from 'packages/contracts';

import getPrimeDistributionForMarket from '.';

vi.mock('packages/contracts');

describe('getPrimeDistributionForMarket', () => {
  it('returns the amount of rewards distributed for a given market', async () => {
    const rewards = '1000000000';

    const fakePrimeContract = {
      incomeDistributionYearly: vi.fn(() => new BigNumber(rewards)),
    } as unknown as Prime;

    const response = await getPrimeDistributionForMarket({
      vTokenAddress: vUsdt.address,
      primeContract: fakePrimeContract,
    });

    expect(fakePrimeContract.incomeDistributionYearly).toHaveBeenCalledTimes(1);
    expect(fakePrimeContract.incomeDistributionYearly).toBeCalledWith(vUsdt.address);
    expect(response).toMatchSnapshot();
  });
});
