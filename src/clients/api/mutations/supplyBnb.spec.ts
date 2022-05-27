import BigNumber from 'bignumber.js';
import {
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import { VBnbToken } from 'types/contracts';
import { VBEP_TOKENS } from 'constants/tokens';
import supplyBnb from './supplyBnb';

const fakeAmount = new BigNumber(10000000000000000);

describe('api/mutation/supplyBnb', () => {
  test('throws an error when request fails', async () => {
    const fakeWeb3 = {
      eth: {
        sendTransaction: async () => {
          throw new Error('Fake error message');
        },
      },
    } as any;

    const fakeContract = {
      methods: {
        mint: () => ({
          encodeABI: () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBnbToken;

    try {
      await supplyBnb({
        web3: fakeWeb3,
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    const fakeWeb3 = {
      eth: {
        sendTransaction: async () => ({
          events: {
            Failure: {
              returnValues: {
                info: '2',
                error: '2',
              },
            },
          },
        }),
      },
    } as any;

    const fakeContract = {
      methods: {
        mint: () => ({
          encodeABI: () => ({}),
        }),
      },
    } as unknown as VBnbToken;

    try {
      await supplyBnb({
        web3: fakeWeb3,
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: ${TokenErrorReporterError[2]}]`);
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('transaction');
        expect(error.data.error).toBe(TokenErrorReporterError[2]);
        expect(error.data.info).toBe(TokenErrorReporterFailureInfo[2]);
      }
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const fakeAccount = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
    const fakeTransactionReceipt = { events: {} };
    const sendTransactionMock = jest.fn(async () => fakeTransactionReceipt);
    const ethMock = {
      sendTransaction: sendTransactionMock,
    };

    const fakeEncodedUri =
      '00000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000000000000000000000000000000000000000000064';

    const fakeWeb3 = {
      eth: ethMock,
    } as any;

    const fakeContract = {
      methods: {
        mint: () => ({
          encodeABI: () => fakeEncodedUri,
        }),
      },
    } as unknown as VBnbToken;

    const response = await supplyBnb({
      web3: fakeWeb3,
      tokenContract: fakeContract,
      amountWei: fakeAmount,
      account: fakeAccount,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(sendTransactionMock).toHaveBeenCalledTimes(1);
    expect(sendTransactionMock).toHaveBeenCalledWith({
      from: fakeAccount,
      data: fakeEncodedUri,
      value: fakeAmount.toFixed(),
      to: VBEP_TOKENS.bnb.address,
    });
  });
});
