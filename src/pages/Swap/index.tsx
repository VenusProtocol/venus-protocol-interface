/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import {
  Icon,
  LabeledInlineContent,
  PrimaryButton,
  SelectTokenTextField,
  TertiaryButton,
  toast,
} from 'components';
import { VError } from 'errors';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'translation';
import { Swap, SwapDirection, Token } from 'types';
import { convertWeiToTokens, formatToReadablePercentage } from 'utilities';
import type { TransactionReceipt } from 'web3-core/types';

import { useGetBalanceOf, useSwapTokens } from 'clients/api';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { PANCAKE_SWAP_TOKENS, TESTNET_PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from './styles';
import useGetSwapInfo from './useGetSwapInfo';

const tokens = Object.values(PANCAKE_SWAP_TOKENS) as Token[];

const readableSlippageTolerancePercentage = formatToReadablePercentage(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

interface FormValues {
  fromToken: Token;
  fromTokenAmountTokens: string;
  toToken: Token;
  toTokenAmountTokens: string;
  direction: SwapDirection;
}

const initialFormValues: FormValues = {
  // TODO: handle mainnet
  fromToken: TESTNET_PANCAKE_SWAP_TOKENS.busd as Token,
  fromTokenAmountTokens: '',
  // TODO: handle mainnet
  toToken: TESTNET_PANCAKE_SWAP_TOKENS.cake as Token,
  toTokenAmountTokens: '',
  direction: 'exactAmountIn',
};

export interface SwapPageUiProps {
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  fromTokenUserBalanceWei?: BigNumber;
  toTokenUserBalanceWei?: BigNumber;
  onSubmit: (swap: Swap) => Promise<TransactionReceipt>;
  isSubmitting: boolean;
  swapInfo?: Swap;
}

const SwapPageUi: React.FC<SwapPageUiProps> = ({
  formValues,
  setFormValues,
  swapInfo,
  onSubmit,
  isSubmitting,
  fromTokenUserBalanceWei,
  toTokenUserBalanceWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  // TODO: reinitialize form values if swap becomes invalid

  useEffect(() => {
    if (swapInfo?.direction === 'exactAmountIn') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        toTokenAmountTokens: convertWeiToTokens({
          valueWei: swapInfo.expectedToTokenAmountReceivedWei,
          token: swapInfo.toToken,
        }).toFixed(),
      }));
    }

    if (swapInfo?.direction === 'exactAmountOut') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: convertWeiToTokens({
          valueWei: swapInfo.expectedFromTokenAmountSoldWei,
          token: swapInfo.fromToken,
        }).toFixed(),
      }));
    }
  }, [swapInfo]);

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

  const handleSubmit = async () => {
    if (swapInfo) {
      try {
        const transactionReceipt = await onSubmit(swapInfo);

        openSuccessfulTransactionModal({
          title: t('swapPage.successfulConvertTransactionModal.title'),
          transactionHash: transactionReceipt.transactionHash,
          content: 'Successful swap', // TODO: design
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

  return (
    <Paper css={styles.container}>
      <SelectTokenTextField
        label={t('swapPage.fromTokenAmountField.label')}
        selectedToken={formValues.fromToken}
        value={formValues.fromTokenAmountTokens}
        disabled={isSubmitting}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromTokenAmountTokens: amount,
            direction: 'exactAmountIn',
          }))
        }
        onChangeSelectedToken={token =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromToken: token,
            // Invert toToken and fromToken if selected token is the same as
            // toToken
            toToken:
              token.address === formValues.toToken.address
                ? currentFormValues.fromToken
                : currentFormValues.toToken,
          }))
        }
        tokens={tokens.filter(token => token.address !== formValues.fromToken.address)}
        userTokenBalanceWei={fromTokenUserBalanceWei}
        css={styles.selectTokenTextField}
      />

      <TertiaryButton css={styles.switchButton} onClick={switchTokens} disabled={isSubmitting}>
        <Icon name="convert" css={styles.switchButtonIcon} />
      </TertiaryButton>

      <SelectTokenTextField
        label={t('swapPage.toTokenAmountField.label')}
        selectedToken={formValues.toToken}
        value={formValues.toTokenAmountTokens}
        disabled={isSubmitting}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toTokenAmountTokens: amount,
            direction: 'exactAmountOut',
          }))
        }
        onChangeSelectedToken={token =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toToken: token,
            // Invert fromToken and toToken if selected token is the same as
            // fromToken
            fromToken:
              token.address === formValues.fromToken.address
                ? currentFormValues.toToken
                : currentFormValues.fromToken,
          }))
        }
        tokens={tokens.filter(token => token.address !== formValues.toToken.address)}
        userTokenBalanceWei={toTokenUserBalanceWei}
        css={styles.selectTokenTextField}
      />

      {swapInfo && (
        <>
          <LabeledInlineContent label={t('swapPage.exchangeRate.label')} css={styles.swapInfoRow}>
            {t('swapPage.exchangeRate.value', {
              fromTokenSymbol: formValues.fromToken.symbol,
              toTokenSymbol: formValues.toToken.symbol,
              rate: swapInfo.exchangeRate,
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
              swapInfo.direction === 'exactAmountIn'
                ? t('swapPage.minimumReceived.label')
                : t('swapPage.maximumSold.label')
            }
            css={styles.swapInfoRow}
          >
            {convertWeiToTokens({
              valueWei:
                swapInfo.direction === 'exactAmountIn'
                  ? swapInfo.minimumToTokenAmountReceivedWei
                  : swapInfo.maximumFromTokenAmountSoldWei,
              token: swapInfo.direction === 'exactAmountIn' ? swapInfo.toToken : swapInfo.fromToken,
              returnInReadableFormat: true,
            })}
          </LabeledInlineContent>
        </>
      )}

      <PrimaryButton
        fullWidth
        disabled={!swapInfo}
        css={styles.submitButton}
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        {swapInfo
          ? t('swapPage.submitButton.enabledLabel', {
              fromTokenAmount: convertWeiToTokens({
                valueWei:
                  swapInfo.direction === 'exactAmountIn'
                    ? swapInfo.fromTokenAmountSoldWei
                    : swapInfo.maximumFromTokenAmountSoldWei,
                token: swapInfo.fromToken,
                returnInReadableFormat: true,
              }),
              toTokenAmount: convertWeiToTokens({
                valueWei:
                  swapInfo.direction === 'exactAmountIn'
                    ? swapInfo.minimumToTokenAmountReceivedWei
                    : swapInfo.toTokenAmountReceivedWei,
                token: swapInfo.toToken,
                returnInReadableFormat: true,
              }),
            })
          : t('swapPage.submitButton.disabledLabel')}
      </PrimaryButton>
    </Paper>
  );
};

const SwapPage: React.FC = () => {
  const { account } = React.useContext(AuthContext);

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.fromTokenAmountTokens,
    toToken: formValues.toToken,
    toTokenAmountTokens: formValues.toTokenAmountTokens,
    direction: formValues.direction,
  });

  const { data: fromTokenUserBalanceData } = useGetBalanceOf(
    { accountAddress: account?.address || '', token: formValues.fromToken },
    {
      enabled: !!account?.address,
    },
  );

  const { data: toTokenUserBalanceData } = useGetBalanceOf(
    { accountAddress: account?.address || '', token: formValues.toToken },
    {
      enabled: !!account?.address,
    },
  );

  const { mutateAsync: swapTokens, isLoading: isSwapTokensLoading } = useSwapTokens();

  const onSwap = async (swap: Swap) => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    return swapTokens({
      swap,
      fromAccountAddress: account?.address,
    });
  };

  return (
    <SwapPageUi
      formValues={formValues}
      setFormValues={setFormValues}
      swapInfo={swapInfo}
      fromTokenUserBalanceWei={fromTokenUserBalanceData?.balanceWei}
      toTokenUserBalanceWei={toTokenUserBalanceData?.balanceWei}
      onSubmit={onSwap}
      isSubmitting={isSwapTokensLoading}
    />
  );
};

export default SwapPage;
