import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { NativeTokenGateway, VBep20 } from 'libs/contracts';

import withdraw from '.';

const fakeAmount = new BigNumber('10000000000000000');

describe('withdraw', () => {
  describe('withdraw flow', async () => {
    it('throws an error when vToken contract was not passed', async () => {
      try {
        await withdraw({
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
        redeem: redeemMock,
      } as unknown as VBep20;

      const response = await withdraw({
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
        withdrawFullSupply: true,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(redeemMock).toHaveBeenCalledTimes(1);
      expect(redeemMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    });

    it('returns contract transaction when request to withdraw partial supply succeeds', async () => {
      const redeemUnderlyingMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        redeemUnderlying: redeemUnderlyingMock,
      } as unknown as VBep20;

      const response = await withdraw({
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(redeemUnderlyingMock).toHaveBeenCalledTimes(1);
      expect(redeemUnderlyingMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    });
  });

  describe('withdraw and unwrap flow', async () => {
    it('throws an error when unwrap was passed as true but NativeTokenGateway contract was not passed', async () => {
      try {
        await withdraw({
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
        redeemAndUnwrap: redeemAndUnwrapMock,
      } as unknown as NativeTokenGateway;

      const response = await withdraw({
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmount,
        withdrawFullSupply: true,
        unwrap: true,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(redeemAndUnwrapMock).toHaveBeenCalledTimes(1);
      expect(redeemAndUnwrapMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    });

    it('returns contract transaction when request to withdraw partial supply succeeds', async () => {
      const redeemUnderlyingAndUnwrapMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        redeemUnderlyingAndUnwrap: redeemUnderlyingAndUnwrapMock,
      } as unknown as NativeTokenGateway;

      const response = await withdraw({
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmount,
        unwrap: true,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(redeemUnderlyingAndUnwrapMock).toHaveBeenCalledTimes(1);
      expect(redeemUnderlyingAndUnwrapMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    });
  });
});
