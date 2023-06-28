import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import fakeProvider, { balance as fakeBalanceWei } from '__mocks__/models/provider';
import { getTokenContract } from 'clients/contracts';
import { TokenContract } from 'clients/contracts/types';
import { TOKENS } from 'constants/tokens';

import getBalanceOf from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

vi.mock('clients/contracts');

describe('api/queries/getBalanceOf', () => {
  describe('non-BNB token', () => {
    test('returns the balance on success', async () => {
      const balanceOfMock = vi.fn(async () => fakeBalanceWei);

      const fakeContract = {
        balanceOf: balanceOfMock,
      } as unknown as TokenContract;

      (getTokenContract as Vi.Mock).mockImplementationOnce(() => fakeContract);

      const response = await getBalanceOf({
        provider: fakeProvider,
        accountAddress: fakeAccountAddress,
        token: TOKENS.xvs,
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
        token: TOKENS.bnb,
      });

      expect(fakeProvider.getBalance).toHaveBeenCalledTimes(1);
      expect(fakeProvider.getBalance).toHaveBeenCalledWith(fakeAccountAddress);
      expect(response).toEqual({
        balanceWei: new BigNumber(fakeBalanceWei.toString()),
      });
    });
  });
});
