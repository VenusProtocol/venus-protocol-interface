import { fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetLegacyPool } from 'clients/api';
import { Token } from 'types';

import PrimeCalculator from '..';
import { QUERY_PARAM_TOKEN_ADDRESS } from '../Form';
import TEST_IDS from '../testIds';

const pool = poolData[0];

const primeTokens = pool.assets.reduce<Token[]>((acc, asset) => {
  const distributions = asset.borrowDistributions.concat(asset.supplyDistributions);
  const hasPrimeDistribution = distributions.some(
    distribution => distribution.type === 'prime' || distribution.type === 'primeSimulation',
  );

  return hasPrimeDistribution ? [...acc, asset.vToken.underlyingToken] : acc;
}, []);

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('PrimeCalculator', () => {
  beforeEach(() => {
    (useSearchParams as Vi.Mock).mockImplementation(() => [new URLSearchParams(), vi.fn()]);

    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<PrimeCalculator />);
  });

  it('initializes the search params and form correctly when it contains no token address parameter', async () => {
    const mockSearchParams = new URLSearchParams();
    const mockSetSearchParams = vi.fn();
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    renderComponent(<PrimeCalculator />);

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        {
          tokenAddress: primeTokens[0].address,
        },
        {
          replace: true,
        },
      ),
    );
  });

  it('initializes the search params and form correctly when token address parameter is invalid', async () => {
    const mockSearchParams = new URLSearchParams({
      [QUERY_PARAM_TOKEN_ADDRESS]: 'invalid-token-address',
    });
    const mockSetSearchParams = vi.fn();
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    renderComponent(<PrimeCalculator />);

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        {
          tokenAddress: primeTokens[0].address,
        },
        {
          replace: true,
        },
      ),
    );
  });

  it('initializes the form correctly when token address parameter is valid', async () => {
    const mockSearchParams = new URLSearchParams({
      [QUERY_PARAM_TOKEN_ADDRESS]: primeTokens[1].address,
    });
    const mockSetSearchParams = vi.fn();
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    const { getByTestId } = renderComponent(<PrimeCalculator />);

    await waitFor(() => getByTestId(TEST_IDS.tokenSelect));

    const tokenSelect = getByTestId(TEST_IDS.tokenSelect) as HTMLInputElement;

    // Check value of select
    expect(tokenSelect.value).toEqual(primeTokens[1].address);
  });

  it('updates the search params correctly when changing selected token', async () => {
    const mockSearchParams = new URLSearchParams({
      [QUERY_PARAM_TOKEN_ADDRESS]: primeTokens[0].address,
    });
    const mockSetSearchParams = vi.fn();
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    const { getByTestId } = renderComponent(<PrimeCalculator />);

    await waitFor(() => getByTestId(TEST_IDS.tokenSelect));

    const tokenSelect = getByTestId(TEST_IDS.tokenSelect) as HTMLInputElement;

    // Check value of select
    expect(tokenSelect.value).toEqual(primeTokens[0].address);

    // Change select value
    fireEvent.change(tokenSelect, {
      target: { value: primeTokens[1].address },
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      {
        tokenAddress: primeTokens[1].address,
      },
      {
        replace: true,
      },
    );
  });
});
