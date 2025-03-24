import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { vUsdt } from '__mocks__/models/vTokens';
import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';

import withdraw from '..';

const fakeAmount = new BigNumber('10000000000000000');
const fakeAccessList = [{ address: '0xfakeAddress', storageKeys: ['0xfakeStorageKey'] }];
const fakePublicClient = {
  createAccessList: vi.fn(async () => ({
    accessList: fakeAccessList,
    gasUsed: 100000n,
  })),
} as unknown as PublicClient;

describe('withdraw', () => {
  describe('withdraw flow', async () => {
    it('throws an error when vToken contract was not passed', async () => {
      try {
        await withdraw({
          vToken: vUsdt,
          amountMantissa: fakeAmount,
          withdrawFullSupply: true,
          publicClient: fakePublicClient,
        });

        throw new Error('withdraw should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction data when request to withdraw full supply succeeds', async () => {
      const redeemMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        functions: {
          redeem: redeemMock,
        },
        signer: fakeSigner,
      } as unknown as VBep20;

      const response = await withdraw({
        vToken: vUsdt,
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
        withdrawFullSupply: true,
        publicClient: fakePublicClient,
      });

      expect(response).toMatchSnapshot();
    });

    it('returns contract transaction data when request to withdraw partial supply succeeds', async () => {
      const redeemUnderlyingMock = vi.fn(async () => fakeContractTransaction);

      const fakeVTokenContract = {
        functions: {
          redeemUnderlying: redeemUnderlyingMock,
        },
        signer: fakeSigner,
      } as unknown as VBep20;

      const response = await withdraw({
        vToken: vUsdt,
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
        publicClient: fakePublicClient,
      });

      expect(response).toMatchSnapshot();
    });

    it('includes accessList when underlying token is native', async () => {
      const redeemUnderlyingMock = vi.fn(async () => fakeContractTransaction);
      const fakeAccountAddress = '0xfakeUserAddress' as Address;
      const getAddressMock = vi.fn(async () => fakeAccountAddress);

      const fakeVTokenContract = {
        functions: {
          redeemUnderlying: redeemUnderlyingMock,
        },
        signer: {
          ...fakeSigner,
          getAddress: getAddressMock,
        },
      } as unknown as VBnb;

      const response = await withdraw({
        vToken: {
          ...vUsdt,
          underlyingToken: {
            ...vUsdt.underlyingToken,
            isNative: true,
          },
        },
        tokenContract: fakeVTokenContract,
        amountMantissa: fakeAmount,
        publicClient: fakePublicClient,
      });

      expect(fakePublicClient.createAccessList).toHaveBeenCalledWith({
        data: '0x',
        value: 1n,
        to: fakeAccountAddress,
      });

      expect(response).toMatchSnapshot();
    });
  });

  describe('withdraw and unwrap flow', async () => {
    it('throws an error when unwrap was passed as true but NativeTokenGateway contract was not passed', async () => {
      try {
        await withdraw({
          vToken: vUsdt,
          amountMantissa: fakeAmount,
          unwrap: true,
          publicClient: fakePublicClient,
        });

        throw new Error('withdraw should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction data when request to withdraw full supply succeeds', async () => {
      const redeemAndUnwrapMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        functions: {
          redeemAndUnwrap: redeemAndUnwrapMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = await withdraw({
        vToken: vUsdt,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmount,
        withdrawFullSupply: true,
        unwrap: true,
        publicClient: fakePublicClient,
      });

      expect(response).toMatchSnapshot();
    });

    it('returns contract transaction data when request to withdraw partial supply succeeds', async () => {
      const redeemUnderlyingAndUnwrapMock = vi.fn(async () => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        functions: {
          redeemUnderlyingAndUnwrap: redeemUnderlyingAndUnwrapMock,
        },
        signer: fakeSigner,
      } as unknown as NativeTokenGateway;

      const response = await withdraw({
        vToken: vUsdt,
        nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
        amountMantissa: fakeAmount,
        unwrap: true,
        publicClient: fakePublicClient,
      });

      expect(response).toMatchSnapshot();
    });
  });
});
