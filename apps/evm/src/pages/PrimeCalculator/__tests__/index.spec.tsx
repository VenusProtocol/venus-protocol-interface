import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { en } from 'libs/translations';
import { useSearchParams } from 'react-router-dom';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { primeEstimationData } from '__mocks__/models/primeEstimation';
import { renderComponent } from 'testUtils/render';

import { useGetLegacyPool, useGetPrimeEstimation, useGetPrimeStatus } from 'clients/api';
import { Asset } from 'types';

import PrimeCalculator from '..';
import { QUERY_PARAM_TOKEN_ADDRESS } from '../Form';
import TEST_IDS from '../testIds';

const pool = poolData[0];

const primeAssets = pool.assets.reduce<Asset[]>((acc, asset) => {
  const distributions = asset.borrowDistributions.concat(asset.supplyDistributions);
  const hasPrimeDistribution = distributions.some(
    distribution => distribution.type === 'prime' || distribution.type === 'primeSimulation',
  );

  return hasPrimeDistribution ? [...acc, asset] : acc;
}, []);

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

const mockSetSearchParams = vi.fn();

describe('PrimeCalculator', () => {
  beforeEach(() => {
    const mockSearchParams = new URLSearchParams({
      [QUERY_PARAM_TOKEN_ADDRESS]: primeAssets[0].vToken.address,
    });
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    (useGetPrimeEstimation as Vi.Mock).mockImplementation(() => ({
      data: primeEstimationData,
    }));

    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        primeMaximumStakedXvsMantissa: new BigNumber('10000000000000000000000'),
        primeMinimumStakedXvsMantissa: new BigNumber('1000000000000000000000'),
      },
      isLoading: false,
    }));

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
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    renderComponent(<PrimeCalculator />);

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        {
          tokenAddress: primeAssets[0].vToken.address,
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
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    renderComponent(<PrimeCalculator />);

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        {
          tokenAddress: primeAssets[0].vToken.address,
        },
        {
          replace: true,
        },
      ),
    );
  });

  it('initializes the form correctly when token address parameter is valid', async () => {
    const mockSearchParams = new URLSearchParams({
      [QUERY_PARAM_TOKEN_ADDRESS]: primeAssets[1].vToken.address,
    });
    (useSearchParams as Vi.Mock).mockImplementation(() => [mockSearchParams, mockSetSearchParams]);

    const { getByTestId } = renderComponent(<PrimeCalculator />);

    await waitFor(() => getByTestId(TEST_IDS.tokenSelect));

    const tokenSelect = getByTestId(TEST_IDS.tokenSelect) as HTMLInputElement;

    // Check value of select
    await waitFor(() => expect(tokenSelect.value).toEqual(primeAssets[1].vToken.address));
  });

  it('updates the search params correctly when changing selected token', async () => {
    const { getByTestId } = renderComponent(<PrimeCalculator />);

    await waitFor(() => getByTestId(TEST_IDS.tokenSelect));

    const tokenSelect = getByTestId(TEST_IDS.tokenSelect) as HTMLInputElement;

    // Check value of select
    expect(tokenSelect.value).toEqual(primeAssets[0].vToken.address);

    // Change select value
    fireEvent.change(tokenSelect, {
      target: { value: primeAssets[1].vToken.address },
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      {
        tokenAddress: primeAssets[1].vToken.address,
      },
      {
        replace: true,
      },
    );
  });

  it('informs the user the minimum XVS that must be staked if they input a lower amount', async () => {
    const { getByTestId, getByText } = renderComponent(<PrimeCalculator />);

    const stakedAmountInput = await waitFor(
      () => getByTestId(TEST_IDS.stakedAmountTokens) as HTMLInputElement,
    );

    // Check input's value
    expect(stakedAmountInput.value).toEqual('');

    // Change input's value
    fireEvent.change(stakedAmountInput, {
      target: { value: '100' },
    });

    fireEvent.blur(stakedAmountInput);

    // Check message is shown
    await waitFor(() =>
      getByText('To be eligible for Prime rewards, at least 1000 XVS tokens must be staked.'),
    );
  });

  it('informs the user the minimum XVS that must be staked if they input a lower amount', async () => {
    const { getByTestId, getByText } = renderComponent(<PrimeCalculator />);

    const stakedAmountInput = await waitFor(
      () => getByTestId(TEST_IDS.stakedAmountTokens) as HTMLInputElement,
    );

    // Check input's value
    expect(stakedAmountInput.value).toEqual('');

    // Change input's value
    fireEvent.change(stakedAmountInput, {
      target: { value: '100' },
    });

    fireEvent.blur(stakedAmountInput);

    // Check message is shown
    await waitFor(() =>
      getByText('To be eligible for Prime rewards, at least 1000 XVS tokens must be staked.'),
    );
  });

  it('informs the user the maximum XVS that will be taken into account for their Prime rewards', async () => {
    const { getByTestId, getByText } = renderComponent(<PrimeCalculator />);

    const stakedAmountInput = await waitFor(
      () => getByTestId(TEST_IDS.stakedAmountTokens) as HTMLInputElement,
    );

    // Check input's value
    expect(stakedAmountInput.value).toEqual('');

    // Change input's value
    fireEvent.change(stakedAmountInput, {
      target: { value: '99999' },
    });

    fireEvent.blur(stakedAmountInput);

    // Check message is shown
    await waitFor(() => getByText(en.primeCalculator.stakedTokens.infos.label));
  });

  it('estimates Prime rewards based on the input of the user', async () => {
    const { getByTestId, getByText } = renderComponent(<PrimeCalculator />);

    const stakedAmountInput = await waitFor(
      () => getByTestId(TEST_IDS.stakedAmountTokens) as HTMLInputElement,
    );
    const suppliedAmountTokensInput = await waitFor(
      () => getByTestId(TEST_IDS.suppliedAmountTokens) as HTMLInputElement,
    );
    const borrowedAmountTokensInput = await waitFor(
      () => getByTestId(TEST_IDS.borrowedAmountTokens) as HTMLInputElement,
    );

    // Check input's value
    expect(stakedAmountInput.value).toEqual('');

    // Change input's value
    fireEvent.change(stakedAmountInput, {
      target: { value: '1000' },
    });
    fireEvent.change(suppliedAmountTokensInput, {
      target: { value: '3000' },
    });
    fireEvent.change(borrowedAmountTokensInput, {
      target: { value: '2000' },
    });

    // Check if estimated values are rendered

    // Total daily rewards distributed
    await waitFor(() => getByText('5.00K USDC'));
    // User daily rewards
    await waitFor(() => getByText('125.00 USDC'));
    // From supplied tokens
    await waitFor(() => getByText('100.00 USDC'));
    // From borrowed tokens
    await waitFor(() => getByText('25.00 USDC'));
  });
});
