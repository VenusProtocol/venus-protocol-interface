import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { exactInSwapQuote as fakeSwapQuote } from '__mocks__/models/swap';
import { usdc, xvs } from '__mocks__/models/tokens';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { en } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import type { Pool, SwapQuote } from 'types';
import type { FooterProps } from '..';
import { Footer } from '..';

vi.mock('libs/contracts');
vi.mock('libs/tokens');
vi.mock('libs/tokens/infos/pancakeSwapTokens');

vi.mock('containers/ConnectWallet', () => ({
  ConnectWallet: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const { accountAddress } = useAccountAddress();

    return (
      <div data-testid="connect-wallet" {...props}>
        {accountAddress ? children : <div data-testid="connect-wallet-cta" />}
      </div>
    );
  },
}));

vi.mock('containers/AccountData', () => ({
  AccountData: () => <div data-testid="account-data" />,
}));

const swapDetailsMock = vi.fn();

vi.mock('containers/SwapDetails', () => ({
  SwapDetails: (props: unknown) => {
    swapDetailsMock(props);

    return <div data-testid="swap-details" />;
  },
}));

const apyBreakdownMock = vi.fn();

vi.mock('../../ApyBreakdown', () => ({
  ApyBreakdown: (props: unknown) => {
    apyBreakdownMock(props);

    return <div data-testid="apy-breakdown" />;
  },
}));

const submitButtonMock = vi.fn();

vi.mock('../SubmitButton', () => ({
  SubmitButton: (props: unknown) => {
    submitButtonMock(props);

    return <div data-testid="submit-button" />;
  },
}));

const baseProps: FooterProps = {
  analyticVariant: 'variant',
  balanceMutations: [
    {
      type: 'asset',
      action: 'supply',
      vTokenAddress: poolData[0].assets[0].vToken.address,
      amountTokens: new BigNumber(100),
    },
    {
      type: 'asset',
      action: 'borrow',
      vTokenAddress: poolData[0].assets[0].vToken.address,
      amountTokens: new BigNumber(10),
    },
  ],
  pool: poolData[0],
  submitButtonLabel: 'Submit',
  isFormValid: true,
};

describe('Footer', () => {
  const mockUseAccountAddress = useAccountAddress as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccountAddress.mockReturnValue({ accountAddress: undefined });
  });

  it('renders APY breakdown summary when user is not connected', () => {
    renderComponent(<Footer {...baseProps} />);

    expect(apyBreakdownMock).toHaveBeenCalledTimes(1);
  });

  it('renders swap details', () => {
    renderComponent(
      <Footer
        {...baseProps}
        swapFromToken={xvs}
        swapToToken={usdc}
        swapQuote={fakeSwapQuote}
        simulatedPool={baseProps.pool}
      />,
      { accountAddress: fakeAccountAddress },
    );

    expect((swapDetailsMock as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "fromToken": {
            "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-xvs-asset",
            "symbol": "XVS",
          },
          "priceImpactPercentage": 0.1,
          "toToken": {
            "address": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-usdc-asset",
            "symbol": "USDC",
          },
        },
      ]
    `);
  });

  it('marks transaction as risky when and prompts user to acknowledge the risks involved when simulated health factor drops below threshold', async () => {
    const fakeSimulatedPool: Pool = {
      ...baseProps.pool,
      userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.1,
    };

    const mockSetAcknowledgeRisk = vi.fn();

    const { getByText, getByRole } = renderComponent(
      <Footer
        {...baseProps}
        swapFromToken={xvs}
        swapToToken={usdc}
        swapQuote={fakeSwapQuote}
        simulatedPool={fakeSimulatedPool}
        isUserAcknowledgingRisk={false}
        setAcknowledgeRisk={mockSetAcknowledgeRisk}
      />,
      { accountAddress: fakeAccountAddress },
    );

    // Check warning is displayed
    expect(getByText(en.operationForm.acknowledgements.riskyOperation.tooltip));

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() => expect(mockSetAcknowledgeRisk).toHaveBeenCalledTimes(1));
    expect(mockSetAcknowledgeRisk).toHaveBeenCalledWith(true);
  });

  it('prompts user to acknowledge a high price impact', async () => {
    const customFakeSwapQuote: SwapQuote = {
      ...fakeSwapQuote,
      priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    const mockSetAcknowledgeHighPriceImpact = vi.fn();

    const { getByText, getByRole } = renderComponent(
      <Footer
        {...baseProps}
        swapFromToken={xvs}
        swapToToken={usdc}
        swapQuote={customFakeSwapQuote}
        isUserAcknowledgingHighPriceImpact={false}
        setAcknowledgeHighPriceImpact={mockSetAcknowledgeHighPriceImpact}
      />,
      { accountAddress: fakeAccountAddress },
    );

    // Check warning is displayed
    expect(
      getByText(
        en.operationForm.acknowledgements.highPriceImpact.tooltip.replace(
          '{{priceImpactPercentage}}',
          `${HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE}`,
        ),
      ),
    );

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() => expect(mockSetAcknowledgeHighPriceImpact).toHaveBeenCalledTimes(1));
    expect(mockSetAcknowledgeHighPriceImpact).toHaveBeenCalledWith(true);
  });

  it('does not render APY breakdown when showApyBreakdown is passed as false', () => {
    renderComponent(<Footer {...baseProps} showApyBreakdown={false} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(apyBreakdownMock).not.toHaveBeenCalled();
  });
});
