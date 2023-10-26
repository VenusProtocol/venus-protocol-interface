import { renderHook } from '@testing-library/react-hooks';
import noop from 'noop-ts';
import { UseMutateFunction, useMutation } from 'react-query';
import Vi from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import FunctionKey from 'constants/functionKey';

import { useSendTransaction } from '..';
import { CONFIRMATIONS, useTrackTransaction } from '../useTrackTransaction';

vi.mock('react-query');
vi.mock('../useTrackTransaction');

const fakeFnKey = FunctionKey.SUPPLY;
const fakeInput = {};

describe('useSendTransaction', () => {
  beforeEach(() => {
    (useMutation as Vi.Mock).mockImplementation((_fnKey: unknown, fn: UseMutateFunction) => ({
      mutateAsync: fn,
    }));
  });

  it('sends transaction and tracks it', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    const fnMock = vi.fn(async () => fakeContractTransaction);
    const fakeOptions = {
      onSuccess: noop,
    };

    const { result } = renderHook(() =>
      useSendTransaction({
        fn: fnMock,
        fnKey: fakeFnKey,
        onConfirmed: noop,
        onReverted: noop,
        options: fakeOptions,
      }),
    );

    expect(useMutation).toHaveBeenCalledTimes(1);
    expect(useMutation).toHaveBeenCalledWith(fakeFnKey, expect.any(Function), fakeOptions);

    const { mutateAsync } = result.current;

    // Send transaction
    await mutateAsync(fakeInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeInput);

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transaction: fakeContractTransaction,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });

    expect(fakeContractTransaction.wait).not.toHaveBeenCalled();
  });

  it('sends transaction, tracks it and waits for its confirmation before returning', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    const fnMock = vi.fn(async () => fakeContractTransaction);
    const fakeOptions = {
      onSuccess: noop,
      waitForConfirmation: true,
    };

    const { result } = renderHook(() =>
      useSendTransaction({
        fn: fnMock,
        fnKey: fakeFnKey,
        onConfirmed: noop,
        onReverted: noop,
        options: fakeOptions,
      }),
    );

    expect(useMutation).toHaveBeenCalledTimes(1);
    expect(useMutation).toHaveBeenCalledWith(fakeFnKey, expect.any(Function), fakeOptions);

    const { mutateAsync } = result.current;

    // Send transaction
    await mutateAsync(fakeInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeInput);

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transaction: fakeContractTransaction,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });

    expect(fakeContractTransaction.wait).toHaveBeenCalledTimes(1);
    expect(fakeContractTransaction.wait).toHaveBeenCalledWith(CONFIRMATIONS);
  });
});
