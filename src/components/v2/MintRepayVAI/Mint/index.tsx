/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';

import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { Icon } from '../../Icon';
import { TextField } from '../../TextField';
import { TertiaryButton } from '../../Button';
import { useStyles } from './styles';

const VAI_INFO = CONTRACT_TOKEN_ADDRESS.vai;

export interface IMintUiProps {
  isSubmitting: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
  limitWei: BigNumber;
  mintFeePercentage: number;
}

// TODO: Move to dashboard component/container once created
export const MintUi: React.FC<IMintUiProps> = ({ limitWei, mintFeePercentage, isSubmitting }) => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');

  // Convert wei to VAI
  const limitVai = limitWei.dividedBy(new BigNumber(10).pow(VAI_INFO.decimals));

  const setMaxValue = () => setValue(limitVai.toString());

  return (
    <>
      <TextField
        css={styles.textField}
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        placeholder="0.00"
        min={0}
        max={limitVai.toNumber()}
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
          {limitVai.toString()} VAI
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
          {limitVai.toString()} VAI ({mintFeePercentage})
        </Typography>
      </div>
    </>
  );
};

export const Mint: React.FC = () => {
  // TODO: fetch actual data
  const limitWei = new BigNumber('100.12').multipliedBy(new BigNumber(10).pow(VAI_INFO.decimals));
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
