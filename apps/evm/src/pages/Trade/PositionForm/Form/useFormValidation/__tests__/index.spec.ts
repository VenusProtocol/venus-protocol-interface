import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { tradePositions } from '__mocks__/models/trade';
import { useCommonValidation } from 'hooks/useCommonValidation';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { useFormValidation } from '..';
import type { FormError, FormValues, PositionFormAction } from '../../types';

vi.mock('hooks/useCommonValidation', () => ({
  useCommonValidation: vi.fn(),
}));

const basePosition = tradePositions[0];
const alternativePosition = tradePositions[1];
const baseFormValues: FormValues = {
  leverageFactor: basePosition.leverageFactor,
  dsaToken: basePosition.dsaAsset.vToken.underlyingToken,
  dsaAmountTokens: '1',
  shortAmountTokens: '0.5',
  longAmountTokens: '',
  acknowledgeRisk: false,
  acknowledgeHighPriceImpact: false,
};

const mockUseCommonValidation = useCommonValidation as Mock;
const mockUseGetContractAddress = useGetContractAddress as Mock;
const mockUseTokenApproval = useTokenApproval as Mock;
const mockUseAccountAddress = useAccountAddress as Mock;

const setHookState = ({
  accountAddress = fakeAddress,
  contractAddress = fakeAddress,
  isTokenApproved = true,
  walletSpendingLimitTokens = new BigNumber(10),
  commonFormError,
}: {
  accountAddress?: string;
  contractAddress?: string;
  isTokenApproved?: boolean;
  walletSpendingLimitTokens?: BigNumber;
  commonFormError?: FormError;
} = {}) => {
  mockUseAccountAddress.mockImplementation(() => ({
    accountAddress,
  }));

  mockUseGetContractAddress.mockImplementation(() => ({
    address: contractAddress,
  }));

  mockUseTokenApproval.mockImplementation(() => ({
    isTokenApproved,
    walletSpendingLimitTokens,
  }));

  mockUseCommonValidation.mockImplementation(() => commonFormError);
};

type UseFormValidationInput = Parameters<typeof useFormValidation>[0];

interface RenderInput extends Partial<Omit<UseFormValidationInput, 'formValues'>> {
  formValues?: Partial<FormValues>;
}

const renderUseFormValidation = (input: RenderInput = {}) => {
  const { formValues, ...otherInput } = input;

  const hookInput: UseFormValidationInput = {
    balanceMutations: [],
    position: basePosition,
    simulatedPosition: basePosition,
    formValues: {
      ...baseFormValues,
      ...formValues,
    },
    averageSwapPriceImpactPercentage: 0.1,
    swapQuoteError: undefined,
    action: 'open',
    ...otherInput,
  };

  return renderHook(() => useFormValidation(hookInput));
};

describe('useFormValidation', () => {
  beforeEach(() => {
    setHookState();
  });

  it('returns the common validation error before local validation errors', () => {
    const commonFormError: FormError = {
      code: 'NO_SWAP_QUOTE_FOUND',
      message: 'Common validation error',
    };

    setHookState({
      commonFormError,
    });

    const { result } = renderUseFormValidation({
      simulatedPosition: undefined,
      formValues: {
        dsaAmountTokens: '',
        shortAmountTokens: '',
      },
    });

    expect(result.current.isFormValid).toBe(false);
    expect(result.current.formError).toEqual(commonFormError);
  });

  it('passes the unified swapQuoteError message to common validation', () => {
    const swapQuoteError = new VError({
      type: 'swapQuote',
      code: 'noSwapQuoteFound',
    });

    renderUseFormValidation({
      swapQuoteError,
    });

    expect(mockUseCommonValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        swapQuoteErrorCode: 'noSwapQuoteFound',
      }),
    );
  });

  it.each<{
    action: PositionFormAction;
  }>([{ action: 'open' }, { action: 'supplyDsa' }, { action: 'withdrawDsa' }])(
    'returns EMPTY_DSA_TOKEN_AMOUNT when DSA amount is missing for $action',
    ({ action }) => {
      const { result } = renderUseFormValidation({
        action,
        formValues: {
          dsaAmountTokens: '',
        },
      });

      expect(result.current.isFormValid).toBe(false);
      expect(result.current.formError?.code).toBe('EMPTY_DSA_TOKEN_AMOUNT');
    },
  );

  it('returns EMPTY_DSA_TOKEN_AMOUNT when DSA amount is zero', () => {
    const { result } = renderUseFormValidation({
      formValues: {
        dsaAmountTokens: '0',
      },
    });

    expect(result.current.formError?.code).toBe('EMPTY_DSA_TOKEN_AMOUNT');
  });

  it('returns HIGHER_THAN_WALLET_BALANCE when DSA amount exceeds wallet balance', () => {
    const { result } = renderUseFormValidation({
      formValues: {
        dsaAmountTokens: basePosition.dsaAsset.userWalletBalanceTokens.plus(1).toFixed(),
      },
    });

    expect(result.current.formError?.code).toBe('HIGHER_THAN_WALLET_BALANCE');
  });

  it('returns HIGHER_THAN_WALLET_SPENDING_LIMIT when DSA amount exceeds spending limit', () => {
    setHookState({
      walletSpendingLimitTokens: new BigNumber('0.5'),
    });

    const { result } = renderUseFormValidation({
      formValues: {
        dsaAmountTokens: '1',
      },
    });

    expect(result.current.formError?.code).toBe('HIGHER_THAN_WALLET_SPENDING_LIMIT');
  });

  it('skips wallet spending limit validation when token is not approved', () => {
    setHookState({
      isTokenApproved: false,
      walletSpendingLimitTokens: new BigNumber('0.5'),
    });

    const { result } = renderUseFormValidation({
      formValues: {
        dsaAmountTokens: '1',
      },
    });

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.formError).toBeUndefined();
  });

  it.each<{
    action: PositionFormAction;
  }>([{ action: 'open' }, { action: 'increase' }, { action: 'reduce' }])(
    'returns EMPTY_SHORT_TOKEN_AMOUNT when short amount is missing for $action',
    ({ action }) => {
      const { result } = renderUseFormValidation({
        action,
        formValues: {
          shortAmountTokens: '',
        },
      });

      expect(result.current.isFormValid).toBe(false);
      expect(result.current.formError?.code).toBe('EMPTY_SHORT_TOKEN_AMOUNT');
    },
  );

  it('returns a valid form result when closing an empty position', () => {
    const { result } = renderUseFormValidation({
      action: 'close',
      averageSwapPriceImpactPercentage: undefined,
      formValues: {
        shortAmountTokens: '',
        longAmountTokens: '',
      },
    });

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.formError).toBeUndefined();
  });

  it('returns EMPTY_SHORT_TOKEN_AMOUNT when short amount is negative', () => {
    const { result } = renderUseFormValidation({
      action: 'increase',
      formValues: {
        shortAmountTokens: '-1',
      },
    });

    expect(result.current.formError?.code).toBe('EMPTY_SHORT_TOKEN_AMOUNT');
  });

  it('returns HIGHER_THAN_AVAILABLE_SHORT_AMOUNT when short amount exceeds the available limit', () => {
    const { result } = renderUseFormValidation({
      limitShortTokens: new BigNumber('0.25'),
      formValues: {
        shortAmountTokens: '0.5',
      },
    });

    expect(result.current.formError?.code).toBe('HIGHER_THAN_AVAILABLE_SHORT_AMOUNT');
  });

  it('returns HIGHER_THAN_AVAILABLE_DSA_AMOUNT when DSA amount exceeds the available limit', () => {
    const { result } = renderUseFormValidation({
      action: 'withdrawDsa',
      limitDsaTokens: new BigNumber('0.5'),
      averageSwapPriceImpactPercentage: undefined,
      formValues: {
        dsaAmountTokens: '1',
      },
    });

    expect(result.current.formError?.code).toBe('HIGHER_THAN_AVAILABLE_DSA_AMOUNT');
  });

  it('returns MISSING_DATA when simulated position is missing', () => {
    const { result } = renderUseFormValidation({
      action: 'withdrawDsa',
      averageSwapPriceImpactPercentage: undefined,
      simulatedPosition: undefined,
    });

    expect(result.current.formError?.code).toBe('MISSING_DATA');
  });

  it('returns MISSING_DATA when swap price impact is missing for swap actions', () => {
    const { result } = renderUseFormValidation({
      averageSwapPriceImpactPercentage: undefined,
    });

    expect(result.current.formError?.code).toBe('MISSING_DATA');
  });

  it('returns a valid form result for collateral-only actions without swap price impact', () => {
    const { result } = renderUseFormValidation({
      action: 'supplyDsa',
      averageSwapPriceImpactPercentage: undefined,
      formValues: {
        shortAmountTokens: '',
      },
    });

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.formError).toBeUndefined();
  });

  it('passes the selected DSA token, spender address, and account address to useTokenApproval', () => {
    setHookState({
      accountAddress: altAddress,
      contractAddress: altAddress,
    });

    renderUseFormValidation({
      formValues: {
        dsaToken: alternativePosition.dsaAsset.vToken.underlyingToken,
      },
    });

    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: alternativePosition.dsaAsset.vToken.underlyingToken,
      spenderAddress: altAddress,
      accountAddress: altAddress,
    });
  });

  it('returns a valid form result when all required data is present', () => {
    const { result } = renderUseFormValidation();

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.formError).toBeUndefined();
  });
});
