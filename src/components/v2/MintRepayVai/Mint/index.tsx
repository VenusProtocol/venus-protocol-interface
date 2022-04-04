/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { convertWeiToCoins } from 'utilities/common';
import { LabeledInlineContent } from '../../LabeledInlineContent';
import { TokenAmountForm } from '../../TokenAmountForm';
import { TokenTextField } from '../../TokenTextField';
import { SecondaryButton } from '../../Button';
import { VAI_SYMBOL } from '../constants';
import getReadableFeeVai from './getReadableFeeVai';
import { useStyles } from './styles';

export interface IMintUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
  limitWei: BigNumber;
  mintFeePercentage: number;
}

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

  return (
    <TokenAmountForm onSubmit={onSubmit}>
      {({ values, setFieldValue, handleBlur, isSubmitting, isValid, touched }) => (
        <>
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

          <LabeledInlineContent
            css={styles.getRow({ isLast: false })}
            iconName={VAI_SYMBOL}
            label="Available VAI Limit"
          >
            {`${readableLimitVai} VAI`}
          </LabeledInlineContent>

          <LabeledInlineContent
            css={styles.getRow({ isLast: true })}
            iconName="fee"
            label="Mint fee"
          >
            {values.amount
              ? getReadableFeeVai({ valueWei: values.amount, mintFeePercentage })
              : '0'}
            {` VAI (${mintFeePercentage}%)`}
          </LabeledInlineContent>

          <SecondaryButton
            css={styles.submitButton}
            type="submit"
            loading={isSubmitting || isMintVaiLoading}
            disabled={disabled || !isValid || !touched.amount}
          >
            Mint VAI
          </SecondaryButton>
        </>
      )}
    </TokenAmountForm>
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
