import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import { VaiController } from 'libs/contracts';

import getVaiTreasuryPercentage from '.';

describe('api/queries/getVaiTreasuryPercentage', () => {
  test('returns the VAI treasury percentage in the correct format', async () => {
    const treasuryPercentMock = vi.fn(async () => BN.from('1000000000000000'));

    const fakeContract = {
      treasuryPercent: treasuryPercentMock,
    } as unknown as VaiController;

    const response = await getVaiTreasuryPercentage({ vaiControllerContract: fakeContract });

    expect(treasuryPercentMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.percentage instanceof BigNumber).toBeTruthy();
  });
});
