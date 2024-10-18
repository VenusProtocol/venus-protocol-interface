import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { NativeTokenGateway, VBep20 } from 'libs/contracts';

import withdraw from '.';

const fakeAmount = new BigNumber('10000000000000000');

describe('withdraw', () => {
  describe('withdraw flow', async () => {
    it('throws an error when vToken contract was not passed', async () => {
      try {
        withdraw({
          amountMantissa: fakeAmount,
          withdrawFullSupply: true,
        });

        throw new Error('withdraw should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction when request to withdraw full supply succeeds', async () => {
      const redeemMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        functions: {
          redeem: redeemMock,
        },
        signer: fakeSigner,
      } as unknown as VBep20;

      const response = withdraw({
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
        withdrawFullSupply: true,
      });

      expect(response).toStrictEqual({
        contract: fakeVTokenContract,
        args: [fakeAmount.toString()],
        methodName: 'redeem',
      });
    });

    it('returns contract transaction when request to withdraw partial supply succeeds', async () => {
      const redeemUnderlyingMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        functions: {
          redeemUnderlying: redeemUnderlyingMock,
        },
        signer: fakeSigner,
      } as unknown as VBep20;

      const response = withdraw({
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
      });

      expect(response).toStrictEqual({
        contract: fakeVTokenContract,
        args: [fakeAmount.toString()],
        methodName: 'redeemUnderlying',
      });
    });
  });

  describe('withdraw and unwrap flow', async () => {
    it('throws an error when unwrap was passed as true but NativeTokenGateway contract was not passed', async () => {
      try {
        withdraw({
          amountMantissa: fakeAmount,
          unwrap: true,
        });

        throw new Error('withdraw should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction when request to withdraw full supply succeeds', async () => {
      const redeemAndUnwrapMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        functions: {
          redeemAndUnwrap: redeemAndUnwrapMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = withdraw({
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmount,
        withdrawFullSupply: true,
        unwrap: true,
      });

      expect(response).toStrictEqual({
        contract: fakeNativeTokenGatewayContract,
        args: [fakeAmount.toString()],
        methodName: 'redeemAndUnwrap',
      });
    });

    it('returns contract transaction when request to withdraw partial supply succeeds', async () => {
      const redeemUnderlyingAndUnwrapMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        functions: {
          redeemUnderlyingAndUnwrap: redeemUnderlyingAndUnwrapMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = withdraw({
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmount,
        unwrap: true,
      });

      expect(response).toStrictEqual({
        contract: fakeNativeTokenGatewayContract,
        args: [fakeAmount.toString()],
        methodName: 'redeemUnderlyingAndUnwrap',
      });
    });
  });
});
