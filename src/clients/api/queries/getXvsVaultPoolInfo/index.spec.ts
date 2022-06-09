import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import getXvsVaultPoolInfo from '.';

const fakeTokenAddress = '0x0';
const fakePid = 0;

describe('api/queries/getXvsVaultPoolInfo', () => {
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
      await getXvsVaultPoolInfo({
        xvsVaultContract: fakeContract,
        tokenAddress: fakeTokenAddress,
        poolIndex: fakePid,
      });

      throw new Error('getXvsVaultPoolInfo should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the pool infos on success', async () => {
    const callMock = jest.fn(async () => xvsVaultResponses.poolInfo);
    const poolInfosMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        poolInfos: poolInfosMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultPoolInfo({
      xvsVaultContract: fakeContract,
      tokenAddress: fakeTokenAddress,
      poolIndex: fakePid,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(poolInfosMock).toHaveBeenCalledTimes(1);
    expect(poolInfosMock).toHaveBeenCalledWith(fakeTokenAddress, fakePid);
    expect(response).toMatchSnapshot();
    expect(response.accRewardPerShare instanceof BigNumber).toBeTruthy();
  });
});
