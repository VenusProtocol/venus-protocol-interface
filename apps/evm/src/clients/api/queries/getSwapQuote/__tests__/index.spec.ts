import { bnb, xvs } from '__mocks__/models/tokens';
import { VError } from 'libs/errors';
import { ChainId } from 'types';
import type Vi from 'vitest';
import { type GetSwapQuoteInput, getSwapQuote } from '../';
import type { ZeroXQuoteResponse } from '../types';

const fakeParams: GetSwapQuoteInput = {
  apiUrl: 'fake-api-url',
  chainId: ChainId.BSC_TESTNET,
  fromToken: xvs,
  toToken: bnb,
  direction: 'exactAmountIn',
  fromTokenAmountTokens: '1',
};

const fakeQuoteResponse: ZeroXQuoteResponse = {
  sellAmount: '10000000000000000',
  buyAmount: '20000000000000000',
  estimatedPriceImpact: '0.5',
  price: '20000000000000000',
  data: 'fake-transaction-data',
  allowanceTarget: 'fake-allowance-target',
};

describe('getSwapQuote', () => {
  it.each([
    { direction: 'exactAmountIn', fromTokenAmountTokens: undefined },
    { direction: 'exactAmountIn', fromTokenAmountTokens: '0' },
    { direction: 'exactAmountOut', toTokenAmountTokens: undefined },
    { direction: 'exactAmountOut', toTokenAmountTokens: '0' },
  ] as Partial<GetSwapQuoteInput>[])(
    'returns an empty response when input is invalid: %s',
    async input => {
      const result = await getSwapQuote({ ...fakeParams, ...input });

      expect(result).toStrictEqual({
        swap: undefined,
        error: undefined,
      });
    },
  );

  it('throws unexpected error if request to 0x API fails', async () => {
    (fetch as Vi.Mock).mockImplementationOnce(() => {
      throw new Error('fake error');
    });

    try {
      await getSwapQuote(fakeParams);

      throw new Error('getSwapQuote should have thrown an error but did not');
    } catch (error: any) {
      expect(error).toBeInstanceOf(VError);
      expect(error.code).toBe('somethingWentWrong');
    }
  });

  it('returns INSUFFICIENT_LIQUIDITY error if requests succeeds but returns no swap', async () => {
    (fetch as Vi.Mock).mockImplementationOnce(() => ({
      json: () => ({
        code: 1,
      }),
    }));

    const result = await getSwapQuote(fakeParams);

    expect(result).toStrictEqual({
      swap: undefined,
      error: 'INSUFFICIENT_LIQUIDITY',
    });
  });

  it('returns "exact amount in" swap in the correct format on success', async () => {
    (fetch as Vi.Mock).mockImplementationOnce(() => ({
      json: () => fakeQuoteResponse,
    }));

    const result = await getSwapQuote({
      ...fakeParams,
      direction: 'exactAmountIn',
      fromTokenAmountTokens: '1',
    });

    expect(result).toMatchSnapshot();
  });

  it('returns "exact amount out" swap in the correct format on success', async () => {
    (fetch as Vi.Mock).mockImplementationOnce(() => ({
      json: () => fakeQuoteResponse,
    }));

    const result = await getSwapQuote({
      ...fakeParams,
      direction: 'exactAmountOut',
      toTokenAmountTokens: '1',
    });

    expect(result).toMatchSnapshot();
  });
});
