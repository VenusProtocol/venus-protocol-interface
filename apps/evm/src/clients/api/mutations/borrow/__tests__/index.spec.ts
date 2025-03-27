import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { vBnb, vUsdc } from '__mocks__/models/vTokens';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';

import borrow from '..';

const fakeAmountMantissa = new BigNumber('10000000000000000');
const fakeAccessList = [{ address: '0xfakeAddress', storageKeys: ['0xfakeStorageKey'] }];
const fakePublicClient = {
  createAccessList: vi.fn(async () => ({
    accessList: fakeAccessList,
    gasUsed: 100000n,
  })),
} as unknown as PublicClient;

describe('borrow', () => {
  describe('borrow flow', () => {
    it('throws and error if VToken contract was not passed', async () => {
      try {
        await borrow({
          vToken: vBnb,
          publicClient: fakePublicClient,
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
        vToken: vUsdc,
        publicClient: fakePublicClient,
        vTokenContract: fakeVTokenContract,
        amountMantissa: fakeAmountMantissa,
      });

      expect(response).toMatchSnapshot();
    });

    it('includes accessList when underlying token is native', async () => {
      const borrowMock = vi.fn(async () => fakeContractTransaction);
      const fakeAccountAddress = '0xfakeUserAddress' as Address;
      const getAddressMock = vi.fn(async () => fakeAccountAddress);

      const fakeVTokenContract = {
        functions: {
          borrow: borrowMock,
        },
        signer: {
          ...fakeSigner,
          getAddress: getAddressMock,
        },
      } as unknown as VBnb;

      const response = await borrow({
        vToken: {
          ...vBnb,
          underlyingToken: {
            ...vBnb.underlyingToken,
            isNative: true,
          },
        },
        publicClient: fakePublicClient,
        vTokenContract: fakeVTokenContract,
        amountMantissa: fakeAmountMantissa,
      });

      expect(fakePublicClient.createAccessList).toHaveBeenCalledWith({
        data: '0x',
        value: 1n,
        to: fakeAccountAddress,
      });

      expect(response).toMatchSnapshot();
    });
  });

  describe('borrow and unwrap flow', () => {
    it('throws and error if unwrap is passed as true but NativeTokenGateway contract was not passed', async () => {
      try {
        await borrow({
          vToken: vBnb,
          publicClient: fakePublicClient,
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

      const response = await borrow({
        vToken: vBnb,
        publicClient: fakePublicClient,
        unwrap: true,
        amountMantissa: fakeAmountMantissa,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      });

      expect(response).toMatchSnapshot();
    });
  });
});
