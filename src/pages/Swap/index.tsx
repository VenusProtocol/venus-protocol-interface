/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  Icon,
  LabeledInlineContent,
  SelectTokenTextField,
  SpendingLimit,
  SwapDetails,
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
  getContractAddress,
  getSwapRouterContractAddress,
} from 'utilities';

import { useSwapTokens } from 'clients/api';
import { SWAP_TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';

import Notice from './Notice';
import SubmitSection, { SubmitSectionProps } from './SubmitSection';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import { FormValues } from './types';
import useFormValidation from './useFormValidation';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller');
const MAIN_POOL_SWAP_ROUTER_ADDRESS = getSwapRouterContractAddress(MAIN_POOL_COMPTROLLER_ADDRESS);

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
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
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
  fromTokenWalletSpendingLimitTokens,
  revokeFromTokenWalletSpendingLimit,
  isRevokeFromTokenWalletSpendingLimitLoading,
  onSubmit,
  isSubmitting,
  tokenBalances,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

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

  const fromTokenUserBalanceTokens = useMemo(
    () =>
      fromTokenUserBalanceWei &&
      convertWeiToTokens({
        valueWei: fromTokenUserBalanceWei,
        token: formValues.fromToken,
      }),
    [fromTokenUserBalanceWei],
  );

  const maxFromInput = useMemo(
    () => new BigNumber(fromTokenUserBalanceTokens || 0).toFixed(),
    [formValues.fromToken, fromTokenUserBalanceWei],
  );

  const handleSubmit = async () => {
    if (swap) {
      try {
        const contractReceipt = await onSubmit(swap);

        openSuccessfulTransactionModal({
          title: t('swapPage.successfulSwapTransactionModal.title'),
          content: t('swapPage.successfulSwapTransactionModal.message'),
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

  const readableToTokenUserBalance = useConvertWeiToReadableTokenString({
    valueWei: toTokenUserBalanceWei,
    token: formValues.toToken,
  });

  // Form validation
  const { isFormValid, errors: formErrors } = useFormValidation({
    swap,
    formValues,
    fromTokenUserBalanceWei,
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
    <Paper css={styles.container}>
      <ConnectWallet message={t('swapPage.connectWalletToSwap')}>
        <SelectTokenTextField
          label={t('swapPage.fromTokenAmountField.label')}
          selectedToken={formValues.fromToken}
          value={formValues.fromTokenAmountTokens}
          hasError={
            !isSubmitting && formErrors.length > 0 && Number(formValues.fromTokenAmountTokens) > 0
          }
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

        <div css={styles.getRow({ isLast: true })}>
          <Notice formErrors={formErrors} swap={swap} />
        </div>

        <div css={styles.getRow({ isLast: true })}>
          <LabeledInlineContent
            label={t('swapPage.walletBalance')}
            css={styles.getRow({ isLast: false })}
          >
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

        <LabeledInlineContent
          label={t('swapPage.walletBalance')}
          css={styles.getRow({ isLast: true })}
        >
          {readableToTokenUserBalance}
        </LabeledInlineContent>

        <SwapDetails
          action="swap"
          swap={swap}
          data-testid={TEST_IDS.swapDetails}
          css={styles.getRow({ isLast: true })}
        />

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
          isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
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
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
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
      fromTokenWalletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
      revokeFromTokenWalletSpendingLimit={revokeFromTokenWalletSpendingLimit}
      isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
    />
  );
};

export default SwapPage;
