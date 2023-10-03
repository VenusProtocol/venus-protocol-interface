import BigNumber from 'bignumber.js';
import { Bep20 } from 'packages/contracts';
import { getTokenContract } from 'utilities';
import Vi from 'vitest';

import fakeProvider, { balance as fakeBalanceWei } from '__mocks__/models/provider';
import { bnb, xvs } from '__mocks__/models/tokens';

import getBalanceOf from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

vi.mock('utilities/getTokenContract');

describe('api/queries/getBalanceOf', () => {
  describe('non-BNB token', () => {
    test('returns the balance on success', async () => {
      const balanceOfMock = vi.fn(async () => fakeBalanceWei);

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
        balanceWei: new BigNumber(fakeBalanceWei.toString()),
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
        balanceWei: new BigNumber(fakeBalanceWei.toString()),
      });
    });
  });
});
