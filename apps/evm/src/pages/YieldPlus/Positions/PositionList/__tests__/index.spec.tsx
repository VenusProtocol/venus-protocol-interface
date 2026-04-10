import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { t } from 'libs/translations';
import { useTokenPair } from 'pages/YieldPlus/useTokenPair';
import { useSearchParams } from 'react-router';
import { renderComponent } from 'testUtils/render';
import type { Token, YieldPlusPosition } from 'types';
import type { Mock } from 'vitest';

import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { PositionList } from '..';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../../../constants';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as object;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('pages/YieldPlus/useTokenPair', () => ({
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

const selectedPosition = yieldPlusPositions[0];
const alternativePosition = yieldPlusPositions[2];
const mockSetSearchParams = vi.fn();

const getPositionLabel = (position: YieldPlusPosition) =>
  `${position.longAsset.vToken.underlyingToken.symbol}/${position.shortAsset.vToken.underlyingToken.symbol}`;

const getTableBody = () => {
  const tbody = document.querySelector('tbody');

  if (!tbody) {
    throw new Error('Expected table body to be rendered');
  }

  return tbody;
};

const getRowByPositionLabel = (position: YieldPlusPosition) => {
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
};

const renderPositionList = (
  positions: YieldPlusPosition[] = [selectedPosition, alternativePosition],
) => renderComponent(<PositionList positions={positions} />);

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
    const collateralLabel = t('yieldPlus.positions.status.collateralColumn.label');

    renderPositionList();

    expect(screen.queryByText(collateralLabel)).not.toBeInTheDocument();

    const accordionToggleButton = within(getRowByPositionLabel(selectedPosition))
      .getAllByRole('button')
      .find(button => !button.textContent?.trim());

    if (!accordionToggleButton) {
      throw new Error('Expected accordion toggle button to be rendered');
    }

    fireEvent.click(accordionToggleButton);

    await waitFor(() => expect(screen.queryAllByText(collateralLabel).length).toBeGreaterThan(0));
    expect(mockSetSearchParams).not.toHaveBeenCalled();

    fireEvent.click(accordionToggleButton);

    await waitFor(() => expect(screen.queryByText(collateralLabel)).not.toBeInTheDocument());
  });
});
