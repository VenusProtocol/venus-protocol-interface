import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { getVTokenContract } from 'utilities';
import Vi from 'vitest';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner from '__mocks__/models/signer';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';

import supply from '.';

const fakeAmountWei = new BigNumber('10000000000000000');

vi.mock('utilities/getVTokenContract');

describe('api/mutation/supply', () => {
  describe('supply BNB', () => {
    test('returns contract receipt when request succeeds', async () => {
      const waitMock = vi.fn(async () => fakeContractReceipt);
      const mintMock = vi.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        mint: mintMock,
      } as unknown as ContractTypeByName<'vToken'>;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        signer: fakeSigner,
        vToken: TESTNET_VBEP_TOKENS['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
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
      const waitMock = vi.fn(async () => fakeContractReceipt);
      const mintMock = vi.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        mint: mintMock,
      } as unknown as ContractTypeByName<'vBnb'>;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        signer: fakeSigner,
        vToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
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
