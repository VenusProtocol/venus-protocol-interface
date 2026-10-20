import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { usdc, xvs } from '__mocks__/models/tokens';
import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { useAuthModal, useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { TxFormSubmitButton, type TxFormSubmitButtonProps } from '..';

const swapDetailsMock = vi.fn();

const mockUseDelegateApproval = vi.fn();

vi.mock('hooks/useDelegateApproval', () => ({
  default: (input: unknown) => mockUseDelegateApproval(input),
}));

vi.mock('containers/SwapDetails', () => ({
  SwapDetails: (props: unknown) => {
    swapDetailsMock(props);

    return <div data-testid="swap-details" />;
  },
}));

const baseProps: TxFormSubmitButtonProps = {
  submitButtonLabel: 'Submit',
  isFormValid: true,
  balanceMutations: [],
};

const renderTxFormSubmitButton = (
  props: Partial<TxFormSubmitButtonProps> = {},
  options?: Parameters<typeof renderComponent>[1],
) =>
  renderComponent(<TxFormSubmitButton {...baseProps} {...props} />, {
    accountAddress: fakeAccountAddress,
    ...options,
  });

describe('TxFormSubmitButton', () => {
  beforeEach(() => {
    (useAuthModal as Mock).mockReturnValue({
      openAuthModal: vi.fn(),
    });
    (useSwitchChain as Mock).mockReturnValue({
      switchChain: vi.fn(),
    });
  });

  it('renders the real submit button and disables it when the form is invalid', () => {
    renderTxFormSubmitButton({
      isFormValid: false,
    });

    expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeDisabled();
  });

  it('renders the connect wallet button when the user is disconnected', () => {
    renderTxFormSubmitButton({}, { accountAddress: undefined });

    expect(screen.getByText(en.connectWallet.connectButton)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: baseProps.submitButtonLabel }),
    ).not.toBeInTheDocument();
  });

  it('renders the risky-operation acknowledgement and calls the callback when toggled', async () => {
    const setAcknowledgeRisk = vi.fn();
    const simulatedPool: Pool = {
      ...poolData[0],
      userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.1,
    };

    renderTxFormSubmitButton({
      balanceMutations: [
        {
          type: 'asset',
          action: 'borrow',
          vTokenAddress: poolData[0].assets[0].vToken.address,
          amountTokens: new BigNumber(1),
        },
      ],
      simulatedPool,
      isUserAcknowledgingRisk: false,
      setAcknowledgeRisk,
    });

    expect(screen.getByText(en.txFormSubmitButton.acknowledgements.riskyOperation.tooltip));

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(setAcknowledgeRisk).toHaveBeenCalledWith(true));
  });

  it('does not render the risky-operation acknowledgement for supply-only mutations', () => {
    const simulatedPool: Pool = {
      ...poolData[0],
      userHealthFactor:
        (HEALTH_FACTOR_MODERATE_THRESHOLD + HEALTH_FACTOR_LIQUIDATION_THRESHOLD) / 2,
    };

    renderTxFormSubmitButton({
      balanceMutations: [
        {
          type: 'asset',
          action: 'supply',
          vTokenAddress: poolData[0].assets[0].vToken.address,
          amountTokens: new BigNumber(1),
        },
      ],
      simulatedPool,
      isUserAcknowledgingRisk: false,
      setAcknowledgeRisk: vi.fn(),
    });

    expect(
      screen.queryByText(en.txFormSubmitButton.acknowledgements.riskyOperation.tooltip),
    ).not.toBeInTheDocument();
  });

  it('renders the high price impact acknowledgement and calls the callback when toggled', async () => {
    const setAcknowledgeHighPriceImpact = vi.fn();

    renderTxFormSubmitButton({
      swapPriceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
      isUserAcknowledgingHighPriceImpact: false,
      setAcknowledgeHighPriceImpact,
    });

    expect(
      screen.getByText(
        en.txFormSubmitButton.acknowledgements.highPriceImpact.tooltip.replace(
          '{{priceImpactPercentage}}',
          `${HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE}`,
        ),
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(setAcknowledgeHighPriceImpact).toHaveBeenCalledWith(true));
  });

  it('does not render the high price impact acknowledgement at the maximum threshold', () => {
    renderTxFormSubmitButton({
      swapPriceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
      isUserAcknowledgingHighPriceImpact: false,
      setAcknowledgeHighPriceImpact: vi.fn(),
    });

    expect(
      screen.queryByText(en.txFormSubmitButton.acknowledgements.highPriceImpact.label),
    ).not.toBeInTheDocument();
  });

  it('renders both acknowledgements when both risk conditions are met', () => {
    const simulatedPool: Pool = {
      ...poolData[0],
      userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.1,
    };

    renderTxFormSubmitButton({
      balanceMutations: [
        {
          type: 'asset',
          action: 'withdraw',
          vTokenAddress: poolData[0].assets[0].vToken.address,
          amountTokens: new BigNumber(1),
        },
      ],
      simulatedPool,
      isUserAcknowledgingRisk: false,
      setAcknowledgeRisk: vi.fn(),
      swapPriceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
      isUserAcknowledgingHighPriceImpact: false,
      setAcknowledgeHighPriceImpact: vi.fn(),
    });

    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('renders swap details when both swap tokens are provided', () => {
    renderTxFormSubmitButton({
      swapFromToken: xvs,
      swapToToken: usdc,
      swapPriceImpactPercentage: 0.1,
    });

    expect(screen.getByTestId('swap-details')).toBeInTheDocument();
    expect(swapDetailsMock).toHaveBeenCalledWith({
      fromToken: xvs,
      toToken: usdc,
      priceImpactPercentage: 0.1,
    });
  });

  it('does not render swap details when one swap token is missing', () => {
    renderTxFormSubmitButton({
      swapFromToken: xvs,
      swapPriceImpactPercentage: 0.1,
    });

    expect(screen.queryByTestId('swap-details')).not.toBeInTheDocument();
    expect(swapDetailsMock).not.toHaveBeenCalled();
  });

  describe('with several approvals', () => {
    const approvals: TxFormSubmitButtonProps['approval'] = [
      {
        type: 'token',
        token: xvs,
        spenderAddress: '0xfakeSpenderAddress',
      },
      {
        type: 'delegate',
        delegateeAddress: '0xfakeDelegateeAddress',
        poolComptrollerContractAddress: '0xfakeComptrollerAddress',
      },
    ];

    const mockApprovals = ({
      isTokenApproved,
      isDelegateApproved,
    }: { isTokenApproved: boolean; isDelegateApproved: boolean }) => {
      (useTokenApproval as Mock).mockReturnValue({
        isTokenApproved,
        isWalletSpendingLimitLoading: false,
        isApproveTokenLoading: false,
        approveToken: vi.fn(),
      });
      mockUseDelegateApproval.mockReturnValue({
        isDelegateApproved,
        isDelegateApprovedLoading: false,
        isUpdateDelegateStatusLoading: false,
        updatePoolDelegateStatus: vi.fn(),
      });
    };

    const tokenApprovalLabel = en.approveTokenSteps.approveTokenButton.text.replace(
      '{{tokenSymbol}}',
      xvs.symbol,
    );
    const delegateApprovalLabel = en.approveDelegateSteps.approveDelegateButton.text;

    it('asks for the approvals one after the other before enabling the submit button', () => {
      mockApprovals({ isTokenApproved: false, isDelegateApproved: false });

      const { rerender } = renderTxFormSubmitButton({ approval: approvals });

      expect(screen.getByRole('button', { name: tokenApprovalLabel })).toBeEnabled();
      expect(screen.queryByRole('button', { name: delegateApprovalLabel })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

      mockApprovals({ isTokenApproved: true, isDelegateApproved: false });
      rerender(<TxFormSubmitButton {...baseProps} approval={approvals} />);

      expect(screen.queryByRole('button', { name: tokenApprovalLabel })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: delegateApprovalLabel })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

      mockApprovals({ isTokenApproved: true, isDelegateApproved: true });
      rerender(<TxFormSubmitButton {...baseProps} approval={approvals} />);

      expect(screen.queryByRole('button', { name: delegateApprovalLabel })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });
  });
});
