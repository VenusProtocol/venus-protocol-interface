/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import {
  Icon,
  LabeledInlineContent,
  PrimaryButton,
  SelectTokenTextField,
  TertiaryButton,
} from 'components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertWeiToTokens, formatToReadablePercentage, getToken } from 'utilities';

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
  fromTokenAmountTokens: string;
  toTokenId: string;
  toTokenAmountTokens: string;
  direction: 'exactAmountIn' | 'exactAmountOut';
}

const initialFormValues: FormValues = {
  fromTokenId: 'bnb',
  fromTokenAmountTokens: '',
  toTokenId: 'xvs',
  toTokenAmountTokens: '',
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
    fromTokenAmountTokens: formValues.fromTokenAmountTokens,
    toTokenAmountTokens: formValues.toTokenAmountTokens,
    direction: formValues.direction,
  });

  useEffect(() => {
    // Reinitialize form values if swap becomes invalid
    if (!swapInfo) {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: '',
        toTokenAmountTokens: '',
      }));
    }

    if (swapInfo?.direction === 'exactAmountIn') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        toTokenAmountTokens: convertWeiToTokens({
          valueWei: swapInfo.expectedToTokenAmountReceivedWei,
          tokenId: swapInfo.toToken.id,
        }).toFixed(),
      }));
    }

    if (swapInfo?.direction === 'exactAmountOut') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        fromTokenAmountTokens: convertWeiToTokens({
          valueWei: swapInfo.expectedFromTokenAmountSoldWei,
          tokenId: swapInfo.fromToken.id,
        }).toFixed(),
      }));
    }
  }, [swapInfo]);

  const switchTokens = () =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      fromTokenId: currentFormValues.toTokenId,
      fromTokenAmountTokens: currentFormValues.toTokenAmountTokens,
      toTokenId: currentFormValues.fromTokenId,
      toTokenAmountTokens: currentFormValues.fromTokenAmountTokens,
      direction:
        currentFormValues.direction === 'exactAmountIn' ? 'exactAmountOut' : 'exactAmountIn',
    }));

  return (
    <Paper css={styles.container}>
      <SelectTokenTextField
        label={t('swapPage.fromTokenAmountField.label')}
        selectedTokenId={formValues.fromTokenId as TokenId}
        value={formValues.fromTokenAmountTokens}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            fromTokenAmountTokens: amount,
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
        label={t('swapPage.toTokenAmountField.label')}
        selectedTokenId={formValues.toTokenId as TokenId}
        value={formValues.toTokenAmountTokens}
        onChange={amount =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            toTokenAmountTokens: amount,
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
              fromTokenAmount: convertWeiToTokens({
                valueWei:
                  swapInfo.direction === 'exactAmountIn'
                    ? swapInfo.fromTokenAmountSoldWei
                    : swapInfo.maximumFromTokenAmountSoldWei,
                tokenId: swapInfo.fromToken.id,
                returnInReadableFormat: true,
              }),
              toTokenAmount: convertWeiToTokens({
                valueWei:
                  swapInfo.direction === 'exactAmountIn'
                    ? swapInfo.minimumToTokenAmountReceivedWei
                    : swapInfo.toTokenAmountReceivedWei,
                tokenId: swapInfo.toToken.id,
                returnInReadableFormat: true,
              }),
            })
          : t('swapPage.submitButton.disabledLabel')}
      </PrimaryButton>
    </Paper>
  );
};

const Swap: React.FC = () => <SwapUi />;

export default Swap;
