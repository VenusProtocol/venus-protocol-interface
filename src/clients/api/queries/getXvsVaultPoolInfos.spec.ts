import { XvsVault } from 'types/contracts';
import BigNumber from 'bignumber.js';
import getXvsVaultPoolInfos from './getXvsVaultPoolInfos';

const fakeTokenAddress = '0x0';
const fakePid = 0;

describe('api/queries/getXvsVaultPoolInfos', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        poolInfos: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultPoolInfos({
        xvsVaultContract: fakeContract,
        tokenAddress: fakeTokenAddress,
        pid: fakePid,
      });

      throw new Error('getXvsVaultPoolInfos should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the pool infos on success', async () => {
    const fakeOutput: ReturnType<XvsVault['methods']['poolInfos']['call']> = {
      token: fakeTokenAddress,
      allocPoint: '10',
      lastRewardBlock: '100000',
      accRewardPerShare: '123871680',
      lockPeriod: '200',
    };

    const callMock = jest.fn(async () => fakeOutput);
    const poolInfosMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        poolInfos: poolInfosMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultPoolInfos({
      xvsVaultContract: fakeContract,
      tokenAddress: fakeTokenAddress,
      pid: fakePid,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(poolInfosMock).toHaveBeenCalledTimes(1);
    expect(poolInfosMock).toHaveBeenCalledWith(fakeTokenAddress, fakePid);
    expect(response).toStrictEqual({
      tokenAddress: fakeTokenAddress,
      allocPoint: 10,
      lastRewardBlock: 100000,
      accRewardPerShare: new BigNumber('123871680'),
      lockPeriodDays: 200,
    });
  });
});
