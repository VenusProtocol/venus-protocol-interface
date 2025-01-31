import BigNumber from 'bignumber.js';

import { balance as fakeBalanceMantissa } from '__mocks__/models/provider';
import { bnb, xvs } from '__mocks__/models/tokens';

import type { PublicClient } from 'viem';
import getBalanceOf from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

vi.mock('libs/contracts');

describe('api/queries/getBalanceOf', () => {
  describe('non-native token', () => {
    test('returns the balance on success', async () => {
      const readContractMock = vi.fn(async () => fakeBalanceMantissa);

      const fakePublicClient = {
        readContract: readContractMock,
      } as unknown as PublicClient;

      const response = await getBalanceOf({
        publicClient: fakePublicClient,
        accountAddress: fakeAccountAddress,
        token: xvs,
      });

      expect(readContractMock).toHaveBeenCalledTimes(1);
      expect(readContractMock).toHaveBeenCalledWith({
        abi: expect.any(Object),
        address: xvs.address,
        functionName: 'balanceOf',
        args: [fakeAccountAddress],
      });
      expect(response).toEqual({
        balanceMantissa: new BigNumber(fakeBalanceMantissa.toString()),
      });
    });
  });

  describe('native token', () => {
    test('returns the balance on success', async () => {
      const getBalanceMock = vi.fn(async () => fakeBalanceMantissa);

      const fakePublicClient = {
        getBalance: getBalanceMock,
      } as unknown as PublicClient;

      const response = await getBalanceOf({
        publicClient: fakePublicClient,
        accountAddress: fakeAccountAddress,
        token: bnb,
      });

      expect(getBalanceMock).toHaveBeenCalledTimes(1);
      expect(getBalanceMock).toHaveBeenCalledWith({
        address: fakeAccountAddress,
      });
      expect(response).toEqual({
        balanceMantissa: new BigNumber(fakeBalanceMantissa.toString()),
      });
    });
  });
});
