import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { exactInSwapQuote } from '__mocks__/models/swap';
import { tradePositions } from '__mocks__/models/trade';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import {
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatHealthFactorToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import type { FooterProps } from '..';
import { Footer } from '..';

const basePosition = tradePositions[0];
const baseProps: FooterProps = {
  position: basePosition,
  submitButtonLabel: 'Submit',
  isFormValid: true,
  balanceMutations: [],
  swapQuotes: [],
};

const liquidationPriceLabel = t('trade.operationForm.openForm.liquidationPrice');
const entryPriceLabel = t('trade.operationForm.openForm.entryPrice');
const pnlLabel = t('trade.operationForm.openForm.pnl');
const netApyLabel = t('trade.operationForm.openForm.netApy');
const borrowBalanceLabel = t('accountData.balanceUpdate.borrowBalance');
const healthFactorLabel = t('trade.positions.status.healthFactor.label');
const likelyToFailWarning = t('trade.operationForm.warning.txLikelyToFail');
const riskyOperationTooltip = t('operationForm.acknowledgements.riskyOperation.tooltip');

const likelyToFailSwapQuote = {
  ...exactInSwapQuote,
  fromToken: basePosition.shortAsset.vToken.underlyingToken,
  toToken: basePosition.longAsset.vToken.underlyingToken,
  fromTokenAmountSoldMantissa: BigInt(
    convertTokensToMantissa({
      value: new BigNumber('0.1'),
      token: basePosition.shortAsset.vToken.underlyingToken,
    }).toFixed(),
  ),
  expectedToTokenAmountReceivedMantissa: BigInt(
    convertTokensToMantissa({
      value: new BigNumber('0.1'),
      token: basePosition.longAsset.vToken.underlyingToken,
    }).toFixed(),
  ),
  minimumToTokenAmountReceivedMantissa: BigInt(
    convertTokensToMantissa({
      value: new BigNumber('0.1'),
      token: basePosition.longAsset.vToken.underlyingToken,
    }).toFixed(),
  ),
};

describe('Trade PositionForm Footer', () => {
  it('renders balance updates from the provided balance mutations', () => {
    const balanceMutations: FooterProps['balanceMutations'] = [
      {
        type: 'asset',
        action: 'borrow',
        amountTokens: new BigNumber(1),
        vTokenAddress: basePosition.shortAsset.vToken.address,
      },
    ];

    renderComponent(<Footer {...baseProps} balanceMutations={balanceMutations} />, {
      accountAddress: basePosition.positionAccountAddress,
    });

    const borrowBalanceRow = screen.getByText(borrowBalanceLabel).parentElement?.parentElement;

    expect(borrowBalanceRow?.textContent).toMatchInlineSnapshot(`"Borrow balance5051"`);
  });

  it('renders the likely-to-fail warning when a swap amount is below the threshold', () => {
    renderComponent(<Footer {...baseProps} swapQuotes={[likelyToFailSwapQuote]} />, {
      accountAddress: basePosition.positionAccountAddress,
    });

    expect(screen.getByText(likelyToFailWarning)).toBeInTheDocument();
  });

  it('renders the risky acknowledgement', async () => {
    const setAcknowledgeRisk = vi.fn();

    renderComponent(
      <Footer
        {...baseProps}
        balanceMutations={[
          {
            type: 'asset',
            action: 'borrow',
            amountTokens: new BigNumber(1),
            vTokenAddress: basePosition.shortAsset.vToken.address,
          },
        ]}
        simulatedPosition={{
          ...basePosition,
          pool: {
            ...basePosition.pool,
            userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.1,
          },
        }}
        isUserAcknowledgingRisk={false}
        setAcknowledgeRisk={setAcknowledgeRisk}
      />,
      {
        accountAddress: basePosition.positionAccountAddress,
      },
    );

    expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeInTheDocument();
    expect(screen.getByText(riskyOperationTooltip)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(setAcknowledgeRisk).toHaveBeenCalledWith(true));
  });

  it('renders liquidation price, entry price and net APY rows for open action', () => {
    const simulatedPosition = {
      ...basePosition,
      liquidationPriceTokens: new BigNumber('145.67'),
      entryPriceTokens: new BigNumber('1.23'),
      netApyPercentage: 4.56,
      pool: {
        ...basePosition.pool,
        userHealthFactor: 7.77,
      },
    };

    renderComponent(<Footer {...baseProps} action="open" simulatedPosition={simulatedPosition} />, {
      accountAddress: basePosition.positionAccountAddress,
    });

    expect(screen.getByText(healthFactorLabel)).toBeInTheDocument();
    expect(
      screen.getByText(
        formatHealthFactorToReadableValue({ value: simulatedPosition.pool.userHealthFactor || 0 }),
      ),
    ).toBeInTheDocument();

    const liquidationPriceRow =
      screen.getByText(liquidationPriceLabel).parentElement?.parentElement;
    const entryPriceRow = screen.getByText(entryPriceLabel).parentElement?.parentElement;
    const netApyRow = screen.getByText(netApyLabel).parentElement?.parentElement;

    expect(liquidationPriceRow?.textContent).toMatchInlineSnapshot(`"Liq. price145.67"`);
    expect(entryPriceRow?.textContent).toMatchInlineSnapshot(`"Entry price1.23"`);
    expect(netApyRow?.textContent).toMatchInlineSnapshot(`"Net APY4.56%"`);
  });

  it('renders original and updated values for increase action', () => {
    const simulatedPosition = {
      ...basePosition,
      liquidationPriceTokens: new BigNumber('145.67'),
      entryPriceTokens: new BigNumber('0.98'),
      netApyPercentage: 4.56,
    };

    renderComponent(
      <Footer {...baseProps} action="increase" simulatedPosition={simulatedPosition} />,
      {
        accountAddress: basePosition.positionAccountAddress,
      },
    );

    const liquidationPriceRow =
      screen.getByText(liquidationPriceLabel).parentElement?.parentElement;
    const entryPriceRow = screen.getByText(entryPriceLabel).parentElement?.parentElement;
    const netApyRow = screen.getByText(netApyLabel).parentElement?.parentElement;

    expect(liquidationPriceRow?.textContent).toMatchInlineSnapshot(`"Liq. priceN/A145.67"`);
    expect(entryPriceRow?.textContent).toMatchInlineSnapshot(`"Entry price0.50.98"`);
    expect(netApyRow?.textContent).toMatchInlineSnapshot(`"Net APY0.75%4.56%"`);
  });

  it('renders original and updated values for reduce action', () => {
    const simulatedPosition = {
      ...basePosition,
      liquidationPriceTokens: new BigNumber('145.67'),
      entryPriceTokens: new BigNumber('0.98'),
      netApyPercentage: 4.56,
    };

    renderComponent(
      <Footer {...baseProps} action="reduce" simulatedPosition={simulatedPosition} />,
      {
        accountAddress: basePosition.positionAccountAddress,
      },
    );

    const liquidationPriceRow =
      screen.getByText(liquidationPriceLabel).parentElement?.parentElement;
    const entryPriceRow = screen.getByText(entryPriceLabel).parentElement?.parentElement;
    const netApyRow = screen.getByText(netApyLabel).parentElement?.parentElement;

    expect(liquidationPriceRow?.textContent).toMatchInlineSnapshot(`"Liq. priceN/A145.67"`);
    expect(entryPriceRow?.textContent).toMatchInlineSnapshot(`"Entry price0.50.98"`);
    expect(netApyRow?.textContent).toMatchInlineSnapshot(`"Net APY0.75%4.56%"`);
  });

  it.each([
    {
      pnlDsaTokens: new BigNumber('2'),
      expectedClassName: 'text-green',
      expectedSign: '+',
    },
    {
      pnlDsaTokens: new BigNumber('-2'),
      expectedClassName: 'text-red',
      expectedSign: '-',
    },
  ])(
    'renders the PnL row when pnlDsaTokens is provided',
    ({ pnlDsaTokens, expectedClassName, expectedSign }) => {
      const readablePnl = formatTokensToReadableValue({
        value: pnlDsaTokens,
        token: basePosition.dsaAsset.vToken.underlyingToken,
      });
      const deltaAmountCents = pnlDsaTokens.multipliedBy(basePosition.dsaAsset.tokenPriceCents);
      const readablePnlDelta = `${expectedSign} ${formatCentsToReadableValue({
        value: deltaAmountCents.absoluteValue(),
      })}`;

      renderComponent(<Footer {...baseProps} pnlDsaTokens={pnlDsaTokens} />, {
        accountAddress: basePosition.positionAccountAddress,
      });

      expect(screen.getByText(pnlLabel)).toBeInTheDocument();
      expect(screen.getByText(readablePnl)).toHaveClass(expectedClassName);
      expect(screen.getByText(readablePnlDelta)).toBeInTheDocument();
    },
  );

  it('does not render position rows or account health for close action', () => {
    renderComponent(<Footer {...baseProps} action="close" />, {
      accountAddress: basePosition.positionAccountAddress,
    });

    expect(screen.queryByText(liquidationPriceLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(entryPriceLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(netApyLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(healthFactorLabel)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeInTheDocument();
  });

  it('falls back to the current position pool for account health when simulated position is missing', () => {
    renderComponent(<Footer {...baseProps} />, {
      accountAddress: basePosition.positionAccountAddress,
    });

    expect(screen.getByText(healthFactorLabel)).toBeInTheDocument();
    expect(
      screen.getByText(
        formatHealthFactorToReadableValue({ value: basePosition.pool.userHealthFactor || 0 }),
      ),
    ).toBeInTheDocument();
  });
});
