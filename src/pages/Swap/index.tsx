/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  Icon,
  LabeledInlineContent,
  SelectTokenTextField,
  TertiaryButton,
  toast,
} from 'components';
import { ContractReceipt } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertWeiToTokens,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getContractAddress,
  getSwapRouterContractAddress,
} from 'utilities';

import { useSwapTokens } from 'clients/api';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { SWAP_TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';

import SubmitSection, { SubmitSectionProps } from './SubmitSection';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import { FormValues } from './types';
import useFormValidation from './useFormValidation';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller');
const MAIN_POOL_SWAP_ROUTER_ADDRESS = getSwapRouterContractAddress(MAIN_POOL_COMPTROLLER_ADDRESS);

const readableSlippageTolerancePercentage = formatToReadablePercentage(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

const initialFormValues: FormValues = {
  fromToken: SWAP_TOKENS.bnb,
  fromTokenAmountTokens: '',
  toToken: SWAP_TOKENS.xvs,
  toTokenAmountTokens: '',
  direction: 'exactAmountIn',
};

export interface SwapPageUiProps
  extends Pick<
    SubmitSectionProps,
    | 'approveFromToken'
    | 'isApproveFromTokenLoading'
    | 'isFromTokenApproved'
    | 'isFromTokenWalletSpendingLimitLoading'
  > {
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  onSubmit: (swap: Swap) => Promise<ContractReceipt>;
  isSubmitting: boolean;
  tokenBalances: TokenBalance[];
  isSwapLoading: boolean;
  swap?: Swap;
  swapError?: SwapError;
}

const SwapPageUi: React.FC<SwapPageUiProps> = ({
  formValues,
  setFormValues,
  swap,
  swapError,
  isSwapLoading,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenApproved,
  isFromTokenWalletSpendingLimitLoading,
  onSubmit,
  isSubmitting,
  tokenBalances,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const { fromTokenUserBalanceWei, toTokenUserBalanceWei } = useMemo(
    () =>
      tokenBalances.reduce(
        (acc, tokenBalance) => {
          if (areTokensEqual(tokenBalance.token, formValues.fromToken)) {
            acc.fromTokenUserBalanceWei = tokenBalance.balanceWei;
          } else if (areTokensEqual(tokenBalance.token, formValues.toToken)) {
            acc.toTokenUserBalanceWei = tokenBalance.balanceWei;
          }

          return acc;
        },
        {
          fromTokenUserBalanceWei: undefined,
          toTokenUserBalanceWei: undefined,
        } as {
          fromTokenUserBalanceWei?: BigNumber;
          toTokenUserBalanceWei?: BigNumber;
        },
      ),
    [tokenBalances, formValues.fromToken, formValues.toToken],
  );

  useEffect(() => {
    if (swap?.direction === 'exactAmountIn') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        toTokenAmountTokens: convertWeiToTokens({
          valueWei: swap.expectedToTokenAmountReceivedWei,
          token: swap.toToken,
        }).toFixed(),
      }));
    }

    if (swap?.direction === 'exactAmountOut') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: convertWeiToTokens({
          valueWei: swap.expectedFromTokenAmountSoldWei,
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

  const maxFromInput = useMemo(() => {
    if (!fromTokenUserBalanceWei) {
      return new BigNumber(0).toFixed();
    }

    const maxFromInputTokens = convertWeiToTokens({
      valueWei: fromTokenUserBalanceWei,
      token: formValues.fromToken,
    });

    return maxFromInputTokens.toFixed();
  }, [formValues.fromToken, fromTokenUserBalanceWei]);

  const handleSubmit = async () => {
    if (swap) {
      try {
        const contractReceipt = await onSubmit(swap);

        openSuccessfulTransactionModal({
          title: t('swapPage.successfulConvertTransactionModal.title'),
          content: t('swapPage.successfulConvertTransactionModal.message'),
          transactionHash: contractReceipt.transactionHash,
        });

        // Reset form on success
        setFormValues(currentFormValues => ({
          ...currentFormValues,
          fromTokenAmountTokens: initialFormValues.fromTokenAmountTokens,
          toTokenAmountTokens: initialFormValues.toTokenAmountTokens,
        }));
      } catch (err) {
        toast.error({ message: (err as Error).message });
      }
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

  const readableFromTokenUserBalance = useConvertWeiToReadableTokenString({
    valueWei: fromTokenUserBalanceWei,
    token: formValues.fromToken,
  });

  const readableToToTokenUserBalance = useConvertWeiToReadableTokenString({
    valueWei: toTokenUserBalanceWei,
    token: formValues.toToken,
  });

  const readableExchangeRate = useMemo(
    () =>
      swap &&
      formatTokensToReadableValue({
        value: swap.exchangeRate,
        token: swap.toToken,
        addSymbol: false,
      }),
    [swap?.exchangeRate, swap?.toToken],
  );

  // Form validation
  const { isFormValid, errors: formErrors } = useFormValidation({
    swap,
    formValues,
    fromTokenUserBalanceWei,
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
    <Paper css={styles.container}>
      <ConnectWallet message={t('swapPage.connectWalletToSwap')}>
        <SelectTokenTextField
          label={t('swapPage.fromTokenAmountField.label')}
          selectedToken={formValues.fromToken}
          value={formValues.fromTokenAmountTokens}
          hasError={formErrors.includes('FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE')}
          data-testid={TEST_IDS.fromTokenSelectTokenTextField}
          disabled={isSubmitting}
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
          css={styles.selectTokenTextField}
        />

        <Typography component="div" variant="small2" css={styles.greyLabel}>
          <Trans
            i18nKey="selectTokenTextField.walletBalance"
            components={{
              White: <span css={styles.whiteLabel} />,
            }}
            values={{
              balance: readableFromTokenUserBalance,
            }}
          />
        </Typography>

        <LabeledInlineContent
          label={t('operationModal.supply.walletBalance')}
          css={styles.getRow({ isLast: false })}
        >
          {readableFromTokenUserWalletBalanceTokens}
        </LabeledInlineContent>

        <TertiaryButton
          css={styles.switchButton}
          onClick={switchTokens}
          disabled={isSubmitting}
          data-testid={TEST_IDS.switchTokensButton}
        >
          <Icon name="convert" css={styles.switchButtonIcon} />
        </TertiaryButton>

        <SelectTokenTextField
          label={t('swapPage.toTokenAmountField.label')}
          selectedToken={formValues.toToken}
          value={formValues.toTokenAmountTokens}
          disabled={isSubmitting}
          data-testid={TEST_IDS.toTokenSelectTokenTextField}
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
          css={styles.selectTokenTextField}
        />

        <Typography component="div" variant="small2" css={styles.greyLabel}>
          <Trans
            i18nKey="selectTokenTextField.walletBalance"
            components={{
              White: <span css={styles.whiteLabel} />,
            }}
            values={{
              balance: readableToToTokenUserBalance,
            }}
          />
        </Typography>

        {swap && (
          <div data-testid={TEST_IDS.swapDetails} css={styles.swapDetails}>
            <LabeledInlineContent label={t('swapPage.exchangeRate.label')} css={styles.swapInfoRow}>
              {t('swapPage.exchangeRate.value', {
                fromTokenSymbol: formValues.fromToken.symbol,
                toTokenSymbol: formValues.toToken.symbol,
                rate: readableExchangeRate,
              })}
            </LabeledInlineContent>

            <LabeledInlineContent
              label={t('swapPage.slippageTolerance.label')}
              css={styles.swapInfoRow}
            >
              {readableSlippageTolerancePercentage}
            </LabeledInlineContent>

            <LabeledInlineContent
              label={
                swap.direction === 'exactAmountIn'
                  ? t('swapPage.minimumReceived.label')
                  : t('swapPage.maximumSold.label')
              }
              css={styles.swapInfoRow}
            >
              {convertWeiToTokens({
                valueWei:
                  swap.direction === 'exactAmountIn'
                    ? swap.minimumToTokenAmountReceivedWei
                    : swap.maximumFromTokenAmountSoldWei,
                token: swap.direction === 'exactAmountIn' ? swap.toToken : swap.fromToken,
                returnInReadableFormat: true,
              })}
            </LabeledInlineContent>
          </div>
        )}

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
        />
      </ConnectWallet>
    </Paper>
  );
};

const SwapPage: React.FC = () => {
  const { accountAddress } = useAuth();

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
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress: MAIN_POOL_SWAP_ROUTER_ADDRESS,
    accountAddress,
  });

  const { data: tokenBalances } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const { mutateAsync: swapTokens, isLoading: isSwapTokensLoading } = useSwapTokens({
    poolComptrollerAddress: MAIN_POOL_COMPTROLLER_ADDRESS,
  });

  const onSwap = async (swap: Swap) =>
    swapTokens({
      swap,
    });

  return (
    <SwapPageUi
      formValues={formValues}
      setFormValues={setFormValues}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
      tokenBalances={tokenBalances}
      onSubmit={onSwap}
      isSubmitting={isSwapTokensLoading}
      isFromTokenApproved={isFromTokenApproved}
      approveFromToken={approveFromToken}
      isApproveFromTokenLoading={isApproveFromTokenLoading}
      isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
    />
  );
};

export default SwapPage;
