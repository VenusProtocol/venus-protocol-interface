import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { vhXvs } from '__mocks__/models/vhTokens';
import { useGetPool } from 'clients/api';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';

import { Form, type FormProps, type FormValues } from '..';

const submitButtonLabel = 'Supply';

const baseProps: Omit<FormProps, 'formValues' | 'setFormValues'> = {
  vhToken: vhXvs,
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

const FormHarness: React.FC<RenderFormInput> = ({ initialFormValues, ...props }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    acknowledgeRisk: false,
    ...initialFormValues,
  });

  return (
    <Form
      {...baseProps}
      {...props}
      vhToken={vhXvs}
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
  const mockUseSimulateBalanceMutations = useSimulateBalanceMutations as Mock;

  beforeEach(() => {
    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
    }));

    mockUseSimulateBalanceMutations.mockImplementation(
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
});
