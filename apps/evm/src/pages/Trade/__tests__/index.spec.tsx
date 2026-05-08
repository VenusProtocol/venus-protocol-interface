import { screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import type { Token } from 'types';
import Trade from '..';
import { store } from '../Banner/store';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../constants';
import { useGetLiveKLineCandles } from '../useGetLiveKLineCandles';
import { useGetTradeAssets } from '../useGetTradeAssets';
import { useTokenPair } from '../useTokenPair';

vi.mock('components', () => ({
  Card: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  KLineChart: ({ title }: { title: string }) => <div data-testid="k-line-chart">{title}</div>,
  Page: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Spinner: () => <div data-testid="spinner" />,
}));

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as object;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('../useGetTradeAssets', () => ({
  useGetTradeAssets: vi.fn(),
}));

vi.mock('../useGetLiveKLineCandles', () => ({
  useGetLiveKLineCandles: vi.fn(),
}));

vi.mock('../useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

vi.mock('../Banner/store', () => ({
  store: {
    use: {
      doNotShowBanner: vi.fn(),
    },
  },
}));

vi.mock('../Banner', () => ({
  Banner: () => <div data-testid="banner" />,
}));

vi.mock('../PairInfo', () => ({
  PairInfo: () => <div data-testid="pair-info" />,
}));

vi.mock('../OperationForm', () => ({
  OperationForm: () => <div data-testid="operation-form" />,
}));

vi.mock('../Positions', () => ({
  Positions: () => <div data-testid="positions" />,
}));

vi.mock('../ClosePositionModal', () => ({
  ClosePositionModal: () => <div data-testid="close-position-modal" />,
}));

const longAsset = poolData[0].assets[2];
const shortAsset = poolData[0].assets[3];
const otherAsset = poolData[0].assets[1];

const defaultLongToken = longAsset.vToken.underlyingToken;
const defaultShortToken = shortAsset.vToken.underlyingToken;

const mockSetSearchParams = vi.fn();

const setSearchParamsState = ({
  searchParams = new URLSearchParams(),
}: {
  searchParams?: URLSearchParams;
} = {}) => {
  mockSetSearchParams.mockReset();
  (useSearchParams as Mock).mockImplementation(() => [searchParams, mockSetSearchParams]);
};

const setPageState = (
  {
    searchParams,
    longToken = defaultLongToken,
    shortToken = defaultShortToken,
    defaultLong = defaultLongToken,
    defaultShort = defaultShortToken,
    isLoading = false,
    doNotShowBanner = false,
  } = {} as {
    searchParams?: URLSearchParams;
    longToken?: Token;
    shortToken?: Token;
    defaultLong?: Token;
    defaultShort?: Token;
    isLoading?: boolean;
    doNotShowBanner?: boolean;
  },
) => {
  setSearchParamsState({ searchParams });

  (useGetTradeAssets as Mock).mockImplementation(() => ({
    data: {
      borrowAssets: poolData[0].assets,
      supplyAssets: poolData[0].assets,
    },
    isLoading,
  }));

  (useTokenPair as Mock).mockImplementation(() => ({
    shortToken,
    longToken,
    defaultLongToken: defaultLong,
    defaultShortToken: defaultShort,
  }));

  (useGetLiveKLineCandles as Mock).mockReturnValue({
    candles: [],
    liveCandle: undefined,
  });

  (store.use.doNotShowBanner as Mock).mockReturnValue(doNotShowBanner);
};

const expectSearchParamsToResetToDefaults = async () => {
  await waitFor(() => expect(mockSetSearchParams).toHaveBeenCalledTimes(1));

  const [updater, options] = mockSetSearchParams.mock.calls[0];

  expect(options).toEqual({
    replace: true,
  });

  expect(
    updater(
      new URLSearchParams({
        foo: 'bar',
      }),
    ),
  ).toEqual({
    foo: 'bar',
    [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
    [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultLongToken.address,
  });
};

describe('pages/Trade', () => {
  beforeEach(() => {
    setPageState({
      searchParams: new URLSearchParams({
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultLongToken.address,
      }),
    });
  });

  it('renders spinner while loading assets', () => {
    setPageState({
      isLoading: true,
    });

    renderComponent(<Trade />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('pair-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('operation-form')).not.toBeInTheDocument();
  });

  it('initializes search params with default tokens when params are missing', async () => {
    setPageState({
      searchParams: new URLSearchParams(),
    });

    renderComponent(<Trade />);

    await expectSearchParamsToResetToDefaults();
  });

  it('repairs search params when long token address is invalid', async () => {
    setPageState({
      searchParams: new URLSearchParams({
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: fakeAddress,
      }),
    });

    renderComponent(<Trade />);

    await expectSearchParamsToResetToDefaults();
  });

  it('repairs search params when long and short token addresses are the same', async () => {
    setPageState({
      searchParams: new URLSearchParams({
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
      }),
      longToken: defaultShortToken,
    });

    renderComponent(<Trade />);

    await expectSearchParamsToResetToDefaults();
  });

  it('renders the loaded layout without rewriting valid search params', async () => {
    setPageState({
      searchParams: new URLSearchParams({
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: shortAsset.vToken.underlyingToken.address,
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: longAsset.vToken.underlyingToken.address,
      }),
      shortToken: shortAsset.vToken.underlyingToken,
      longToken: longAsset.vToken.underlyingToken,
    });

    renderComponent(<Trade />);

    await waitFor(() => expect(screen.getByTestId('pair-info')).toBeInTheDocument());

    expect(mockSetSearchParams).not.toHaveBeenCalled();
    expect(screen.getByTestId('operation-form')).toBeInTheDocument();
    expect(screen.getByTestId('close-position-modal')).toBeInTheDocument();
    expect(screen.getAllByTestId('positions')).toHaveLength(2);
  });

  it('renders banner when enabled', async () => {
    renderComponent(<Trade />);

    await waitFor(() => expect(screen.getByTestId('pair-info')).toBeInTheDocument());

    expect(screen.getAllByTestId('banner')).toHaveLength(2);
  });

  it('hides banner when disabled', async () => {
    setPageState({
      doNotShowBanner: true,
      searchParams: new URLSearchParams({
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: otherAsset.vToken.underlyingToken.address,
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: longAsset.vToken.underlyingToken.address,
      }),
      shortToken: otherAsset.vToken.underlyingToken,
      longToken: longAsset.vToken.underlyingToken,
    });

    renderComponent(<Trade />);

    await waitFor(() => expect(screen.getByTestId('pair-info')).toBeInTheDocument());

    expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
  });
});
