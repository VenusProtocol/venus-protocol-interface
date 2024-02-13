import { Bep20 } from 'libs/contracts';
import noop from 'noop-ts';

import callOrThrow from '..';

describe('utilities/callOrThrow', () => {
  it('throws when a required parameter is undefined', () => {
    try {
      callOrThrow(
        {
          multicallContract: undefined,
        },
        noop,
      );

      throw new Error('callOrThrow should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: couldNotRetrieveSigner]');
    }
  });

  it('calls callback when all parameters are defined', () => {
    const fakeContract = {} as unknown as Bep20;

    const res = callOrThrow(
      {
        contract: fakeContract,
      },
      ({ contract }) => contract,
    );

    expect(res).toBe(fakeContract);
  });
});
