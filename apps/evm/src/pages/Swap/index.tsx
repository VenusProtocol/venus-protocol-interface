import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { useSwapTokens } from 'clients/api';
import {
  Card,
  Icon,
  LabeledInlineContent,
  Page,
  SelectTokenTextField,
  SpendingLimit,
  TextButton,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import { useGetSwapTokenUserBalances } from 'hooks/useGetSwapTokenUserBalances';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError, handleError } from 'libs/errors';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { areTokensEqual, convertMantissaToTokens } from 'utilities';

import Notice from './Notice';
import SubmitSection from './SubmitSection';
import { SwapDetails } from './SwapDetails';
import TEST_IDS from './testIds';
import type { FormValues } from './types';
import useFormValidation from './useFormValidation';

const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { address: legacyPoolComptrollerContractAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });

  const { address: swapRouterContractAddress } = useGetContractAddress({
    name: 'SwapRouter',
    poolComptrollerContractAddress: legacyPoolComptrollerContractAddress || NULL_ADDRESS,
  });

  const tokens = useGetTokens();
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const bnb = useGetToken({
    symbol: 'BNB',
  });

  const initialFormValues: FormValues = {
    fromToken: bnb || tokens[0],
    fromTokenAmountTokens: '',
    toToken: xvs || tokens[1],
    toTokenAmountTokens: '',
    direction: 'exactAmountIn',
  };

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.fromTokenAmountTokens,
    toToken: formValues.toToken,
    toTokenAmountTokens: formValues.toTokenAmountTokens,
    direction: formValues.direction,
  });

  const {
    isTokenApproved: isFromTokenApproved,
    approveToken: approveFromToken,
    isApproveTokenLoading: isApproveFromTokenLoading,
    isWalletSpendingLimitLoading: isFromTokenWalletSpendingLimitLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress: swapRouterContractAddress,
    accountAddress,
  });

  const { data: tokenBalancesData } = useGetSwapTokenUserBalances({
    accountAddress,
    poolComptrollerContractAddress: legacyPoolComptrollerContractAddress || NULL_ADDRESS,
  });

  const { mutateAsync: swapTokens, isPending: isSwapTokensLoading } = useSwapTokens();

  const tokenBalances = useMemo(() => tokenBalancesData || [], [tokenBalancesData]);
  const swap = swapInfo.swap;
  const swapError = swapInfo.error;
  const isSwapLoading = swapInfo.isLoading;
  const isSubmitting = isSwapTokensLoading;

  const { fromTokenUserBalanceMantissa, toTokenUserBalanceMantissa } = useMemo(
    () =>
      tokenBalances.reduce(
        (acc, tokenBalance) => {
          if (areTokensEqual(tokenBalance.token, formValues.fromToken)) {
            acc.fromTokenUserBalanceMantissa = tokenBalance.balanceMantissa;
          } else if (areTokensEqual(tokenBalance.token, formValues.toToken)) {
            acc.toTokenUserBalanceMantissa = tokenBalance.balanceMantissa;
          }

          return acc;
        },
        {
          fromTokenUserBalanceMantissa: undefined,
          toTokenUserBalanceMantissa: undefined,
        } as {
          fromTokenUserBalanceMantissa?: BigNumber;
          toTokenUserBalanceMantissa?: BigNumber;
        },
      ),
    [tokenBalances, formValues.fromToken, formValues.toToken],
  );

  useEffect(() => {
    if (swap?.direction === 'exactAmountIn') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        toTokenAmountTokens: convertMantissaToTokens({
          value: swap.expectedToTokenAmountReceivedMantissa,
          token: swap.toToken,
        }).toFixed(),
      }));
    }

    if (swap?.direction === 'exactAmountOut') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: convertMantissaToTokens({
          value: swap.expectedFromTokenAmountSoldMantissa,
          token: swap.fromToken,
        }).toFixed(),
      }));
    }
  }, [swap]);

  const switchTokens = () =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      fromToken: currentFormValues.toToken,
      fromTokenAmountTokens:
        currentFormValues.direction === 'exactAmountIn'
          ? initialFormValues.toTokenAmountTokens
          : currentFormValues.toTokenAmountTokens,
      toToken: currentFormValues.fromToken,
      toTokenAmountTokens:
        currentFormValues.direction === 'exactAmountIn'
          ? currentFormValues.fromTokenAmountTokens
          : initialFormValues.fromTokenAmountTokens,
      direction:
        currentFormValues.direction === 'exactAmountIn' ? 'exactAmountOut' : 'exactAmountIn',
    }));

  const fromTokenUserBalanceTokens = useMemo(
    () =>
      fromTokenUserBalanceMantissa &&
      convertMantissaToTokens({
        value: fromTokenUserBalanceMantissa,
        token: formValues.fromToken,
      }),
    [fromTokenUserBalanceMantissa, formValues.fromToken],
  );

  const maxFromInput = useMemo(
    () => new BigNumber(fromTokenUserBalanceTokens || 0).toFixed(),
    [fromTokenUserBalanceTokens],
  );

  const handleSubmit = async () => {
    if (!swap) {
      return;
    }

    if (!legacyPoolComptrollerContractAddress) {
      handleError({
        error: new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        }),
      });
      return;
    }

    try {
      await swapTokens({
        swap,
        poolComptrollerContractAddress: legacyPoolComptrollerContractAddress,
      });

      // Reset form on success
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: initialFormValues.fromTokenAmountTokens,
        toTokenAmountTokens: initialFormValues.toTokenAmountTokens,
      }));
    } catch (error) {
      handleError({ error });
    }
  };

  // Define lists of tokens for each text field
  const { fromTokenBalances, toTokenBalances } = useMemo(() => {
    const fromTokenBalancesTmp = tokenBalances.filter(
      tokenBalance =>
        tokenBalance.token.address.toLowerCase() !== formValues.fromToken.address.toLowerCase(),
    );
    const toTokenBalancesTmp = tokenBalances.filter(
      tokenBalance =>
        tokenBalance.token.address.toLowerCase() !== formValues.toToken.address.toLowerCase(),
    );

    return {
      fromTokenBalances: fromTokenBalancesTmp,
      toTokenBalances: toTokenBalancesTmp,
    };
  }, [tokenBalances, formValues.fromToken.address, formValues.toToken.address]);

  const readableFromTokenUserBalance = useConvertMantissaToReadableTokenString({
    value: fromTokenUserBalanceMantissa,
    token: formValues.fromToken,
  });

  const readableToTokenUserBalance = useConvertMantissaToReadableTokenString({
    value: toTokenUserBalanceMantissa,
    token: formValues.toToken,
  });

  // Form validation
  const { isFormValid, errors: formErrors } = useFormValidation({
    swap,
    formValues,
    fromTokenUserBalanceMantissa,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
  });

  const onFromInputChange = (amount: string) =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      fromTokenAmountTokens: amount,
      // Reset toTokenAmount field value if users resets fromTokenAmount
      // field value
      toTokenAmountTokens:
        amount === ''
          ? initialFormValues.toTokenAmountTokens
          : currentFormValues.toTokenAmountTokens,
      direction: 'exactAmountIn',
    }));

  return (
    <Page>
      <Card className="mx-auto w-full max-w-full p-4 md:max-w-136 md:p-10">
        <ConnectWallet message={t('swapPage.connectWalletToSwap')} analyticVariant="swap">
          <SelectTokenTextField
            label={t('swapPage.fromTokenAmountField.label')}
            selectedToken={formValues.fromToken}
            value={formValues.fromTokenAmountTokens}
            hasError={
              !isSubmitting && formErrors.length > 0 && Number(formValues.fromTokenAmountTokens) > 0
            }
            data-testid={TEST_IDS.fromTokenSelectTokenTextField}
            disabled={isSubmitting}
            displayCommonTokenButtons
            onChange={onFromInputChange}
            onChangeSelectedToken={token =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                fromToken: token,
                // Invert toToken and fromToken if selected token is the same as
                // toToken
                toToken: areTokensEqual(token, formValues.toToken)
                  ? currentFormValues.fromToken
                  : currentFormValues.toToken,
              }))
            }
            rightMaxButton={{
              label: t('swapPage.fromTokenAmountField.max').toUpperCase(),
              onClick: () => onFromInputChange(maxFromInput),
            }}
            tokenBalances={fromTokenBalances}
            className="mb-4"
          />

          <div className="mb-6">
            <Notice formErrors={formErrors} swap={swap} />
          </div>

          <div className="mb-6">
            <LabeledInlineContent label={t('swapPage.walletBalance')} className="mb-3">
              {readableFromTokenUserBalance}
            </LabeledInlineContent>

            <SpendingLimit
              token={formValues.fromToken}
              walletBalanceTokens={fromTokenUserBalanceTokens}
              walletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
              onRevoke={revokeFromTokenWalletSpendingLimit}
              isRevokeLoading={isRevokeFromTokenWalletSpendingLimitLoading}
              data-testid={TEST_IDS.spendingLimit}
            />
          </div>

          <TextButton
            className="mx-auto mb-4 flex h-auto p-2"
            onClick={switchTokens}
            disabled={isSubmitting}
            data-testid={TEST_IDS.switchTokensButton}
          >
            <Icon name="convert" className="h-6 w-6 rotate-90 text-blue" />
          </TextButton>

          <SelectTokenTextField
            label={t('swapPage.toTokenAmountField.label')}
            selectedToken={formValues.toToken}
            value={formValues.toTokenAmountTokens}
            disabled={isSubmitting}
            data-testid={TEST_IDS.toTokenSelectTokenTextField}
            displayCommonTokenButtons
            onChange={amount =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                toTokenAmountTokens: amount,
                // Reset fromTokenAmount field value if users resets toTokenAmount
                // field value
                fromTokenAmountTokens:
                  amount === ''
                    ? initialFormValues.fromTokenAmountTokens
                    : currentFormValues.fromTokenAmountTokens,
                direction: 'exactAmountOut',
              }))
            }
            onChangeSelectedToken={token =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                toToken: token,
                // Invert fromToken and toToken if selected token is the same as
                // fromToken
                fromToken: areTokensEqual(token, formValues.fromToken)
                  ? currentFormValues.toToken
                  : currentFormValues.fromToken,
              }))
            }
            tokenBalances={toTokenBalances}
            className="mb-4"
          />

          <LabeledInlineContent label={t('swapPage.walletBalance')} className="mb-6">
            {readableToTokenUserBalance}
          </LabeledInlineContent>

          <SwapDetails swap={swap} data-testid={TEST_IDS.swapDetails} className="mb-6" />

          <SubmitSection
            onSubmit={handleSubmit}
            fromToken={formValues.fromToken}
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            formErrors={formErrors}
            swap={swap}
            swapError={swapError}
            isSwapLoading={isSwapLoading}
            approveFromToken={approveFromToken}
            isApproveFromTokenLoading={isApproveFromTokenLoading}
            isFromTokenApproved={isFromTokenApproved}
            isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
            isRevokeFromTokenWalletSpendingLimitLoading={
              isRevokeFromTokenWalletSpendingLimitLoading
            }
          />
        </ConnectWallet>
      </Card>
    </Page>
  );
};

export default SwapPage;
