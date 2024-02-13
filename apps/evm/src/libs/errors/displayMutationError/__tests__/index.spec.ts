import { VError } from 'libs/errors';
import { displayNotification } from 'libs/notifications';
import Vi from 'vitest';

import { displayMutationError } from '..';

vi.mock('libs/notifications');

describe('displayMutationError', () => {
  it('calls displayNotification with the right argument when passing an Error instance', () => {
    const fakeError = new Error('Fake error');

    displayMutationError({ error: fakeError });

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
      displayMutationError({ error: fakeError });

      expect(displayNotification).toHaveBeenCalledTimes(1);
      expect((displayNotification as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();
    },
  );
});
