import BigNumber from 'bignumber.js';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner from '__mocks__/models/signer';
import { getVTokenContract } from 'clients/contracts';
import { VBEP_TOKENS } from 'constants/tokens';
import { VBep20, VBnbToken } from 'types/contracts';

import supply from '.';

const fakeAmountWei = new BigNumber('10000000000000000');

jest.mock('clients/contracts');

describe('api/mutation/supply', () => {
  describe('supply BNB', () => {
    test('returns contract receipt when request succeeds', async () => {
      const waitMock = jest.fn(async () => fakeContractReceipt);
      const mintMock = jest.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        mint: mintMock,
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        signer: fakeSigner,
        vToken: VBEP_TOKENS.bnb,
        amountWei: fakeAmountWei,
      });

      expect(response).toBe(fakeContractReceipt);

      expect(mintMock).toHaveBeenCalledTimes(1);
      expect(mintMock).toHaveBeenCalledWith({
        value: fakeAmountWei.toFixed(),
      });
      expect(waitMock).toBeCalledTimes(1);
      expect(waitMock).toHaveBeenCalledWith(1);
    });
  });

  describe('supply non-BNB token', () => {
    test('returns contract receipt when request succeeds', async () => {
      const waitMock = jest.fn(async () => fakeContractReceipt);
      const mintMock = jest.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        mint: mintMock,
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        signer: fakeSigner,
        vToken: VBEP_TOKENS.xvs,
        amountWei: fakeAmountWei,
      });

      expect(response).toBe(fakeContractReceipt);

      expect(mintMock).toHaveBeenCalledTimes(1);
      expect(mintMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
      expect(waitMock).toBeCalledTimes(1);
      expect(waitMock).toHaveBeenCalledWith(1);
    });
  });
});
