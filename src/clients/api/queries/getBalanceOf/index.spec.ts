import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { getTokenContract } from 'clients/contracts';
import { TokenContract } from 'clients/contracts/types';
import { TOKENS } from 'constants/tokens';

import getBalanceOf from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

jest.mock('clients/contracts');

describe('api/queries/getBalanceOf', () => {
  describe('non-BNB token', () => {
    const fakeWeb3 = {} as unknown as Web3;

    test('throws an error when request fails', async () => {
      const fakeContract = {
        methods: {
          balanceOf: () => ({
            call: async () => {
              throw new Error('Fake error message');
            },
          }),
        },
      } as unknown as TokenContract<string>;

      (getTokenContract as jest.Mock).mockImplementationOnce(() => fakeContract);

      try {
        await getBalanceOf({
          web3: fakeWeb3,
          accountAddress: fakeAccountAddress,
          token: TOKENS.xvs,
        });

        throw new Error('getBalanceOf should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('returns the balance on success', async () => {
      const fakeBalanceWei = '1000';

      const callMock = jest.fn(async () => fakeBalanceWei);
      const balanceOfMock = jest.fn(() => ({
        call: callMock,
      }));

      const fakeContract = {
        methods: {
          balanceOf: balanceOfMock,
        },
      } as unknown as TokenContract<string>;

      (getTokenContract as jest.Mock).mockImplementationOnce(() => fakeContract);

      const response = await getBalanceOf({
        web3: fakeWeb3,
        accountAddress: fakeAccountAddress,
        token: TOKENS.xvs,
      });

      expect(balanceOfMock).toHaveBeenCalledTimes(1);
      expect(callMock).toHaveBeenCalledTimes(1);
      expect(balanceOfMock).toHaveBeenCalledWith(fakeAccountAddress);
      expect(response).toEqual({
        balanceWei: new BigNumber(fakeBalanceWei),
      });
    });
  });

  describe('BNB', () => {
    test('throws an error when request fails', async () => {
      const fakeWeb3 = {
        eth: {
          getBalance: async () => {
            throw new Error('Fake error message');
          },
        },
      } as unknown as Web3;

      try {
        await getBalanceOf({
          web3: fakeWeb3,
          accountAddress: fakeAccountAddress,
          token: TOKENS.bnb,
        });

        throw new Error('getBalanceOf should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('returns the balance on success', async () => {
      const fakeBalanceWei = '1000';

      const getBalanceMock = jest.fn(async () => fakeBalanceWei);

      const fakeWeb3 = {
        eth: {
          getBalance: getBalanceMock,
        },
      } as unknown as Web3;

      const response = await getBalanceOf({
        web3: fakeWeb3,
        accountAddress: fakeAccountAddress,
        token: TOKENS.bnb,
      });

      expect(getBalanceMock).toHaveBeenCalledTimes(1);
      expect(getBalanceMock).toHaveBeenCalledWith(fakeAccountAddress);
      expect(response).toEqual({
        balanceWei: new BigNumber(fakeBalanceWei),
      });
    });
  });
});
