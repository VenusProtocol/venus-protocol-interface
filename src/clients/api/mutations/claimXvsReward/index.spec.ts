import { VError } from 'errors';

import address from '__mocks__/models/address';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VBEP_TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

import claimXvsReward from '.';
import getVTokenBalancesAll from '../../queries/getVTokenBalancesAll';

jest.mock('../../queries/getVTokenBalancesAll');

describe('api/mutation/claimXvsReward', () => {
  test('throws an error when request fails', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => ({ balances: [] }));

    const fakeContract = {
      methods: {
        'claimVenus(address,address[])': () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await claimXvsReward({
        comptrollerContract: fakeContract,
        fromAccountAddress: address,
      });

      throw new Error('claimXvsReward should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => ({
      balances: [
        {
          balanceOf: '0',
          balanceOfUnderlying: '0',
          borrowBalanceCurrent: '0',
          tokenAllowance: '0',
          tokenBalance: '0',
          vToken: VBEP_TOKENS.aave.address,
        },
        {
          balanceOf: '0',
          balanceOfUnderlying: '0',
          borrowBalanceCurrent: '20000000',
          tokenAllowance: '0',
          tokenBalance: '0',
          vToken: VBEP_TOKENS.btcb.address,
        },
        {
          balanceOf: '0',
          balanceOfUnderlying: '100000000',
          borrowBalanceCurrent: '0',
          tokenAllowance: '0',
          tokenBalance: '0',
          vToken: VBEP_TOKENS.bnb.address,
        },
      ],
    }));

    const fakeContract = {
      methods: {
        'claimVenus(address,address[])': () => ({
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
    } as unknown as Comptroller;

    try {
      await claimXvsReward({
        comptrollerContract: fakeContract,
        fromAccountAddress: address,
      });

      throw new Error('claimXvsReward should have thrown an error but did not');
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

  test('send claim request with correct arguments and returns transaction receipt when request succeeds', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => ({
      balances: [
        {
          balanceOf: '0',
          balanceOfUnderlying: '0',
          borrowBalanceCurrent: '0',
          tokenAllowance: '0',
          tokenBalance: '0',
          vToken: VBEP_TOKENS.aave.address,
        },
        {
          balanceOf: '0',
          balanceOfUnderlying: '0',
          borrowBalanceCurrent: '20000000',
          tokenAllowance: '0',
          tokenBalance: '0',
          vToken: VBEP_TOKENS.btcb.address,
        },
        {
          balanceOf: '0',
          balanceOfUnderlying: '100000000',
          borrowBalanceCurrent: '0',
          tokenAllowance: '0',
          tokenBalance: '0',
          vToken: VBEP_TOKENS.bnb.address,
        },
      ],
    }));

    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const claimVenusMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        'claimVenus(address,address[])': claimVenusMock,
      },
    } as unknown as Comptroller;

    const response = await claimXvsReward({
      comptrollerContract: fakeContract,
      fromAccountAddress: address,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(claimVenusMock).toHaveBeenCalledTimes(1);

    // TODO [VEN-198] Currently claiming all address until the pendingVenus function is updated with pending rewards
    const expectedVTokenAddresses = Object.values(VBEP_TOKENS).map(vToken => vToken.address);
    expect(claimVenusMock).toHaveBeenCalledWith(address, expectedVTokenAddresses);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
