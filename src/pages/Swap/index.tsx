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
import { Token, TokenId } from 'types';
import { convertWeiToTokens, formatToReadablePercentage, getToken } from 'utilities';

import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';
import { Swap, SwapDirection } from './types';
import useGetSwapInfo from './useGetSwapInfo';

const tokenIds = Object.keys(TOKENS) as TokenId[];

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
  fromToken: getToken('bnb'),
  fromTokenAmountTokens: '',
  toToken: getToken('xvs'),
  toTokenAmountTokens: '',
  direction: 'exactAmountIn',
};

export interface SwapPageUiProps {
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  swapInfo?: Swap;
}

const SwapPageUi: React.FC<SwapPageUiProps> = ({ formValues, setFormValues, swapInfo }) => {
  const styles = useStyles();
  const { t } = useTranslation();

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
      fromToken: currentFormValues.toToken,
      fromTokenAmountTokens: currentFormValues.toTokenAmountTokens,
      toToken: currentFormValues.fromToken,
      toTokenAmountTokens: currentFormValues.fromTokenAmountTokens,
      direction:
        currentFormValues.direction === 'exactAmountIn' ? 'exactAmountOut' : 'exactAmountIn',
    }));

  return (
    <Paper css={styles.container}>
      <SelectTokenTextField
        label={t('swapPage.fromTokenAmountField.label')}
        selectedTokenId={formValues.fromToken.id}
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
            fromToken: getToken(tokenId),
            // Invert toTokenId and fromTokenId if selected token ID is equal to
            // toTokenId
            toToken:
              tokenId === formValues.toToken.id
                ? currentFormValues.fromToken
                : currentFormValues.toToken,
          }))
        }
        tokenIds={tokenIds.filter(tokenId => tokenId !== formValues.fromToken.id)}
        css={styles.selectTokenTextField}
      />

      <TertiaryButton css={styles.switchButton} onClick={switchTokens}>
        <Icon name="convert" css={styles.switchButtonIcon} />
      </TertiaryButton>

      <SelectTokenTextField
        label={t('swapPage.toTokenAmountField.label')}
        selectedTokenId={formValues.toToken.id}
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
            toToken: getToken(tokenId),
            // Invert fromTokenId and toTokenId if selected token ID is equal
            // to fromTokenId
            fromToken:
              tokenId === formValues.fromToken.id
                ? currentFormValues.toToken
                : currentFormValues.fromToken,
          }))
        }
        tokenIds={tokenIds.filter(tokenId => tokenId !== formValues.toToken.id)}
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

const SwapPage: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.fromTokenAmountTokens,
    toToken: formValues.toToken,
    toTokenAmountTokens: formValues.toTokenAmountTokens,
    direction: formValues.direction,
  });

  return <SwapPageUi formValues={formValues} setFormValues={setFormValues} swapInfo={swapInfo} />;
};

export default SwapPage;
