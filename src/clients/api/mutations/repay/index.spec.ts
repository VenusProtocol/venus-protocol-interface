import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractTypeByName } from 'packages/contracts';
import { getVTokenContract } from 'utilities';
import Vi from 'vitest';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';

import repay, { REPAYMENT_BNB_BUFFER_PERCENTAGE } from '.';

const fakeAmountWei = new BigNumber(10000000000000000);

const vBnb = TESTNET_VBEP_TOKENS['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'];

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
      } as unknown as ContractTypeByName<'vToken'>;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
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
      } as unknown as ContractTypeByName<'maximillion'>;

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
      } as unknown as ContractTypeByName<'vBnb'>;

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
