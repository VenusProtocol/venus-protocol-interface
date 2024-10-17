import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { NativeTokenGateway, VBep20 } from 'libs/contracts';

import borrow from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

describe('borrow', () => {
  describe('borrow flow', () => {
    it('throws and error if VToken contract was not passed', async () => {
      try {
        borrow({
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
        functions: {
          borrow: borrowMock,
        },
        signer: fakeSigner,
      } as unknown as VBep20;

      const response = await borrow({
        vTokenContract: fakeVTokenContract,
        amountMantissa: fakeAmountMantissa,
      });

      expect(response).toStrictEqual({
        contract: fakeVTokenContract,
        args: [fakeAmountMantissa.toFixed()],
        methodName: 'borrow',
      });
    });
  });

  describe('borrow and unwrap flow', () => {
    it('throws and error if unwrap is passed as true but NativeTokenGateway contract was not passed', async () => {
      try {
        borrow({
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
        functions: {
          borrowAndUnwrap: borrowAndUnwrapMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = borrow({
        unwrap: true,
        amountMantissa: fakeAmountMantissa,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      });

      expect(response).toStrictEqual({
        contract: fakeNativeTokenGatewayContract,
        args: [fakeAmountMantissa.toFixed()],
        methodName: 'borrowAndUnwrap',
      });
    });
  });
});
