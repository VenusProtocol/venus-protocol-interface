import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

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

import repay from '.';

const fakeAmountMantissa = new BigNumber(10000000000000000);

vi.mock('libs/contracts');

describe('repay', () => {
  describe('repay BNB loan', () => {
    it('returns transaction when request to repay full loan succeeds', async () => {
      const repayBehalfExplicitMock = vi.fn(async () => fakeContractTransaction);

      const fakeMaximillionContract = {
        repayBehalfExplicit: repayBehalfExplicitMock,
        signer: fakeSigner,
      } as unknown as Maximillion;

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
        maximillionContract: fakeMaximillionContract,
        repayFullLoan: true,
      });

      expect(response).toStrictEqual({
        contract: fakeMaximillionContract,
        args: [fakeSignerAddress, vBnb.address],
        overrides: {
          value: fakeAmountMantissa.toFixed(),
        },
        methodName: 'repayBehalfExplicit',
      });
    });

    it('returns transaction when request to repay partial loan succeeds', async () => {
      const repayBorrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        repayBorrow: repayBorrowMock,
        signer: fakeSigner,
      } as unknown as VBnb;

      (getVTokenContract as Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vBnb,
        amountMantissa: fakeAmountMantissa,
        repayFullLoan: false,
      });

      expect(response).toStrictEqual({
        contract: fakeVTokenContract,
        args: [],
        overrides: {
          value: fakeAmountMantissa.toFixed(),
        },
        methodName: 'repayBorrow',
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
        functions: {
          wrapAndRepay: wrapAndRepayMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = await repay({
        signer: fakeSigner,
        vToken: vWeth,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmountMantissa,
        wrap: true,
      });

      expect(response).toStrictEqual({
        contract: fakeNativeTokenGatewayContract,
        args: [],
        overrides: {
          value: fakeAmountMantissa.toFixed(),
        },
        methodName: 'wrapAndRepay',
      });
    });

    it('returns transaction when request to repay a full loan succeeds', async () => {
      const wrapAndRepayMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        functions: {
          wrapAndRepay: wrapAndRepayMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = await repay({
        signer: fakeSigner,
        vToken: vWeth,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmountMantissa,
        repayFullLoan: true,
        wrap: true,
      });

      expect(response).toStrictEqual({
        contract: fakeNativeTokenGatewayContract,
        args: [],
        overrides: {
          value: fakeAmountMantissa.toFixed(),
        },
        methodName: 'wrapAndRepay',
      });
    });
  });

  describe('repay non-BNB loan', () => {
    it('returns transaction when request to repay a loan succeeds', async () => {
      const repayBorrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        functions: {
          repayBorrow: repayBorrowMock,
        },
        signer: fakeSigner,
      } as unknown as VBep20;

      (getVTokenContract as Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        signer: fakeSigner,
        vToken: vXvs,
        amountMantissa: fakeAmountMantissa,
        repayFullLoan: false,
      });

      expect(response).toStrictEqual({
        contract: fakeVTokenContract,
        args: [fakeAmountMantissa.toFixed()],
        methodName: 'repayBorrow',
      });
    });
  });
});
