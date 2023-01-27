import { BigNumber as BN } from 'ethers';

import { VaiUnitroller } from 'types/contracts';

import getVaiTreasuryPercentage from '.';

describe('api/queries/getVaiTreasuryPercentage', () => {
  test('returns the VAI treasury percentage in the correct format', async () => {
    const treasuryPercentMock = jest.fn(async () => BN.from('1000000000000000'));

    const fakeContract = {
      treasuryPercent: treasuryPercentMock,
    } as unknown as VaiUnitroller;

    const response = await getVaiTreasuryPercentage({ vaiControllerContract: fakeContract });

    expect(treasuryPercentMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      percentage: 0.1,
    });
  });
});
