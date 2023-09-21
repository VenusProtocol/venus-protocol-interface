/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import React from 'react';

import { useStyles } from './styles';

export interface PrimeStatusBannerUiProps {
  isUserPrime: boolean;
  userStakedXvsTokens: BigNumber;
  minXvsToStakeForEligibilityTokens: BigNumber;
  highestHypotheticalPrimeApyBoostPercentage: BigNumber;
  haveAllTokensBeenClaimed?: boolean;
  secondsUntilEligible?: number;
  className?: string;
}

export const PrimeStatusBannerUi: React.FC<PrimeStatusBannerUiProps> = ({ className }) => {
  const styles = useStyles();

  return (
    <Paper css={styles.container} className={className}>
      Test
    </Paper>
  );
};

export type PrimeStatusBannerProps = Pick<PrimeStatusBannerUiProps, 'className'>;

const PrimeStatusBanner: React.FC<PrimeStatusBannerProps> = props => {
  // TODO: fetch these values
  const isUserPrime = false;
  const secondsUntilEligible = 0;
  const userStakedXvsTokens = new BigNumber('1000');
  const minXvsToStakeForEligibilityTokens = new BigNumber('1000');
  const highestHypotheticalPrimeApyBoostPercentage = new BigNumber('3.14');
  const haveAllTokensBeenClaimed = false;

  return (
    <PrimeStatusBannerUi
      isUserPrime={isUserPrime}
      secondsUntilEligible={secondsUntilEligible}
      userStakedXvsTokens={userStakedXvsTokens}
      minXvsToStakeForEligibilityTokens={minXvsToStakeForEligibilityTokens}
      highestHypotheticalPrimeApyBoostPercentage={highestHypotheticalPrimeApyBoostPercentage}
      haveAllTokensBeenClaimed={haveAllTokensBeenClaimed}
      {...props}
    />
  );
};

export default PrimeStatusBanner;
