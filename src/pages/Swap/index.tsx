/** @jsxImportSource @emotion/react */
// import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import { SelectTokenTextField } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { TokenId } from 'types';

import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';
import getValidationSchema, { FormValues } from './validationSchema';

const tokenIds = Object.keys(TOKENS) as TokenId[];

const initialFormValues: FormValues = {
  fromTokenId: 'bnb',
  fromTokenAmount: '',
  toTokenId: 'xvs',
  toTokenAmount: '',
  direction: 'exactAmountIn',
};

const SwapUi: React.FC = () => {
  const styles = useStyles();

  const handleSubmit = async (values: FormValues) => {
    // TODO: handle submission
    console.log(values);
  };

  return (
    <Paper css={styles.container}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={getValidationSchema({
          // TODO: fetch user token balance
          fromTokenMaxAmount: '10000000',
        })}
        isInitialValid={false}
        validateOnMount
        validateOnChange
      >
        {({ values, setFieldValue }) => (
          <>
            <SelectTokenTextField
              name="fromTokenAmount"
              selectedTokenId={values.fromTokenId as TokenId}
              value={values.fromTokenAmount}
              onChange={amount => {
                setFieldValue('fromTokenAmount', amount);
                // Update swap direction
                setFieldValue('direction', 'exactAmountIn');
              }}
              onChangeSelectedTokenId={tokenId => {
                // Invert fromTokenId and toTokenId if selected token ID is equal
                // to toTokenId
                if (tokenId === values.toTokenId) {
                  setFieldValue('toTokenId', values.fromTokenId);
                }

                setFieldValue('fromTokenId', tokenId);
              }}
              tokenIds={tokenIds.filter(tokenId => tokenId !== values.fromTokenId)}
            />

            <SelectTokenTextField
              name="toTokenAmount"
              selectedTokenId={values.toTokenId as TokenId}
              value={values.toTokenAmount}
              onChange={amount => {
                setFieldValue('toTokenAmount', amount);
                // Update swap direction
                setFieldValue('direction', 'exactAmountOut');
              }}
              onChangeSelectedTokenId={tokenId => {
                // Invert fromTokenId and toTokenId if selected token ID is equal
                // to fromTokenId
                if (tokenId === values.fromTokenId) {
                  setFieldValue('fromTokenId', values.toTokenId);
                }

                setFieldValue('toTokenId', tokenId);
              }}
              tokenIds={tokenIds.filter(tokenId => tokenId !== values.toTokenId)}
            />
          </>
        )}
      </Formik>
    </Paper>
  );
};

const Swap: React.FC = () => <SwapUi />;

export default Swap;
