import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { tradePositions } from '__mocks__/models/trade';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenSelectButtonTestId } from 'components/SelectTokenTextField/testIdGetters';
import { en } from 'libs/translations';
import { calculateMaxBorrowShortTokens } from 'pages/Trade/OperationForm/calculateMaxBorrowShortTokens';
import { useGetTradeAssets } from 'pages/Trade/useGetTradeAssets';
import { useTokenPair } from 'pages/Trade/useTokenPair';
import { renderComponent } from 'testUtils/render';
import { formatTokensToReadableValue } from 'utilities';
import type { SelectDsaTokenTextFieldProps } from '..';
import { SelectDsaTokenTextField } from '..';

vi.mock('@radix-ui/react-slider', () => ({
  Root: ({
    value = [0],
    min = 0,
    max = 100,
    step = 1,
    disabled,
    onValueChange,
  }: {
    value?: number[];
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (value: number[]) => void;
  }) => (
    <input
      data-testid="slider"
      type="range"
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={value[0]}
      onChange={event => onValueChange?.([Number(event.currentTarget.value)])}
    />
  ),
  Track: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Range: () => <div />,
  Thumb: () => <div />,
}));

vi.mock('pages/Trade/useGetTradeAssets', () => ({
  useGetTradeAssets: vi.fn(),
}));

vi.mock('pages/Trade/useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

const basePosition = tradePositions[0];
const alternativePosition = tradePositions[1];
const selectTokenTextFieldTestId = 'select-dsa-token-text-field';
const baseDsaAssets = [poolData[0].assets[0], poolData[0].assets[1]];

const setComponentState = ({
  dsaAssets = baseDsaAssets,
  shortToken = basePosition.shortAsset.vToken.underlyingToken,
}: {
  dsaAssets?: typeof baseDsaAssets;
  shortToken?: typeof basePosition.shortAsset.vToken.underlyingToken;
} = {}) => {
  (useGetTradeAssets as Mock).mockImplementation(() => ({
    data: {
      dsaAssets,
      supplyAssets: [],
      borrowAssets: [],
    },
    isLoading: false,
  }));

  (useTokenPair as Mock).mockImplementation(() => ({
    shortToken,
  }));
};

interface RenderInput
  extends Partial<
    Omit<
      SelectDsaTokenTextFieldProps,
      'selectedToken' | 'leverageFactor' | 'onChangeSelectedToken' | 'onChangeLeverageFactor'
    >
  > {
  initialSelectedToken?: SelectDsaTokenTextFieldProps['selectedToken'];
  initialLeverageFactor?: number;
  onChangeSelectedToken?: SelectDsaTokenTextFieldProps['onChangeSelectedToken'];
  onChangeLeverageFactor?: SelectDsaTokenTextFieldProps['onChangeLeverageFactor'];
}

const SelectDsaTokenTextFieldHarness: React.FC<RenderInput> = ({
  initialSelectedToken = basePosition.dsaAsset.vToken.underlyingToken,
  initialLeverageFactor = basePosition.leverageFactor,
  onChangeSelectedToken = vi.fn(),
  onChangeLeverageFactor = vi.fn(),
  value = '',
  onChange = vi.fn(),
  hasError = false,
  tokenPriceCents = basePosition.dsaAsset.tokenPriceCents.toNumber(),
  maximumLeverageFactor = 4,
  proportionalCloseTolerancePercentage = 2,
  shortTokenPriceCents = basePosition.shortAsset.tokenPriceCents,
  shortTokenDecimals = basePosition.shortAsset.vToken.underlyingToken.decimals,
  longTokenPriceCents = basePosition.longAsset.tokenPriceCents,
  longTokenCollateralFactor = basePosition.longAsset.userCollateralFactor,
  dsaTokenCollateralFactor = basePosition.dsaAsset.userCollateralFactor,
  label = en.trade.operationForm.openForm.dsaFieldLabel,
  name = 'dsaAmountTokens',
  'data-testid': testId = selectTokenTextFieldTestId,
  ...otherProps
}) => {
  const [selectedToken, setSelectedToken] = useState(initialSelectedToken);
  const [leverageFactor, setLeverageFactor] = useState(initialLeverageFactor);

  return (
    <SelectDsaTokenTextField
      selectedToken={selectedToken}
      onChangeSelectedToken={newSelectedToken => {
        onChangeSelectedToken(newSelectedToken);
        setSelectedToken(newSelectedToken);
      }}
      leverageFactor={leverageFactor}
      onChangeLeverageFactor={newLeverageFactor => {
        onChangeLeverageFactor(newLeverageFactor);
        setLeverageFactor(newLeverageFactor);
      }}
      value={value}
      onChange={onChange}
      hasError={hasError}
      tokenPriceCents={tokenPriceCents}
      maximumLeverageFactor={maximumLeverageFactor}
      proportionalCloseTolerancePercentage={proportionalCloseTolerancePercentage}
      shortTokenPriceCents={shortTokenPriceCents}
      shortTokenDecimals={shortTokenDecimals}
      longTokenPriceCents={longTokenPriceCents}
      longTokenCollateralFactor={longTokenCollateralFactor}
      dsaTokenCollateralFactor={dsaTokenCollateralFactor}
      label={label}
      name={name}
      data-testid={testId}
      {...otherProps}
    />
  );
};

const renderSelectDsaTokenTextField = (input: RenderInput = {}) => {
  const onChangeSelectedToken = input.onChangeSelectedToken || vi.fn();
  const onChangeLeverageFactor = input.onChangeLeverageFactor || vi.fn();

  const {
    onChangeSelectedToken: _onChangeSelectedToken,
    onChangeLeverageFactor: _unused,
    ...props
  } = input;

  return {
    onChangeSelectedToken,
    onChangeLeverageFactor,
    ...renderComponent(
      <SelectDsaTokenTextFieldHarness
        onChangeSelectedToken={onChangeSelectedToken}
        onChangeLeverageFactor={onChangeLeverageFactor}
        {...props}
      />,
      {
        accountAddress: fakeAddress,
      },
    ),
  };
};

describe('SelectDsaTokenTextField', () => {
  beforeEach(() => {
    setComponentState();
  });

  it('renders the selected token and leverage factor button', () => {
    renderSelectDsaTokenTextField();

    expect(
      screen.getByTestId(getTokenSelectButtonTestId({ parentTestId: selectTokenTextFieldTestId })),
    ).toHaveTextContent(basePosition.dsaAsset.vToken.underlyingToken.symbol);
    expect(
      screen.getByRole('button', { name: `${basePosition.leverageFactor}x` }),
    ).toBeInTheDocument();
  });

  it('lets the user select another DSA token from the available DSA assets', async () => {
    const { container, onChangeSelectedToken } = renderSelectDsaTokenTextField();

    selectToken({
      token: alternativePosition.dsaAsset.vToken.underlyingToken,
      selectTokenTextFieldTestId,
      container,
    });

    await waitFor(() =>
      expect(onChangeSelectedToken).toHaveBeenCalledWith(
        alternativePosition.dsaAsset.vToken.underlyingToken,
      ),
    );

    expect(
      screen.getByTestId(getTokenSelectButtonTestId({ parentTestId: selectTokenTextFieldTestId })),
    ).toHaveTextContent(alternativePosition.dsaAsset.vToken.underlyingToken.symbol);
  });

  it('opens the real leverage factor modal with its controls and warning', async () => {
    renderSelectDsaTokenTextField();

    fireEvent.click(screen.getByRole('button', { name: `${basePosition.leverageFactor}x` }));

    await waitFor(() =>
      expect(
        screen.getByText(en.operationForm.leverageFactorModal.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    expect(screen.getByText(en.operationForm.leverageFactorModal.title)).toBeInTheDocument();
    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getByText(en.operationForm.leverageFactorModal.warning)).toBeInTheDocument();
  });

  it('shows the maximum position at current leverage when a DSA amount is provided', async () => {
    const dsaAmountTokens = new BigNumber('3');
    const maximumShortAmountTokens = calculateMaxBorrowShortTokens({
      dsaAmountTokens,
      dsaTokenPriceCents: basePosition.dsaAsset.tokenPriceCents.toNumber(),
      dsaTokenCollateralFactor: basePosition.dsaAsset.userCollateralFactor,
      longAmountTokens: new BigNumber(0),
      longTokenPriceCents: basePosition.longAsset.tokenPriceCents,
      longTokenCollateralFactor: basePosition.longAsset.userCollateralFactor,
      shortAmountTokens: new BigNumber(0),
      shortTokenPriceCents: basePosition.shortAsset.tokenPriceCents,
      leverageFactor: basePosition.leverageFactor,
      shortTokenDecimals: basePosition.shortAsset.vToken.underlyingToken.decimals,
      proportionalCloseTolerancePercentage: 2,
    });
    const readableMaximumShortAmount = formatTokensToReadableValue({
      value: maximumShortAmountTokens,
      token: basePosition.shortAsset.vToken.underlyingToken,
    });

    renderSelectDsaTokenTextField({
      value: dsaAmountTokens.toFixed(),
    });

    fireEvent.click(screen.getByRole('button', { name: `${basePosition.leverageFactor}x` }));

    await waitFor(() =>
      expect(
        screen.getByText(`Maximum position at current leverage: ${readableMaximumShortAmount}`),
      ).toBeInTheDocument(),
    );
  });

  it('does not show the maximum position text when there is no DSA amount', async () => {
    renderSelectDsaTokenTextField({
      value: '',
    });

    fireEvent.click(screen.getByRole('button', { name: `${basePosition.leverageFactor}x` }));

    await waitFor(() =>
      expect(
        screen.getByText(en.operationForm.leverageFactorModal.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    expect(screen.queryByText(/Maximum position at current leverage:/)).not.toBeInTheDocument();
  });

  it('updates leverage factor through the modal and closes it on confirm', async () => {
    const { onChangeLeverageFactor } = renderSelectDsaTokenTextField();

    fireEvent.click(screen.getByRole('button', { name: `${basePosition.leverageFactor}x` }));

    await waitFor(() => expect(screen.getByTestId('slider')).toBeInTheDocument());

    fireEvent.change(screen.getByTestId('slider'), {
      target: { value: '2.5' },
    });

    const confirmButton = screen.getByRole('button', {
      name: en.operationForm.leverageFactorModal.submitButtonLabel,
    });
    const form = confirmButton.closest('form');

    if (!form) {
      throw new Error('Expected leverage factor modal form to be rendered');
    }

    fireEvent.submit(form);

    await waitFor(() => expect(onChangeLeverageFactor).toHaveBeenCalledWith(2.5));

    await waitFor(() =>
      expect(
        screen.queryByText(en.operationForm.leverageFactorModal.submitButtonLabel),
      ).not.toBeInTheDocument(),
    );

    expect(screen.getByRole('button', { name: '2.5x' })).toBeInTheDocument();
  });
});
