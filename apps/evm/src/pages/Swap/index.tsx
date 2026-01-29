/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { Card, Page } from 'components';
import { useEffect, useMemo, useState } from 'react';

import { useSwapTokens } from 'clients/api';
import {
  Icon,
  LabeledInlineContent,
  SelectTokenTextField,
  SpendingLimit,
  TextButton,
} from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError, handleError } from 'libs/errors';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Swap, SwapError, TokenBalance } from 'types';
import { areTokensEqual, convertMantissaToTokens } from 'utilities';
import { SwapDetails } from './SwapDetails';

import { NULL_ADDRESS } from 'constants/address';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import Notice from './Notice';
import SubmitSection, { type SubmitSectionProps } from './SubmitSection';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import type { FormValues } from './types';
import useFormValidation from './useFormValidation';

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
  onSubmit: (swap: Swap) => Promise<unknown>;
  isSubmitting: boolean;
  tokenBalances: TokenBalance[];
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  initialFormValues: FormValues;
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
  initialFormValues,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

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
  }, [swap, setFormValues]);

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
    if (swap) {
      try {
        await onSubmit(swap);

        // Reset form on success
        setFormValues(currentFormValues => ({
          ...currentFormValues,
          fromTokenAmountTokens: initialFormValues.fromTokenAmountTokens,
          toTokenAmountTokens: initialFormValues.toTokenAmountTokens,
        }));
      } catch (error) {
        handleError({ error });
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
    <Card css={styles.container}>
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

        <TextButton
          className="mx-auto mb-4 flex h-auto p-2"
          onClick={switchTokens}
          disabled={isSubmitting}
          data-testid={TEST_IDS.switchTokensButton}
        >
          <Icon name="convert" css={styles.switchButtonIcon} />
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
          css={styles.selectTokenTextField}
        />

        <LabeledInlineContent
          label={t('swapPage.walletBalance')}
          css={styles.getRow({ isLast: true })}
        >
          {readableToTokenUserBalance}
        </LabeledInlineContent>

        <SwapDetails
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
    </Card>
  );
};

const SwapPage: React.FC = () => {
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

  const { data: tokenBalances } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const { mutateAsync: swapTokens, isPending: isSwapTokensLoading } = useSwapTokens();

  const onSwap = async (swap: Swap) => {
    if (!legacyPoolComptrollerContractAddress) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return swapTokens({
      swap,
      poolComptrollerContractAddress: legacyPoolComptrollerContractAddress,
    });
  };

  return (
    <Page>
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
        initialFormValues={initialFormValues}
      />
    </Page>
  );
};

export default SwapPage;
