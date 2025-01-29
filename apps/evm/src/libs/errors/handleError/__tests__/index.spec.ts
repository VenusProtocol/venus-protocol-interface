import type { Mock } from 'vitest';

import { VError } from 'libs/errors';
import { displayNotification } from 'libs/notifications';

import { handleError } from '..';

vi.mock('libs/notifications');

describe('handleError', () => {
  it('calls displayNotification with the right argument when passing an Error instance', () => {
    const fakeError = new Error('Fake error');

    handleError({ error: fakeError });

    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      variant: 'error',
      description: fakeError.message,
    });
  });

  it.each([
    new VError({
      type: 'unexpected',
      code: 'walletNotConnected',
    }),
    new VError({
      type: 'transaction',
      code: 'MARKET_NOT_ENTERED',
      data: {
        error: 'NO_ERROR',
        info: 'NO_ERROR',
      },
    }),
    new VError({
      type: 'interaction',
      code: 'accountError',
    }),
    new VError({
      type: 'proposal',
      code: 'noMetaKey',
    }),
  ])(
    'calls displayNotification with the right argument when passing a VError instance. %s',
    fakeError => {
      handleError({ error: fakeError });

      expect(displayNotification).toHaveBeenCalledTimes(1);
      expect((displayNotification as Mock).mock.calls[0][0]).toMatchSnapshot();
    },
  );
});
