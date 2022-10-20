/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import { Icon, SelectTokenTextField, TertiaryButton } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';

import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';

const tokenIds = Object.keys(TOKENS) as TokenId[];

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
    </Paper>
  );
};

const Swap: React.FC = () => <SwapUi />;

export default Swap;
