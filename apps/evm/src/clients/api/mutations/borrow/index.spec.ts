import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { NativeTokenGateway, VBep20 } from 'libs/contracts';

import borrow from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

describe('borrow', () => {
  describe('borrow flow', () => {
    it('throws and error if VToken contract was not passed', async () => {
      try {
        await borrow({
          amountMantissa: fakeAmountMantissa,
        });

        throw new Error('borrow should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction when request succeeds', async () => {
      const borrowMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        borrow: borrowMock,
      } as unknown as VBep20;

      const response = await borrow({
        vTokenContract: fakeVTokenContract,
        amountMantissa: fakeAmountMantissa,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(borrowMock).toHaveBeenCalledTimes(1);
      expect(borrowMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
    });
  });

  describe('borrow and unwrap flow', () => {
    it('throws and error if unwrap is passed as true but NativeTokenGateway contract was not passed', async () => {
      try {
        await borrow({
          unwrap: true,
          amountMantissa: fakeAmountMantissa,
        });

        throw new Error('borrow should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction when request succeeds', async () => {
      const borrowAndUnwrapMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        borrowAndUnwrap: borrowAndUnwrapMock,
      } as unknown as NativeTokenGateway;

      const response = await borrow({
        unwrap: true,
        amountMantissa: fakeAmountMantissa,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      });

      expect(response).toBe(fakeContractTransaction);
      expect(borrowAndUnwrapMock).toHaveBeenCalledTimes(1);
      expect(borrowAndUnwrapMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
    });
  });
});
