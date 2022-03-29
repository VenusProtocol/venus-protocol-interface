/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';

import { convertWeiToCoins } from 'utilities/common';
import { Icon } from '../../Icon';
import { TokenTextField } from '../../TokenTextField';
import { SecondaryButton } from '../../Button';
import { useStyles } from './styles';

const VAI_SYMBOL = 'vai';

export interface IMintUiProps {
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
  limitWei: BigNumber;
  mintFeePercentage: number;
}

// TODO: Move to dashboard component/container once created
export const MintUi: React.FC<IMintUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isSubmitting,
  onSubmit,
}) => {
  const styles = useStyles();
  const [value, setValue] = React.useState<BigNumber | ''>('');

  const isValueValid = value && value.isGreaterThan(0);

  // Convert limit into VAI
  const readableLimitVai = React.useMemo(
    () => convertWeiToCoins({ value: limitWei, tokenSymbol: VAI_SYMBOL }).toString(),
    [limitWei],
  );

  // Calculate fee
  const feeWei = new BigNumber(value || 0).multipliedBy(mintFeePercentage).dividedBy(100);
  const readableFeeVai = convertWeiToCoins({ value: feeWei, tokenSymbol: VAI_SYMBOL }).toString();

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent native submission behavior
    e.preventDefault();

    if (value) {
      await onSubmit(value);

      // Reset value
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TokenTextField
        css={styles.textField}
        tokenSymbol={VAI_SYMBOL}
        value={value}
        onChange={setValue}
        maxWei={limitWei}
        disabled={disabled || isSubmitting}
        rightMaxButtonLabel="SAFE MAX"
      />

      <div css={styles.getRow({ isLast: false })}>
        <div css={styles.infoColumn}>
          <Icon name={VAI_SYMBOL} css={styles.coinIcon} />
          <Typography component="span" variant="small2">
            Available VAI Limit
          </Typography>
        </div>

        <Typography component="span" css={styles.infoValue} variant="small1">
          {readableLimitVai} VAI
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
          {readableFeeVai} VAI ({mintFeePercentage}%)
        </Typography>
      </div>

      <SecondaryButton
        css={styles.submitButton}
        type="submit"
        loading={isSubmitting}
        disabled={disabled || !isValueValid}
      >
        Mint VAI
      </SecondaryButton>
    </form>
  );
};

export const Mint: React.FC = () => {
  // TODO: fetch actual data
  const isUserLoggedIn = true;
  const limitWei = new BigNumber('100.12').multipliedBy(new BigNumber(10).pow(18));
  const mintFeePercentage = 2.14;

  const onSubmit: IMintUiProps['onSubmit'] = async value => {
    // TODO: call contract
    console.log('Amount to mint:', value.toString());
  };

  return (
    <MintUi
      disabled={!isUserLoggedIn}
      limitWei={limitWei}
      mintFeePercentage={mintFeePercentage}
      isSubmitting={false}
      onSubmit={onSubmit}
    />
  );
};
