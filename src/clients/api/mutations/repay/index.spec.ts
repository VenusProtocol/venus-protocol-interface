import BigNumber from 'bignumber.js';
import { Maximillion, VBep20, VBnb, getVTokenContract } from 'packages/contracts';
import Vi from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { vBnb, vXvs } from '__mocks__/models/vTokens';

import repay, { REPAYMENT_BNB_BUFFER_PERCENTAGE } from '.';

const fakeAmountMantissa = new BigNumber(10000000000000000);

vi.mock('packages/contracts');

describe('repay', () => {
  describe('repay non-BNB loan', () => {
    test('returns transaction when request to repay a loan succeeds', async () => {
      const repayBorrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBep20;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vXvs,
        amountMantissa: fakeAmountMantissa,
        isRepayingFullLoan: false,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
    });
  });

  describe('repay BNB loan', () => {
    test('returns transaction when request to repay full loan succeeds', async () => {
      const repayBehalfExplicitMock = vi.fn(async () => fakeContractTransaction);

      const fakeMaximillionContract = {
        repayBehalfExplicit: repayBehalfExplicitMock,
      } as unknown as Maximillion;

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
        maximillionContract: fakeMaximillionContract,
        isRepayingFullLoan: true,
      });

      expect(response).toBe(fakeContractTransaction);

      const amountWithBufferMantissa = fakeAmountMantissa.multipliedBy(
        1 + REPAYMENT_BNB_BUFFER_PERCENTAGE,
      );

      expect(repayBehalfExplicitMock).toHaveBeenCalledWith(fakeSignerAddress, vBnb.address, {
        value: amountWithBufferMantissa.toFixed(),
      });
    });

    test('returns transaction when request to repay partial loan succeeds', async () => {
      const repayBorrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBnb;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
        isRepayingFullLoan: false,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith({
        value: fakeAmountMantissa.toFixed(),
      });
    });
  });
});
