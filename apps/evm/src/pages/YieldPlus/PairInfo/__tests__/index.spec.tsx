import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { getTokenListItemTestId } from 'components/TokenListWrapper/testIdGetters';
import { t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Asset, Token } from 'types';
import { PairInfo } from '..';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../../constants';
import { useGetYieldPlusAssets } from '../../useGetYieldPlusAssets';
import { useTokenPair } from '../../useTokenPair';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as object;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('../../useGetYieldPlusAssets', () => ({
  useGetYieldPlusAssets: vi.fn(),
}));

vi.mock('../../useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

const longTokenSelectTestId = 'pair-info-long-token-select';
const shortTokenSelectTestId = 'pair-info-short-token-select';

const defaultLongAsset = poolData[0].assets[2];
const defaultShortAsset = poolData[0].assets[3];
const alternativeLongAsset = poolData[0].assets[1];
const alternativeShortAsset = poolData[0].assets[0];

const defaultLongToken = defaultLongAsset.vToken.underlyingToken;
const defaultShortToken = defaultShortAsset.vToken.underlyingToken;

const mockSetSearchParams = vi.fn();

const setSearchParamsState = ({
  searchParams = new URLSearchParams(),
}: {
  searchParams?: URLSearchParams;
} = {}) => {
  mockSetSearchParams.mockReset();
  (useSearchParams as Mock).mockImplementation(() => [searchParams, mockSetSearchParams]);
};

const setComponentState = ({
  longToken = defaultLongToken,
  shortToken = defaultShortToken,
  supplyAssets = poolData[0].assets,
  borrowAssets = poolData[0].assets,
  searchParams = new URLSearchParams({
    foo: 'bar',
    [LONG_TOKEN_ADDRESS_PARAM_KEY]: longToken.address,
    [SHORT_TOKEN_ADDRESS_PARAM_KEY]: shortToken.address,
  }),
}: {
  longToken?: Token;
  shortToken?: Token;
  supplyAssets?: Asset[];
  borrowAssets?: Asset[];
  searchParams?: URLSearchParams;
} = {}) => {
  setSearchParamsState({ searchParams });

  (useGetYieldPlusAssets as Mock).mockImplementation(() => ({
    data: {
      supplyAssets,
      borrowAssets,
      dsaAssets: [],
    },
    isLoading: false,
  }));

  (useTokenPair as Mock).mockImplementation(() => ({
    longToken,
    shortToken,
  }));
};

const renderPairInfo = (props?: React.ComponentProps<typeof PairInfo>) =>
  renderComponent(<PairInfo {...props} />);

const getTokenSelectButton = (type: 'long' | 'short') => {
  const label =
    type === 'long' ? t('yieldPlus.longTokenSelect.label') : t('yieldPlus.shortTokenSelect.label');

  const button = screen.getByText(label).closest('button');

  if (!button) {
    throw new Error(`Expected ${type} token select button to be rendered`);
  }

  return button;
};

const selectPairInfoToken = ({
  type,
  token,
}: {
  type: 'long' | 'short';
  token: Token;
}) => {
  const selectTestId = type === 'long' ? longTokenSelectTestId : shortTokenSelectTestId;

  fireEvent.click(getTokenSelectButton(type));
  fireEvent.click(
    screen.getByTestId(
      getTokenListItemTestId({
        parentTestId: selectTestId,
        tokenAddress: token.address,
      }),
    ),
  );
};

const expectUpdatedSearchParams = async (
  expectedSearchParams: Record<string, string>,
  initialSearchParams = new URLSearchParams({
    foo: 'bar',
    [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultLongToken.address,
    [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
  }),
) => {
  await waitFor(() => expect(mockSetSearchParams).toHaveBeenCalledTimes(1));

  const [updater] = mockSetSearchParams.mock.calls[0];

  expect(updater(initialSearchParams)).toEqual({
    foo: 'bar',
    ...expectedSearchParams,
  });
};

describe('PairInfo', () => {
  beforeEach(() => {
    setComponentState();
  });

  it('renders the selected pair details and market stats', () => {
    const { container } = renderPairInfo({
      changePercentage: 3.32,
    });

    expect(getTokenSelectButton('long')).toHaveTextContent(defaultLongToken.symbol);
    expect(getTokenSelectButton('short')).toHaveTextContent(defaultShortToken.symbol);
    expect(container.textContent).toMatchSnapshot();
  });

  it('updates search params when selecting another long token', async () => {
    renderPairInfo();

    selectPairInfoToken({
      type: 'long',
      token: alternativeLongAsset.vToken.underlyingToken,
    });

    await expectUpdatedSearchParams({
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: alternativeLongAsset.vToken.underlyingToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
    });
  });

  it('updates search params when selecting another short token', async () => {
    renderPairInfo();

    selectPairInfoToken({
      type: 'short',
      token: alternativeShortAsset.vToken.underlyingToken,
    });

    await expectUpdatedSearchParams({
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultLongToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: alternativeShortAsset.vToken.underlyingToken.address,
    });
  });

  it('swaps the short token search param when selecting the current short token as long token', async () => {
    renderPairInfo();

    selectPairInfoToken({
      type: 'long',
      token: defaultShortToken,
    });

    await expectUpdatedSearchParams({
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultLongToken.address,
    });
  });

  it('swaps the long token search param when selecting the current long token as short token', async () => {
    renderPairInfo();

    selectPairInfoToken({
      type: 'short',
      token: defaultLongToken,
    });

    await expectUpdatedSearchParams({
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: defaultShortToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: defaultLongToken.address,
    });
  });
});
