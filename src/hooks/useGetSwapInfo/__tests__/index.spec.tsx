import { CurrencyAmount as PSCurrencyAmount, Pair as PSPair } from '@pancakeswap/sdk/dist/index.js';
import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import fakeTokenCombinations from '__mocks__/models/tokenCombinations';
import { getPancakeSwapPairs } from 'clients/api';
import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import useGetSwapInfo from '..';
import { UseGetSwapInfoInput, UseGetSwapInfoOutput } from '../types';

jest.mock('clients/api');

const fakePairs: PSPair[] = fakeTokenCombinations.map(
  ([tokenA, tokenB]) =>
    new PSPair(
      PSCurrencyAmount.fromRawAmount(tokenA, new BigNumber(10).pow(tokenA.decimals).toFixed()),
      PSCurrencyAmount.fromRawAmount(tokenB, new BigNumber(10).pow(tokenB.decimals).toFixed()),
    ),
);

describe('pages/Swap/useGetSwapInfo', () => {
  it('returns default state when fromToken and toToken reference the same token', async () => {
    const input: UseGetSwapInfoInput = {
      fromToken: PANCAKE_SWAP_TOKENS.bnb,
      toToken: PANCAKE_SWAP_TOKENS.bnb,
      direction: 'exactAmountIn',
    };

    let result: UseGetSwapInfoOutput | undefined;

    const TestComponent: React.FC = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = useGetSwapInfo(input);
      return <></>;
    };

    renderComponent(<TestComponent />);

    expect(result).toEqual({
      swap: undefined,
      error: undefined,
      isLoading: expect.any(Boolean),
    });
  });

  it('returns an error when trade consists in a wrap', async () => {
    const input: UseGetSwapInfoInput = {
      fromToken: PANCAKE_SWAP_TOKENS.bnb,
      toToken: PANCAKE_SWAP_TOKENS.wbnb,
      direction: 'exactAmountIn',
    };

    let result: UseGetSwapInfoOutput | undefined;

    const TestComponent: React.FC = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = useGetSwapInfo(input);
      return <></>;
    };

    renderComponent(<TestComponent />);

    expect(result).toEqual({
      swap: undefined,
      error: 'WRAPPING_UNSUPPORTED',
      isLoading: expect.any(Boolean),
    });
  });

  it('returns an error when trade consists in an unwrap', async () => {
    const input: UseGetSwapInfoInput = {
      fromToken: PANCAKE_SWAP_TOKENS.wbnb,
      toToken: PANCAKE_SWAP_TOKENS.bnb,
      direction: 'exactAmountIn',
    };

    let result: UseGetSwapInfoOutput | undefined;

    const TestComponent: React.FC = () => {
      result = useGetSwapInfo(input);
      return <></>;
    };

    renderComponent(<TestComponent />);

    expect(result).toEqual({
      swap: undefined,
      error: 'UNWRAPPING_UNSUPPORTED',
      isLoading: expect.any(Boolean),
    });
  });

  describe('exactAmountIn', () => {
    it('returns no swap and no error if fromTokenAmountTokens is not provided', async () => {
      const input: UseGetSwapInfoInput = {
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        toToken: PANCAKE_SWAP_TOKENS.cake,
        toTokenAmountTokens: '1',
        direction: 'exactAmountIn',
      };

      let result: UseGetSwapInfoOutput | undefined;

      const TestComponent: React.FC = () => {
        result = useGetSwapInfo(input);
        return <></>;
      };

      renderComponent(<TestComponent />);

      expect(result).toEqual({
        swap: undefined,
        error: undefined,
        isLoading: expect.any(Boolean),
      });
    });

    it('returns an error if no trade is found for the input provided', async () => {
      // Remove pairs containing fromToken
      const customFakePairs = fakePairs.filter(
        fakePair =>
          fakePair.token0.address !== PANCAKE_SWAP_TOKENS.busd.address &&
          fakePair.token1.address !== PANCAKE_SWAP_TOKENS.busd.address,
      );

      (getPancakeSwapPairs as jest.Mock).mockImplementationOnce(async () => ({
        pairs: customFakePairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        fromTokenAmountTokens: '1',
        toToken: PANCAKE_SWAP_TOKENS.cake,
        direction: 'exactAmountIn',
      };

      let result: UseGetSwapInfoOutput | undefined;

      const TestComponent: React.FC = () => {
        result = useGetSwapInfo(input);
        return <></>;
      };

      renderComponent(<TestComponent />);

      await waitFor(() =>
        expect(result).toEqual({
          swap: undefined,
          error: 'INSUFFICIENT_LIQUIDITY',
          isLoading: expect.any(Boolean),
        }),
      );
    });

    it('returns swap in correct format if a trade is found', async () => {
      (getPancakeSwapPairs as jest.Mock).mockImplementationOnce(async () => ({
        pairs: fakePairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        fromTokenAmountTokens: '1',
        toToken: PANCAKE_SWAP_TOKENS.cake,
        direction: 'exactAmountIn',
      };

      let result: UseGetSwapInfoOutput | undefined;

      const TestComponent: React.FC = () => {
        result = useGetSwapInfo(input);
        return <></>;
      };

      renderComponent(<TestComponent />);

      await waitFor(() => expect(result?.swap).toBeDefined());
      expect(result).toMatchSnapshot();
    });
  });

  describe('exactAmountOut', () => {
    it('returns no swap and no error if toTokenAmountTokens is not provided', async () => {
      const input: UseGetSwapInfoInput = {
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        fromTokenAmountTokens: '1',
        toToken: PANCAKE_SWAP_TOKENS.cake,
        direction: 'exactAmountOut',
      };

      let result: UseGetSwapInfoOutput | undefined;

      const TestComponent: React.FC = () => {
        result = useGetSwapInfo(input);
        return <></>;
      };

      renderComponent(<TestComponent />);

      expect(result).toEqual({
        swap: undefined,
        error: undefined,
        isLoading: expect.any(Boolean),
      });
    });

    it('returns an error if no trade is found for the input provided', async () => {
      (getPancakeSwapPairs as jest.Mock).mockImplementationOnce(async () => ({ pairs: fakePairs }));

      const input: UseGetSwapInfoInput = {
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        toTokenAmountTokens: '10', // Higher amount than available liquidities in pools
        toToken: PANCAKE_SWAP_TOKENS.cake,
        direction: 'exactAmountOut',
      };

      let result: UseGetSwapInfoOutput | undefined;

      const TestComponent: React.FC = () => {
        result = useGetSwapInfo(input);
        return <></>;
      };

      renderComponent(<TestComponent />);

      await waitFor(() =>
        expect(result).toEqual({
          swap: undefined,
          error: 'INSUFFICIENT_LIQUIDITY',
          isLoading: expect.any(Boolean),
        }),
      );
    });

    it('returns swap in correct format if a trade is found', async () => {
      (getPancakeSwapPairs as jest.Mock).mockImplementationOnce(async () => ({
        pairs: fakePairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        toTokenAmountTokens: '0.5',
        toToken: PANCAKE_SWAP_TOKENS.cake,
        direction: 'exactAmountOut',
      };

      let result: UseGetSwapInfoOutput | undefined;

      const TestComponent: React.FC = () => {
        result = useGetSwapInfo(input);
        return <></>;
      };

      renderComponent(<TestComponent />);

      await waitFor(() => expect(result?.swap).toBeDefined());
      expect(result).toMatchSnapshot();
    });
  });
});
