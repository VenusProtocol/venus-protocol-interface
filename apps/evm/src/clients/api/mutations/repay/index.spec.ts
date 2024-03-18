import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { vBnb, vWeth, vXvs } from '__mocks__/models/vTokens';

import {
  type Maximillion,
  type NativeTokenGateway,
  type VBep20,
  type VBnb,
  getVTokenContract,
} from 'libs/contracts';

import repay, { FULL_REPAYMENT_NATIVE_BUFFER_PERCENTAGE } from '.';

const fakeAmountMantissa = new BigNumber(10000000000000000);

vi.mock('libs/contracts');

describe('repay', () => {
  describe('repay BNB loan', () => {
    it('returns transaction when request to repay full loan succeeds', async () => {
      const repayBehalfExplicitMock = vi.fn(async () => fakeContractTransaction);

      const fakeMaximillionContract = {
        repayBehalfExplicit: repayBehalfExplicitMock,
      } as unknown as Maximillion;

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
        maximillionContract: fakeMaximillionContract,
        repayFullLoan: true,
      });

      expect(response).toBe(fakeContractTransaction);

      const amountWithBufferMantissa = fakeAmountMantissa.multipliedBy(
        1 + FULL_REPAYMENT_NATIVE_BUFFER_PERCENTAGE / 100,
      );

      expect(repayBehalfExplicitMock).toHaveBeenCalledWith(fakeSignerAddress, vBnb.address, {
        value: amountWithBufferMantissa.toFixed(),
      });
    });

    it('returns transaction when request to repay partial loan succeeds', async () => {
      const repayBorrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBnb;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
        repayFullLoan: false,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith({
        value: fakeAmountMantissa.toFixed(),
      });
    });
  });

  describe('wrap and repay', () => {
    it('throws an error when passing unwrap as true but underlying token does not wrap any other one', async () => {
      try {
        await repay({
          signer: fakeSigner,
          vToken: vXvs,
          nativeTokenGatewayContract: {} as unknown as NativeTokenGateway,
          amountMantissa: fakeAmountMantissa,
          wrap: true,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns transaction when request to repay a loan succeeds', async () => {
      const wrapAndRepayMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        wrapAndRepay: wrapAndRepayMock,
      } as unknown as NativeTokenGateway;

      const response = await repay({
        signer: fakeSigner,
        vToken: vWeth,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmountMantissa,
        wrap: true,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(wrapAndRepayMock).toHaveBeenCalledTimes(1);
      expect(wrapAndRepayMock).toHaveBeenCalledWith({
        value: fakeAmountMantissa.toFixed(),
      });
    });

    it('returns transaction when request to repay a full loan succeeds', async () => {
      const wrapAndRepayMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        wrapAndRepay: wrapAndRepayMock,
      } as unknown as NativeTokenGateway;

      const response = await repay({
        signer: fakeSigner,
        vToken: vWeth,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmountMantissa,
        repayFullLoan: true,
        wrap: true,
      });

      expect(response).toBe(fakeContractTransaction);

      const amountWithBufferMantissa = fakeAmountMantissa.multipliedBy(
        1 + FULL_REPAYMENT_NATIVE_BUFFER_PERCENTAGE / 100,
      );

      expect(wrapAndRepayMock).toHaveBeenCalledTimes(1);
      expect(wrapAndRepayMock).toHaveBeenCalledWith({
        value: amountWithBufferMantissa.toFixed(),
      });
    });
  });

  describe('repay non-BNB loan', () => {
    it('returns transaction when request to repay a loan succeeds', async () => {
      const repayBorrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
      } as unknown as VBep20;

      (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vXvs,
        amountMantissa: fakeAmountMantissa,
        repayFullLoan: false,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
    });
  });
});
