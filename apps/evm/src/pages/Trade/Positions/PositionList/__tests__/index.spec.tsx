import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { t } from 'libs/translations';
import { store } from 'pages/Trade/ClosePositionModal/store';
import { useTokenPair } from 'pages/Trade/useTokenPair';
import { useSearchParams } from 'react-router';
import { renderComponent } from 'testUtils/render';
import type { Token, TradePosition } from 'types';
import type { Mock } from 'vitest';

import { tradePositions } from '__mocks__/models/trade';
import { PositionList } from '..';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../../../constants';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as object;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('pages/Trade/useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const selectedPosition = tradePositions[0];
const alternativePosition = tradePositions[2];
const mockSetSearchParams = vi.fn();

const getPositionLabel = (position: TradePosition) =>
  `${position.longAsset.vToken.underlyingToken.symbol}/${position.shortAsset.vToken.underlyingToken.symbol}`;

const getTableBody = () => {
  const tbody = document.querySelector('tbody');

  if (!tbody) {
    throw new Error('Expected table body to be rendered');
  }

  return tbody;
};

const getRowByPositionLabel = (position: TradePosition) => {
  const rowLabel = within(getTableBody()).getByText(getPositionLabel(position));
  const row = rowLabel.closest('tr');

  if (!row) {
    throw new Error(`Expected row for ${getPositionLabel(position)} to be rendered`);
  }

  return row;
};

const setSearchParamsState = ({
  searchParams = new URLSearchParams(),
}: {
  searchParams?: URLSearchParams;
} = {}) => {
  mockSetSearchParams.mockReset();
  (useSearchParams as Mock).mockImplementation(() => [searchParams, mockSetSearchParams]);
};

const setComponentState = ({
  longToken = selectedPosition.longAsset.vToken.underlyingToken,
  shortToken = selectedPosition.shortAsset.vToken.underlyingToken,
  searchParams = new URLSearchParams({
    foo: 'bar',
    [LONG_TOKEN_ADDRESS_PARAM_KEY]: longToken.address,
    [SHORT_TOKEN_ADDRESS_PARAM_KEY]: shortToken.address,
  }),
}: {
  longToken?: Token;
  shortToken?: Token;
  searchParams?: URLSearchParams;
} = {}) => {
  setSearchParamsState({ searchParams });

  (useTokenPair as Mock).mockImplementation(() => ({
    longToken,
    shortToken,
  }));

  (useIsFeatureEnabled as Mock).mockReturnValue(false);

  store.setState({
    isModalShown: false,
  });
};

const renderPositionList = (positions: TradePosition[] = [selectedPosition, alternativePosition]) =>
  renderComponent(<PositionList positions={positions} />);

const expectUpdatedSearchParams = async ({
  longTokenAddress,
  shortTokenAddress,
  initialSearchParams = new URLSearchParams({
    foo: 'bar',
    [LONG_TOKEN_ADDRESS_PARAM_KEY]: selectedPosition.longAsset.vToken.underlyingToken.address,
    [SHORT_TOKEN_ADDRESS_PARAM_KEY]: selectedPosition.shortAsset.vToken.underlyingToken.address,
  }),
}: {
  longTokenAddress: string;
  shortTokenAddress: string;
  initialSearchParams?: URLSearchParams;
}) => {
  await waitFor(() => expect(mockSetSearchParams).toHaveBeenCalledTimes(1));

  const [updater] = mockSetSearchParams.mock.calls[0];

  expect(updater(initialSearchParams)).toEqual({
    foo: 'bar',
    [LONG_TOKEN_ADDRESS_PARAM_KEY]: longTokenAddress,
    [SHORT_TOKEN_ADDRESS_PARAM_KEY]: shortTokenAddress,
  });
};

describe('PositionList', () => {
  beforeEach(() => {
    setComponentState();
  });

  it('renders the provided positions', () => {
    const { container } = renderPositionList();

    expect(container.textContent).toMatchSnapshot();
  });

  it('updates search params when clicking a row for another token pair', async () => {
    renderPositionList();

    fireEvent.click(getRowByPositionLabel(alternativePosition));

    await expectUpdatedSearchParams({
      longTokenAddress: alternativePosition.longAsset.vToken.underlyingToken.address,
      shortTokenAddress: alternativePosition.shortAsset.vToken.underlyingToken.address,
    });
  });

  it('toggles the selected row accordion when clicking the arrow button', async () => {
    const collateralLabel = t('trade.positions.status.collateralColumn.label');

    renderPositionList();

    expect(screen.queryByText(collateralLabel)).not.toBeInTheDocument();

    const accordionToggleButton = within(getRowByPositionLabel(selectedPosition))
      .getAllByRole('button')
      .find(button => !button.textContent?.trim())!;

    fireEvent.click(accordionToggleButton);

    await waitFor(() => expect(screen.queryAllByText(collateralLabel).length).toBeGreaterThan(0));
    expect(mockSetSearchParams).not.toHaveBeenCalled();

    fireEvent.click(accordionToggleButton);

    await waitFor(() => expect(screen.queryByText(collateralLabel)).not.toBeInTheDocument());
  });

  it('opens the close position modal without toggling the accordion when clicking the close button', async () => {
    const closeButtonLabel = t('trade.positions.closeButtonLabel');
    const collateralLabel = t('trade.positions.status.collateralColumn.label');

    renderPositionList();

    fireEvent.click(
      within(getRowByPositionLabel(selectedPosition)).getByRole('button', {
        name: closeButtonLabel,
      }),
    );

    await expectUpdatedSearchParams({
      longTokenAddress: selectedPosition.longAsset.vToken.underlyingToken.address,
      shortTokenAddress: selectedPosition.shortAsset.vToken.underlyingToken.address,
    });

    await waitFor(() => expect(store.getState().isModalShown).toBe(true));
    expect(screen.queryByText(collateralLabel)).not.toBeInTheDocument();
  });
});
