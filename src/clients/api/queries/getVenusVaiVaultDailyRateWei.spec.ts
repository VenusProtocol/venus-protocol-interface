import BigNumber from 'bignumber.js';
import { Comptroller } from 'types/contracts';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import getVenusVaiVaultDailyRateWei, {
  GetVenusVaiVaultDailyRateWeiOutput,
} from './getVenusVaiVaultDailyRateWei';

describe('api/queries/getVenusVaiVaultDailyRateWei', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        venusVAIVaultRate: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await getVenusVaiVaultDailyRateWei({
        comptrollerContract: fakeContract,
      });

      throw new Error('getVenusVaiState should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the vault rate state on success', async () => {
    const fakeOutput: GetVenusVaiVaultDailyRateWeiOutput = new BigNumber(1000);

    const callMock = jest.fn(async () => fakeOutput);
    const venusVaiVaultRateMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        venusVAIVaultRate: venusVaiVaultRateMock,
      },
    } as unknown as Comptroller;

    const response = await getVenusVaiVaultDailyRateWei({
      comptrollerContract: fakeContract,
    });

    expect(venusVaiVaultRateMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response.toFixed()).toBe(fakeOutput.times(BLOCKS_PER_DAY).toFixed());
  });
});
