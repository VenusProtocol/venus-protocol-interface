import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { Maximillion, VBnb, VToken as VTokenContract } from 'packages/contractsNew';
import { getVTokenContract } from 'utilities';
import Vi from 'vitest';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { vBnb, vXvs } from '__mocks__/models/vTokens';

import repay, { REPAYMENT_BNB_BUFFER_PERCENTAGE } from '.';

const fakeAmountWei = new BigNumber(10000000000000000);

vi.mock('utilities/getVTokenContract');
vi.mock('errors/transactionErrors');

describe('api/mutation/repay', () => {
  describe('repay non-BNB loan', () => {
    test('returns transaction when request to repay a loan succeeds', async () => {
      const waitMock = vi.fn(async () => fakeContractReceipt);
      const repayBorrowMock = vi.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VTokenContract;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vXvs,
        amountWei: fakeAmountWei,
        isRepayingFullLoan: false,
      });

      expect(response).toBe(fakeContractReceipt);

      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
      expect(waitMock).toBeCalledTimes(1);
      expect(waitMock).toHaveBeenCalledWith(1);
      expect(checkForTokenTransactionError).toHaveBeenCalledTimes(1);
      expect(checkForTokenTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
    });
  });

  describe('repay BNB loan', () => {
    test('returns transaction when request to repay full loan succeeds', async () => {
      const waitMock = vi.fn(async () => fakeContractReceipt);
      const repayBehalfExplicitMock = vi.fn(() => ({
        wait: waitMock,
      }));

      const fakeMaximillionContract = {
        repayBehalfExplicit: repayBehalfExplicitMock,
      } as unknown as Maximillion;

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountWei: fakeAmountWei,
        maximillionContract: fakeMaximillionContract,
        isRepayingFullLoan: true,
      });

      expect(response).toBe(fakeContractReceipt);

      const amountWithBufferWei = fakeAmountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);

      expect(repayBehalfExplicitMock).toHaveBeenCalledWith(fakeSignerAddress, vBnb.address, {
        value: amountWithBufferWei.toFixed(),
      });
      expect(waitMock).toBeCalledTimes(1);
      expect(waitMock).toHaveBeenCalledWith(1);
    });

    test('returns transaction when request to repay partial loan succeeds', async () => {
      const waitMock = vi.fn(async () => fakeContractReceipt);
      const repayBorrowMock = vi.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBnb;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountWei: fakeAmountWei,
        isRepayingFullLoan: false,
      });

      expect(response).toBe(fakeContractReceipt);
      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith({
        value: fakeAmountWei.toFixed(),
      });
      expect(waitMock).toBeCalledTimes(1);
      expect(waitMock).toHaveBeenCalledWith(1);
    });
  });
});
