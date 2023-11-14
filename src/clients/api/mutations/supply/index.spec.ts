import BigNumber from 'bignumber.js';
import { VBep20, VBnb, getVTokenContract } from 'packages/contracts';
import Vi from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { vBnb, vXvs } from '__mocks__/models/vTokens';

import supply from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('packages/contracts');

describe('supply', () => {
  describe('supply BNB', () => {
    test('returns transaction when request succeeds', async () => {
      const mintMock = vi.fn(() => fakeContractTransaction);

      const fakeVTokenContract = {
        mint: mintMock,
      } as unknown as VBep20;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
      });

      expect(response).toBe(fakeContractTransaction);

      expect(mintMock).toHaveBeenCalledTimes(1);
      expect(mintMock).toHaveBeenCalledWith({
        value: fakeAmountMantissa.toFixed(),
      });
    });
  });

  describe('supply non-BNB token', () => {
    test('returns transaction when request succeeds', async () => {
      const mintMock = vi.fn(() => fakeContractTransaction);

      const fakeVTokenContract = {
        mint: mintMock,
      } as unknown as VBnb;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        signer: fakeSigner,
        vToken: vXvs,
        amountMantissa: fakeAmountMantissa,
      });

      expect(response).toBe(fakeContractTransaction);

      expect(mintMock).toHaveBeenCalledTimes(1);
      expect(mintMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
    });
  });
});
