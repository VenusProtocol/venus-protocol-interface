/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import { SelectTokenTextField } from 'components';
import React, { useState } from 'react';
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

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  return (
    <Paper css={styles.container}>
      <SelectTokenTextField
        name="fromTokenAmount"
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
      />

      <SelectTokenTextField
        name="toTokenAmount"
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
      />
    </Paper>
  );
};

const Swap: React.FC = () => <SwapUi />;

export default Swap;
