import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { getMaximillionContract, getVTokenContract } from 'clients/contracts';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';
import { VBep20, VBnbToken } from 'types/contracts';

import repay, { REPAYMENT_BNB_BUFFER_PERCENTAGE } from '.';

const fakeAmountWei = new BigNumber(10000000000000000);

const vBnb = TESTNET_VBEP_TOKENS['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'];

jest.mock('clients/contracts');
jest.mock('errors/transactionErrors');

describe('api/mutation/repay', () => {
  describe('repay non-BNB loan', () => {
    test('returns transaction when request to repay a loan succeeds', async () => {
      const waitMock = jest.fn(async () => fakeContractReceipt);
      const repayBorrowMock = jest.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
        amountWei: fakeAmountWei,
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
      const waitMock = jest.fn(async () => fakeContractReceipt);
      const repayBehalfExplicitMock = jest.fn(() => ({
        wait: waitMock,
      }));

      const fakeMaximillionContract = {
        repayBehalfExplicit: repayBehalfExplicitMock,
      } as unknown as VBep20;

      (getMaximillionContract as jest.Mock).mockImplementationOnce(() => fakeMaximillionContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountWei: fakeAmountWei,
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
      const waitMock = jest.fn(async () => fakeContractReceipt);
      const repayBorrowMock = jest.fn(() => ({
        wait: waitMock,
      }));

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountWei: fakeAmountWei,
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
