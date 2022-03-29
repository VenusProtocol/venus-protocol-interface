/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';

import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { Icon } from '../../Icon';
import { TextField } from '../../TextField';
import { TertiaryButton, SecondaryButton } from '../../Button';
import { useStyles } from './styles';

const VAI_DECIMALS = CONTRACT_TOKEN_ADDRESS.vai.decimals;
const oneVaiInWei = new BigNumber(10).pow(VAI_DECIMALS);
const oneWeiInVai = new BigNumber(1).dividedBy(oneVaiInWei);

// TODO: make into a utility that can be used for all coins
const convertWeiToVai = (valueWei: BigNumber) =>
  valueWei.dividedBy(oneVaiInWei).decimalPlaces(VAI_DECIMALS);

const convertVaiToWei = (valueWei: BigNumber) => valueWei.multipliedBy(oneVaiInWei);

export interface IMintUiProps {
  isSubmitting: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
  limitWei: BigNumber;
  mintFeePercentage: number;
}

// TODO: Move to dashboard component/container once created
export const MintUi: React.FC<IMintUiProps> = ({
  limitWei,
  mintFeePercentage,
  isSubmitting,
  onSubmit,
}) => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');

  // Convert limit to VAI
  const limitVai = convertWeiToVai(limitWei).toString();

  const isValueValid = parseInt(value, 10) > 0;

  // Calculate fee
  const feeVai = isValueValid
    ? new BigNumber(value).multipliedBy(mintFeePercentage).dividedBy(100).toFixed(2)
    : '0';

  const setMaxValue = () => setValue(limitVai);

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent native submission behavior
    e.preventDefault();

    // Convert value to wei before submitting
    const weiValue = convertVaiToWei(new BigNumber(value));
    await onSubmit(weiValue);

    // Reset value
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* TODO: make this into a reusable component */}
      <TextField
        css={styles.textField}
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        placeholder="0.00"
        min={0}
        max={limitVai}
        step={oneWeiInVai.toString()}
        type="number"
        disabled={isSubmitting}
        rightAdornment={
          <TertiaryButton onClick={setMaxValue} small disabled={isSubmitting}>
            SAFE MAX
          </TertiaryButton>
        }
      />

      <div css={styles.getRow({ isLast: false })}>
        <div css={styles.infoColumn}>
          <Icon name="vai" css={styles.coinIcon} />
          <Typography component="span" variant="small2">
            Available VAI Limit
          </Typography>
        </div>

        <Typography component="span" css={styles.infoValue} variant="small1">
          {limitVai} VAI
        </Typography>
      </div>

      <div css={styles.getRow({ isLast: true })}>
        <div css={styles.infoColumn}>
          <Icon name="fee" css={styles.coinIcon} />
          <Typography component="span" variant="small2">
            Mint fee
          </Typography>
        </div>

        <Typography component="span" css={styles.infoValue} variant="small1">
          {feeVai} VAI ({mintFeePercentage}%)
        </Typography>
      </div>

      <SecondaryButton
        css={styles.submitButton}
        type="submit"
        loading={isSubmitting}
        disabled={!isValueValid}
      >
        Mint VAI
      </SecondaryButton>
    </form>
  );
};

export const Mint: React.FC = () => {
  // TODO: fetch actual data
  const limitWei = new BigNumber('100.12').multipliedBy(new BigNumber(10).pow(VAI_DECIMALS));
  const mintFeePercentage = 2.14;

  const onSubmit: IMintUiProps['onSubmit'] = async value => {
    // TODO: mint VAI
    console.log('Amount to mint:', value.toString());
  };

  return (
    <MintUi
      limitWei={limitWei}
      mintFeePercentage={mintFeePercentage}
      isSubmitting={false}
      onSubmit={onSubmit}
    />
  );
};
