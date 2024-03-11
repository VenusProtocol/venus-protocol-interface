import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import fakeProvider, { balance as fakeBalanceMantissa } from '__mocks__/models/provider';
import { bnb, xvs } from '__mocks__/models/tokens';

import { type Bep20, getTokenContract } from 'libs/contracts';

import getBalanceOf from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

vi.mock('libs/contracts');

describe('api/queries/getBalanceOf', () => {
  describe('non-BNB token', () => {
    test('returns the balance on success', async () => {
      const balanceOfMock = vi.fn(async () => fakeBalanceMantissa);

      const fakeContract = {
        balanceOf: balanceOfMock,
      } as unknown as Bep20;

      (getTokenContract as Vi.Mock).mockImplementationOnce(() => fakeContract);

      const response = await getBalanceOf({
        provider: fakeProvider,
        accountAddress: fakeAccountAddress,
        token: xvs,
      });

      expect(balanceOfMock).toHaveBeenCalledTimes(1);
      expect(balanceOfMock).toHaveBeenCalledWith(fakeAccountAddress);
      expect(response).toEqual({
        balanceMantissa: new BigNumber(fakeBalanceMantissa.toString()),
      });
    });
  });

  describe('BNB', () => {
    test('returns the balance on success', async () => {
      const response = await getBalanceOf({
        provider: fakeProvider,
        accountAddress: fakeAccountAddress,
        token: bnb,
      });

      expect(fakeProvider.getBalance).toHaveBeenCalledTimes(1);
      expect(fakeProvider.getBalance).toHaveBeenCalledWith(fakeAccountAddress);
      expect(response).toEqual({
        balanceMantissa: new BigNumber(fakeBalanceMantissa.toString()),
      });
    });
  });
});
