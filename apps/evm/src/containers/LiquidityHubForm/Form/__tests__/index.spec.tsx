import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import { en } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import type { AssetBalanceMutation, LiquidityHubBalanceMutation, Pool } from 'types';

import { Form, type FormProps, type FormValues } from '..';

const submitButtonLabel = 'Supply';

const liquidityHub = liquidityHubs[0];

const baseProps: Omit<FormProps, 'formValues' | 'setFormValues'> = {
  liquidityHub,
  onSubmit: vi.fn().mockResolvedValue(undefined),
  balanceMutations: [],
  isSubmitting: false,
  submitButtonLabel,
  limitTokens: new BigNumber(10),
  availableBalance: <div>Available balance</div>,
};

interface RenderFormInput
  extends Partial<Omit<FormProps, 'formValues' | 'setFormValues' | 'vhToken'>> {
  accountAddress?: string;
  initialFormValues?: Partial<FormValues>;
}

const FormHarness: React.FC<RenderFormInput> = ({
  initialFormValues,
  liquidityHub: selectedLiquidityHub = liquidityHub,
  ...props
}) => {
  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    acknowledgeRisk: false,
    ...initialFormValues,
  });

  return (
    <Form
      {...baseProps}
      {...props}
      liquidityHub={selectedLiquidityHub}
      formValues={formValues}
      setFormValues={setFormValues}
    />
  );
};

const renderForm = (input: RenderFormInput = {}) => {
  const hasExplicitAccountAddress = Object.prototype.hasOwnProperty.call(input, 'accountAddress');
  const accountAddress = hasExplicitAccountAddress ? input.accountAddress : fakeAccountAddress;
  const { accountAddress: _accountAddress, ...props } = input;

  return renderComponent(<FormHarness {...props} />, {
    accountAddress,
  });
};

const getAmountInput = () => {
  const input = document.querySelector('input[name="amountTokens"]') as HTMLInputElement | null;

  if (!input) {
    throw new Error('Expected amount input to be rendered');
  }

  return input;
};

describe('LiquidityHubForm Form', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseSimulatePoolMutations = useSimulatePoolMutations as Mock;
  const mockUseAccountAddress = useAccountAddress as Mock;

  beforeEach(() => {
    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
    }));

    mockUseSimulatePoolMutations.mockImplementation(
      ({ pool }: { pool?: Pool; balanceMutations: FormProps['balanceMutations'] }) => ({
        data: {
          pool,
        },
      }),
    );
  });

  it('updates the token amount and prefers the safe max value when clicking the max button', async () => {
    renderForm({
      limitTokens: new BigNumber(10),
      safeLimitTokens: new BigNumber('8.765'),
      rightMaxButtonLabel: en.liquidityHubForm.rightSafeMaxButtonLabel,
    });

    const input = getAmountInput();

    fireEvent.change(input, {
      target: {
        value: '3.5',
      },
    });

    await waitFor(() => expect(input.value).toBe('3.5'));

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.rightSafeMaxButtonLabel,
      }),
    );

    await waitFor(() => expect(input.value).toBe('8.765'));
  });

  it('submits the current values, resets the form, and calls onSubmitSuccess', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onSubmitSuccess = vi.fn();

    renderForm({
      onSubmit,
      onSubmitSuccess,
    });

    const input = getAmountInput();

    fireEvent.change(input, {
      target: {
        value: '7',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: submitButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        amountTokens: '7',
        acknowledgeRisk: false,
      }),
    );
    await waitFor(() => expect(input.value).toBe(''));
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
  });

  it('displays a validation error returned from Liquidity Hub balance mutation validation', async () => {
    const liquidityHubAtSupplyCap = {
      ...liquidityHub,
      supplyBalanceTokens: new BigNumber(10),
      supplyCapTokens: new BigNumber(10),
    };
    const balanceMutation: LiquidityHubBalanceMutation = {
      type: 'liquidityHub',
      action: 'supply',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: new BigNumber(1),
    };

    renderForm({
      liquidityHub: liquidityHubAtSupplyCap,
      balanceMutations: [balanceMutation],
      initialFormValues: {
        amountTokens: '1',
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          en.liquidityHubForm.error.supplyCapReached.replace('{{supplyCap}}', '10 XVS'),
        ),
      ).toBeInTheDocument(),
    );
  });

  it('prioritizes a custom validation error over common validation errors', async () => {
    const customValidationErrorMessage = 'Amount exceeds wallet balance';
    const validateForm = vi.fn<NonNullable<FormProps['validateForm']>>(() => ({
      code: 'HIGHER_THAN_WALLET_BALANCE',
      message: customValidationErrorMessage,
    }));

    renderForm({
      validateForm,
      limitTokens: new BigNumber(1),
      initialFormValues: {
        amountTokens: '2',
      },
    });

    await waitFor(() => expect(screen.getByText(customValidationErrorMessage)).toBeInTheDocument());
    expect(validateForm).toHaveBeenCalledWith({
      formValues: {
        amountTokens: '2',
        acknowledgeRisk: false,
      },
    });
    expect(
      screen.queryByText(en.liquidityHubForm.error.higherThanAvailableAmount),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: submitButtonLabel })).toBeDisabled();
  });

  it('renders the simulated Liquidity Hub balance and daily earnings', () => {
    const balanceMutation: LiquidityHubBalanceMutation = {
      type: 'liquidityHub',
      action: 'supply',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: new BigNumber(10),
      description: en.liquidityHubForm.balanceUpdates.liquidityHub,
    };

    renderForm({
      balanceMutations: [balanceMutation],
      initialFormValues: {
        amountTokens: '10',
      },
    });

    const balanceUpdate = screen
      .getByText(en.liquidityHubForm.balanceUpdates.liquidityHub)
      .closest('.flex.w-full');
    const dailyEarningsUpdate = screen
      .getByText(en.accountLiquidityHubDailyEarnings.label)
      .closest('.flex.w-full');

    expect(balanceUpdate).not.toBeNull();
    expect(balanceUpdate).toHaveTextContent('42');
    expect(balanceUpdate).toHaveTextContent('52');
    expect(dailyEarningsUpdate).not.toBeNull();
    expect(dailyEarningsUpdate).toHaveTextContent('$0.45');
    expect(dailyEarningsUpdate).toHaveTextContent('$0.46');
  });

  it('renders the simulated core pool health for asset balance mutations', () => {
    const simulatedPool: Pool = {
      ...poolData[0],
      userHealthFactor: 10,
    };
    const balanceMutation: AssetBalanceMutation = {
      type: 'asset',
      action: 'withdraw',
      vTokenAddress: poolData[0].assets[0].vToken.address,
      amountTokens: new BigNumber(1),
    };

    mockUseSimulatePoolMutations.mockReturnValue({
      data: {
        pool: simulatedPool,
      },
      isLoading: false,
    });

    renderForm({
      balanceMutations: [balanceMutation],
      initialFormValues: {
        amountTokens: '1',
      },
    });

    const healthFactorUpdate = screen
      .getByText(en.accountHealth.healthFactor.label)
      .closest('.flex.w-full');

    expect(healthFactorUpdate).not.toBeNull();
    expect(healthFactorUpdate).toHaveTextContent('15.62');
    expect(healthFactorUpdate).toHaveTextContent('10');
  });

  it('disables submission while simulating core pool balance mutations', () => {
    mockUseSimulatePoolMutations.mockReturnValue({
      data: {
        pool: poolData[0],
      },
      isLoading: true,
    });

    renderForm({
      initialFormValues: {
        amountTokens: '1',
      },
    });

    expect(screen.getByAltText('Spinner').closest('button')).toBeDisabled();
  });

  it('hides connected-only amount controls while disconnected', () => {
    mockUseAccountAddress.mockImplementation(() => ({
      accountAddress: undefined,
    }));

    renderForm({
      accountAddress: undefined,
    });

    expect(document.querySelector('input[name="amountTokens"]')).not.toBeInTheDocument();
    expect(screen.queryByText('Available balance')).not.toBeInTheDocument();
    expect(screen.getByText(en.liquidityHubForm.supplyApy)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: en.connectWallet.connectButton }),
    ).toBeInTheDocument();
  });

  it('only enables the core pool query when a balance mutation affects an asset', () => {
    const liquidityHubMutation: LiquidityHubBalanceMutation = {
      type: 'liquidityHub',
      action: 'supply',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: new BigNumber(1),
    };

    renderForm({
      balanceMutations: [liquidityHubMutation],
    });

    expect(mockUseGetPool).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        enabled: false,
      }),
    );

    mockUseGetPool.mockClear();

    const assetMutation: AssetBalanceMutation = {
      type: 'asset',
      action: 'withdraw',
      vTokenAddress: poolData[0].assets[0].vToken.address,
      amountTokens: new BigNumber(1),
    };

    renderForm({
      balanceMutations: [assetMutation],
    });

    expect(mockUseGetPool).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        enabled: true,
      }),
    );
  });

  it('falls back to common validation when the amount is higher than the available amount', async () => {
    renderForm({
      limitTokens: new BigNumber(1),
      initialFormValues: {
        amountTokens: '2',
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(en.liquidityHubForm.error.higherThanAvailableAmount),
      ).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: submitButtonLabel })).toBeDisabled();
  });
});
