/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import {
  Icon,
  LabeledInlineContent,
  PrimaryButton,
  SelectTokenTextField,
  TertiaryButton,
} from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import {
  convertWeiToTokens,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getToken,
} from 'utilities';

import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';
import useGetSwapInfo from './useGetSwapInfo';

const tokenIds = Object.keys(TOKENS) as TokenId[];

const SLIPPAGE_TOLERANCE_PERCENTAGE = 0.5;
const readableSlippageTolerancePercentage = formatToReadablePercentage(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

interface FormValues {
  fromTokenId: string;
  fromTokenAmount: string;
  toTokenId: string;
  toTokenAmount: string;
  direction: 'exactAmountIn' | 'exactAmountOut';
}

const initialFormValues: FormValues = {
  fromTokenId: 'bnb',
  fromTokenAmount: '',
  toTokenId: 'xvs',
  toTokenAmount: '',
  direction: 'exactAmountIn',
};

const SwapUi: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const fromToken = getToken(formValues.fromTokenId as TokenId);
  const toToken = getToken(formValues.toTokenId as TokenId);

  const swapInfo = useGetSwapInfo({
    fromToken,
    toToken,
    fromTokenAmountTokens: formValues.fromTokenAmount,
    toTokenAmountTokens: formValues.toTokenAmount,
    direction: formValues.direction,
  });

  const switchTokens = () =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      fromTokenId: currentFormValues.toTokenId,
      fromTokenAmount: currentFormValues.toTokenAmount,
      toTokenId: currentFormValues.fromTokenId,
      toTokenAmount: currentFormValues.fromTokenAmount,
      direction:
        currentFormValues.direction === 'exactAmountIn' ? 'exactAmountOut' : 'exactAmountIn',
    }));

  return (
    <Paper css={styles.container}>
      <SelectTokenTextField
        name="fromTokenAmount"
        label={t('swapPage.fromTokenAmountField.label')}
        selectedTokenId={formValues.fromTokenId as TokenId}
        value={formValues.fromTokenAmount}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromTokenAmount: amount,
            direction: 'exactAmountIn',
          }))
        }
        onChangeSelectedTokenId={tokenId =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromTokenId: tokenId,
            // Invert toTokenId and fromTokenId if selected token ID is equal to
            // toTokenId
            toTokenId:
              tokenId === formValues.toTokenId
                ? currentFormValues.fromTokenId
                : currentFormValues.toTokenId,
          }))
        }
        tokenIds={tokenIds.filter(tokenId => tokenId !== formValues.fromTokenId)}
        css={styles.selectTokenTextField}
      />

      <TertiaryButton css={styles.switchButton} onClick={switchTokens}>
        <Icon name="convert" css={styles.switchButtonIcon} />
      </TertiaryButton>

      <SelectTokenTextField
        name="toTokenAmount"
        label={t('swapPage.toTokenAmountField.label')}
        selectedTokenId={formValues.toTokenId as TokenId}
        value={formValues.toTokenAmount}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toTokenAmount: amount,
            direction: 'exactAmountOut',
          }))
        }
        onChangeSelectedTokenId={tokenId =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toTokenId: tokenId,
            // Invert fromTokenId and toTokenId if selected token ID is equal
            // to fromTokenId
            fromTokenId:
              tokenId === formValues.fromTokenId
                ? currentFormValues.toTokenId
                : currentFormValues.fromTokenId,
          }))
        }
        tokenIds={tokenIds.filter(tokenId => tokenId !== formValues.toTokenId)}
        css={styles.selectTokenTextField}
      />

      {swapInfo && (
        <>
          <LabeledInlineContent label={t('swapPage.exchangeRate.label')} css={styles.swapInfoRow}>
            {t('swapPage.exchangeRate.value', {
              fromTokenSymbol: fromToken.symbol,
              toTokenSymbol: toToken.symbol,
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
              tokenId:
                swapInfo.direction === 'exactAmountIn'
                  ? swapInfo.toToken.id
                  : swapInfo.fromToken.id,
              returnInReadableFormat: true,
            })}
          </LabeledInlineContent>
        </>
      )}

      <PrimaryButton fullWidth disabled={!swapInfo} css={styles.submitButton}>
        {swapInfo
          ? t('swapPage.submitButton.enabledLabel', {
              fromTokenAmount: formatTokensToReadableValue({
                value: new BigNumber(formValues.fromTokenAmount),
                tokenId: formValues.fromTokenId as TokenId,
              }),
              toTokenAmount: formatTokensToReadableValue({
                value: new BigNumber(formValues.toTokenAmount),
                tokenId: formValues.toTokenId as TokenId,
              }),
            })
          : t('swapPage.submitButton.disabledLabel')}
      </PrimaryButton>
    </Paper>
  );
};

const Swap: React.FC = () => <SwapUi />;

export default Swap;
