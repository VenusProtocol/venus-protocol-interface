import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import enterMarkets from './enterMarkets';

describe('api/mutation/enterMarkets', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        enterMarkets: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await enterMarkets({
        comptrollerContract: fakeContract,
        accountAddress: '0x32asdf',
        vtokenAddresses: ['0x32asdf'],
      });

      throw new Error('enterMarkets should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    const fakeContract = {
      methods: {
        enterMarkets: () => ({
          send: async () => ({
            events: {
              Failure: {
                returnValues: {
                  info: '1',
                  error: '1',
                },
              },
            },
          }),
        }),
      },
    } as any;

    try {
      await enterMarkets({
        comptrollerContract: fakeContract,
        accountAddress: '0x32asdf',
        vtokenAddresses: ['0x32asdf'],
      });

      throw new Error('enterMarkets should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: ${ComptrollerErrorReporterError[1]}]`);
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('transaction');
        expect(error.data.error).toBe(ComptrollerErrorReporterError[1]);
        expect(error.data.info).toBe(ComptrollerErrorReporterFailureInfo[1]);
      }
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const account = { address: '0x3d7598124C212d2121234cd36aFe1c685FbEd848' };
    const vtokenAddresses = ['0x3d759121234cd36F8124C21aFe1c6852d2bEd848'];
    const fakeTransactionReceipt = { events: {} };
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const enterMarketsMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        enterMarkets: enterMarketsMock,
      },
    } as unknown as any;

    const response = await enterMarkets({
      comptrollerContract: fakeContract,
      accountAddress: account.address,
      vtokenAddresses,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith(vtokenAddresses);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: account.address });
  });
});
