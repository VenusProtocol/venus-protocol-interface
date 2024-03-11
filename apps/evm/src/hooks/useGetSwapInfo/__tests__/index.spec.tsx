import { waitFor } from '@testing-library/react';
import Vi from 'vitest';

import fakePancakeSwapPairs from '__mocks__/models/pancakeSwapPairs';
import { bnb, wbnb, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { getPancakeSwapPairs } from 'clients/api';

import useGetSwapInfo from '..';
import { UseGetSwapInfoInput, UseGetSwapInfoOutput } from '../types';

describe('pages/Swap/useGetSwapInfo', () => {
  it('returns default state when fromToken and toToken reference the same token', async () => {
    const input: UseGetSwapInfoInput = {
      fromToken: bnb,
      toToken: bnb,
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

  it('returns an error when trade consists in a wrap', async () => {
    const input: UseGetSwapInfoInput = {
      fromToken: bnb,
      toToken: wbnb,
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
      error: 'WRAPPING_UNSUPPORTED',
      isLoading: expect.any(Boolean),
    });
  });

  it('returns an error when trade consists in an unwrap', async () => {
    const input: UseGetSwapInfoInput = {
      fromToken: wbnb,
      toToken: bnb,
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
        fromToken: bnb,
        toToken: xvs,
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
      const customfakePancakeSwapPairs = fakePancakeSwapPairs.filter(
        fakePair =>
          fakePair.token0.address !== bnb.address && fakePair.token1.address !== xvs.address,
      );

      (getPancakeSwapPairs as Vi.Mock).mockImplementationOnce(async () => ({
        pairs: customfakePancakeSwapPairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: bnb,
        fromTokenAmountTokens: '1',
        toToken: xvs,
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
      (getPancakeSwapPairs as Vi.Mock).mockImplementationOnce(async () => ({
        pairs: fakePancakeSwapPairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: bnb,
        fromTokenAmountTokens: '1',
        toToken: xvs,
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
        fromToken: bnb,
        fromTokenAmountTokens: '1',
        toToken: xvs,
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
      (getPancakeSwapPairs as Vi.Mock).mockImplementationOnce(async () => ({
        pairs: fakePancakeSwapPairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: bnb,
        toTokenAmountTokens: '10', // Higher amount than available liquidities in pools
        toToken: xvs,
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
      (getPancakeSwapPairs as Vi.Mock).mockImplementationOnce(async () => ({
        pairs: fakePancakeSwapPairs,
      }));

      const input: UseGetSwapInfoInput = {
        fromToken: bnb,
        toTokenAmountTokens: '0.5',
        toToken: xvs,
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
