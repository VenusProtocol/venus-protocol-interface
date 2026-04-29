import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { tradePositions } from '__mocks__/models/trade';
import {
  useGetProportionalCloseTolerancePercentage,
  useGetSimulatedPool,
  useWithdrawTradePositionCollateral,
} from 'clients/api';
import { en } from 'libs/translations';
import { calculateUnusedCollateralCents } from 'pages/Trade/OperationForm/calculateUnusedCollateralCents';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { WithdrawForm } from '..';

const position = tradePositions[0];
const proportionalCloseTolerancePercentage = 2;

const mockUseGetProportionalCloseTolerancePercentage =
  useGetProportionalCloseTolerancePercentage as Mock;
const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
const mockUseWithdrawTradePositionCollateral = useWithdrawTradePositionCollateral as Mock;
const mockWithdrawTradePositionCollateral = vi.fn();

const getDsaAmountInput = (container: HTMLElement) =>
  container.querySelector('input[name="dsaAmountTokens"]') as HTMLInputElement;

describe('WithdrawForm', () => {
  const setReadyState = ({ simulatedPool = position.pool }: { simulatedPool?: Pool } = {}) => {
    mockUseGetProportionalCloseTolerancePercentage.mockImplementation(() => ({
      data: {
        proportionalCloseTolerancePercentage,
      },
    }));

    mockUseGetSimulatedPool.mockImplementation(({ pool }: { pool: Pool }) => ({
      data: {
        pool: simulatedPool || pool,
      },
      isLoading: false,
    }));

    mockUseWithdrawTradePositionCollateral.mockImplementation(() => ({
      mutateAsync: mockWithdrawTradePositionCollateral,
      isPending: false,
    }));
  };

  beforeEach(() => {
    setReadyState();
  });

  it('renders form when data is ready', async () => {
    const { container, getByText, getAllByText } = renderComponent(
      <WithdrawForm position={position} />,
      {
        accountAddress: position.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.trade.operationForm.withdrawDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    expect(getAllByText(en.trade.operationForm.openForm.dsaFieldLabel).length).toBeGreaterThan(0);

    expect(container.textContent).toMatchSnapshot();
  });

  it('requires wallet connection to interact with form fields', async () => {
    const { container, getByText } = renderComponent(<WithdrawForm position={position} />);

    await waitFor(() => expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument());

    expect(getDsaAmountInput(container)).toBeDisabled();
  });

  it('fills the input with the available withdrawable collateral when clicking the balance shortcut', async () => {
    const { container, getByText } = renderComponent(<WithdrawForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.trade.operationForm.withdrawDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const dsaAmountInput = getDsaAmountInput(container);
    const expectedLimitDsaTokens = calculateUnusedCollateralCents({
      dsaAmountTokens: position.dsaBalanceTokens,
      dsaTokenPriceCents: position.dsaAsset.tokenPriceCents,
      dsaTokenCollateralFactor: position.dsaAsset.userCollateralFactor,
      longAmountTokens: position.longBalanceTokens,
      longTokenPriceCents: position.longAsset.tokenPriceCents,
      longTokenCollateralFactor: position.longAsset.userCollateralFactor,
      shortAmountTokens: position.shortBalanceTokens,
      shortTokenPriceCents: position.shortAsset.tokenPriceCents,
      leverageFactor: position.leverageFactor,
      proportionalCloseTolerancePercentage,
    })
      .dividedBy(position.dsaAsset.tokenPriceCents)
      .dp(position.dsaAsset.vToken.underlyingToken.decimals);

    const readableLimit = formatTokensToReadableValue({
      value: expectedLimitDsaTokens,
      token: position.dsaAsset.vToken.underlyingToken,
    });

    fireEvent.click(getByText(readableLimit));

    await waitFor(() => expect(dsaAmountInput.value).toBe(expectedLimitDsaTokens.toFixed()));
  });

  it('displays the available withdrawable collateral limit with the DSA token', async () => {
    const { getByText } = renderComponent(<WithdrawForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.trade.operationForm.withdrawDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const expectedLimitDsaTokens = calculateUnusedCollateralCents({
      dsaAmountTokens: position.dsaBalanceTokens,
      dsaTokenPriceCents: position.dsaAsset.tokenPriceCents,
      dsaTokenCollateralFactor: position.dsaAsset.userCollateralFactor,
      longAmountTokens: position.longBalanceTokens,
      longTokenPriceCents: position.longAsset.tokenPriceCents,
      longTokenCollateralFactor: position.longAsset.userCollateralFactor,
      shortAmountTokens: position.shortBalanceTokens,
      shortTokenPriceCents: position.shortAsset.tokenPriceCents,
      leverageFactor: position.leverageFactor,
      proportionalCloseTolerancePercentage,
    })
      .dividedBy(position.dsaAsset.tokenPriceCents)
      .dp(position.dsaAsset.vToken.underlyingToken.decimals);

    const readableLimit = formatTokensToReadableValue({
      value: expectedLimitDsaTokens,
      token: position.dsaAsset.vToken.underlyingToken,
    });

    expect(getByText(readableLimit)).toBeInTheDocument();
  });

  it('submits withdraw request when form is valid', async () => {
    const expectedAmountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber('1'),
        token: position.dsaAsset.vToken.underlyingToken,
      }).toFixed(),
    );

    const { container, getByText } = renderComponent(<WithdrawForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.trade.operationForm.withdrawDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const dsaAmountInput = getDsaAmountInput(container);

    fireEvent.change(dsaAmountInput, {
      target: { value: '1' },
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockWithdrawTradePositionCollateral).toHaveBeenCalledTimes(1));

    expect(mockWithdrawTradePositionCollateral).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      amountMantissa: expectedAmountMantissa,
    });

    await waitFor(() => {
      expect(dsaAmountInput).toHaveValue(null);
    });
  });
});
