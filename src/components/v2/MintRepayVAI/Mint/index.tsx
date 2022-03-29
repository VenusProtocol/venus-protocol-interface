/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
// import Typography from '@mui/material/Typography';

import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { TextField } from '../../TextField';
import { TertiaryButton } from '../../Button';
import { useStyles } from './styles';

const VAI_INFO = CONTRACT_TOKEN_ADDRESS.vai;

export interface IMintUiProps {
  isSubmitting: boolean;
  onSubmit: (value: BigNumber) => Promise<void>;
  weiLimit: BigNumber;
  mintFeePercentage: number;
}

// TODO: Move to dashboard component/container once created
export const MintUi: React.FC<IMintUiProps> = ({ weiLimit, isSubmitting }) => {
  const styles = useStyles();
  const [value, setValue] = React.useState<undefined | string>();

  // Convert wei to VAI
  const vaiLimit = weiLimit.dividedBy(new BigNumber(10).pow(VAI_INFO.decimals));

  const setMaxValue = () => setValue(vaiLimit.toString());

  return (
    <div css={styles.container}>
      <TextField
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        placeholder="0.00"
        max={vaiLimit.toString()}
        type="number"
        disabled={isSubmitting}
        rightAdornment={
          <TertiaryButton onClick={setMaxValue} small disabled={isSubmitting}>
            SAFE MAX
          </TertiaryButton>
        }
      />
    </div>
  );
};

export const Mint: React.FC = () => {
  // TODO: fetch actual data
  const weiLimit = new BigNumber('100.12').multipliedBy(new BigNumber(10).pow(VAI_INFO.decimals));
  const mintFeePercentage = 2.14;

  const onSubmit: IMintUiProps['onSubmit'] = async value => {
    // TODO: mint VAI
    console.log('Amount to mint:', value.toString());
  };

  return (
    <MintUi
      weiLimit={weiLimit}
      mintFeePercentage={mintFeePercentage}
      isSubmitting={false}
      onSubmit={onSubmit}
    />
  );
};
