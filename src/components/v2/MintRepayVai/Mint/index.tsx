/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Formik, Form } from 'formik';

import { convertWeiToCoins } from 'utilities/common';
import { LabeledInlineValue } from '../../LabeledInlineValue';
import { TokenTextField } from '../../TokenTextField';
import { SecondaryButton } from '../../Button';
import { useStyles } from './styles';

const VAI_SYMBOL = 'vai';

type FormValues = {
  amount: '' | BigNumber;
};

const initialValues: FormValues = {
  amount: '',
};

const getReadableFeeVai = ({
  valueWei,
  mintFeePercentage,
}: {
  valueWei: BigNumber;
  mintFeePercentage: number;
}) => {
  const feeWei = new BigNumber(valueWei || 0).multipliedBy(mintFeePercentage).dividedBy(100);
  return convertWeiToCoins({
    value: feeWei,
    tokenSymbol: VAI_SYMBOL,
    returnInReadableFormat: true,
  });
};

export interface IMintUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
  limitWei: BigNumber;
  mintFeePercentage: number;
}

// TODO: Move to dashboard component/container once created
export const MintUi: React.FC<IMintUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isMintVaiLoading,
  onSubmit,
}) => {
  const styles = useStyles();

  // Convert limit into VAI
  const readableLimitVai = React.useMemo(
    () => convertWeiToCoins({ value: limitWei, tokenSymbol: VAI_SYMBOL }).toString(),
    [limitWei],
  );

  const handleSubmit = (values: FormValues) => {
    if (values.amount) {
      onSubmit(values.amount);
    }
  };

  return (
    // TODO: add validation schema
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue, handleBlur, isSubmitting, isValid }) => (
        <Form>
          <TokenTextField
            name="amount"
            css={styles.textField}
            tokenSymbol={VAI_SYMBOL}
            value={values.amount}
            onChange={amount => setFieldValue('amount', amount)}
            onBlur={handleBlur}
            maxWei={limitWei}
            disabled={disabled || isSubmitting || isMintVaiLoading}
            rightMaxButtonLabel="SAFE MAX"
          />

          <LabeledInlineValue
            css={styles.getRow({ isLast: false })}
            iconName={VAI_SYMBOL}
            label="Available VAI Limit"
            value={`${readableLimitVai} VAI`}
          />

          <LabeledInlineValue
            css={styles.getRow({ isLast: true })}
            iconName="fee"
            label="Mint fee"
            value={`${
              values.amount
                ? getReadableFeeVai({ valueWei: values.amount, mintFeePercentage })
                : '0'
            } VAI (${mintFeePercentage}%)`}
          />

          <SecondaryButton
            css={styles.submitButton}
            type="submit"
            loading={isSubmitting || isMintVaiLoading}
            disabled={disabled || !isValid}
          >
            Mint VAI
          </SecondaryButton>
        </Form>
      )}
    </Formik>
  );
};

export const Mint: React.FC = () => {
  // TODO: fetch actual data
  const isUserLoggedIn = true;
  const limitWei = new BigNumber('100.12').multipliedBy(new BigNumber(10).pow(18));
  const mintFeePercentage = 2.14;
  const isMintVaiLoading = false;

  const onSubmit: IMintUiProps['onSubmit'] = async value => {
    // TODO: call contract
    console.log('Amount to mint:', value.toString());
  };

  return (
    <MintUi
      disabled={!isUserLoggedIn}
      limitWei={limitWei}
      mintFeePercentage={mintFeePercentage}
      isMintVaiLoading={isMintVaiLoading}
      onSubmit={onSubmit}
    />
  );
};
