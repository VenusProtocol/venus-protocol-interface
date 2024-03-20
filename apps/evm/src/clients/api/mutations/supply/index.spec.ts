import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { vBnb, vXvs } from '__mocks__/models/vTokens';
import { getNativeTokenGatewayContract } from 'libs/contracts';

import { type VBep20, type VBnb, getVTokenContract } from 'libs/contracts';

import supply from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('libs/contracts');

describe('supply', () => {
  describe('supply flow', () => {
    describe('supply BNB', () => {
      it('returns contract transaction when request succeeds', async () => {
        const mintMock = vi.fn(() => fakeContractTransaction);

        const fakeNativeTokenGatewayContract = {
          mint: mintMock,
        } as unknown as VBep20;

        (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeNativeTokenGatewayContract);

        const response = await supply({
          signer: fakeSigner,
          vToken: vBnb,
          amountMantissa: fakeAmountMantissa,
        });

        expect(response).toBe(fakeContractTransaction);

        expect(mintMock).toHaveBeenCalledTimes(1);
        expect(mintMock).toHaveBeenCalledWith({
          value: fakeAmountMantissa.toFixed(),
        });
      });
    });

    describe('supply non-BNB token', () => {
      it('returns contract transaction when request succeeds', async () => {
        const mintMock = vi.fn(() => fakeContractTransaction);

        const fakeNativeTokenGatewayContract = {
          mint: mintMock,
        } as unknown as VBnb;

        (getVTokenContract as Vi.Mock).mockImplementationOnce(() => fakeNativeTokenGatewayContract);

        const response = await supply({
          signer: fakeSigner,
          vToken: vXvs,
          amountMantissa: fakeAmountMantissa,
        });

        expect(response).toBe(fakeContractTransaction);

        expect(mintMock).toHaveBeenCalledTimes(1);
        expect(mintMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
      });
    });
  });

  describe('wrap and supply flow', () => {
    it('throws an error when wrap is passed as true but not all required parameters are passed', async () => {
      try {
        await supply({
          wrap: true,
          signer: fakeSigner,
          amountMantissa: fakeAmountMantissa,
          accountAddress: fakeAccountAddress,
          poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
        });

        throw new Error('supply should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
      }
    });

    it('returns contract transaction when request succeeds', async () => {
      const wrapAndSupplyMock = vi.fn(() => fakeContractTransaction);

      const fakeNativeTokenGatewayContract = {
        wrapAndSupply: wrapAndSupplyMock,
      } as unknown as VBnb;

      (getNativeTokenGatewayContract as Vi.Mock).mockImplementationOnce(
        () => fakeNativeTokenGatewayContract,
      );

      const response = await supply({
        wrap: true,
        signer: fakeSigner,
        amountMantissa: fakeAmountMantissa,
        accountAddress: fakeAccountAddress,
        poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
      });

      expect(response).toBe(fakeContractTransaction);

      expect(wrapAndSupplyMock).toHaveBeenCalledTimes(1);
      expect(wrapAndSupplyMock).toHaveBeenCalledWith(fakeAccountAddress, {
        value: fakeAmountMantissa.toFixed(),
      });
    });
  });
});
