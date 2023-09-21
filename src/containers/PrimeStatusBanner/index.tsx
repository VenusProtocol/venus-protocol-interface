/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { ReactComponent as PrimeLogo } from 'assets/img/primeLogo.svg';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useConvertWeiToReadableTokenString from 'hooks/useFormatTokensToReadableValue';
import useGetToken from 'hooks/useGetToken';

import { useStyles } from './styles';

export interface PrimeStatusBannerUiProps {
  isUserPrime: boolean;
  xvs: Token;
  isLoading: boolean;
  userStakedXvsTokens?: BigNumber;
  minXvsToStakeForPrimeTokens?: BigNumber;
  highestHypotheticalPrimeApyBoostPercentage?: BigNumber;
  haveAllPrimeTokensBeenClaimed?: boolean;
  primeClaimWaitingPeriodSeconds?: number;
  className?: string;
}

export const PrimeStatusBannerUi: React.FC<PrimeStatusBannerUiProps> = ({
  className,
  isUserPrime,
  isLoading,
  xvs,
  highestHypotheticalPrimeApyBoostPercentage,
  primeClaimWaitingPeriodSeconds,
  minXvsToStakeForPrimeTokens,
  userStakedXvsTokens,
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();

  const readableApyBoostPercentage = useFormatPercentageToReadableValue({
    value: highestHypotheticalPrimeApyBoostPercentage,
  });

  const readableClaimWaitingPeriod = useMemo(
    () =>
      primeClaimWaitingPeriodSeconds
        ? formatDistanceStrict(
            new Date(),
            new Date().getTime() + primeClaimWaitingPeriodSeconds * 1000,
            { unit: 'day' },
          )
        : undefined,
    [primeClaimWaitingPeriodSeconds],
  );

  const stakeDeltaTokens =
    minXvsToStakeForPrimeTokens &&
    userStakedXvsTokens &&
    minXvsToStakeForPrimeTokens.minus(userStakedXvsTokens);

  const readableStakeDeltaTokens = useConvertWeiToReadableTokenString({
    value: stakeDeltaTokens,
    token: xvs,
  });

  if (isLoading || isUserPrime) {
    return null;
  }

  return (
    <Paper css={styles.container} className={className}>
      <div css={styles.column}>
        <div css={styles.header}>
          <PrimeLogo css={styles.primeLogo} />

          <div>
            <Typography variant="h3" css={styles.title}>
              <Trans
                i18nKey="primeStatusBanner.title"
                components={{
                  GreenText: <span css={styles.greenText} />,
                }}
                values={{
                  percentage: readableApyBoostPercentage,
                }}
              />
            </Typography>

            <Typography>
              <Trans
                i18nKey="primeStatusBanner.description"
                components={{
                  WhiteText: <span css={styles.whiteText} />,
                  Link: (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a
                      // TODO: add correct link
                      href="https://google.com"
                      rel="noreferrer"
                    />
                  ),
                }}
                values={{
                  stakeDelta: readableStakeDeltaTokens,
                  claimWaitingPeriod: readableClaimWaitingPeriod,
                }}
              />
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export type PrimeStatusBannerProps = Pick<PrimeStatusBannerUiProps, 'className'>;

const PrimeStatusBanner: React.FC<PrimeStatusBannerProps> = props => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  // TODO: fetch these values
  const isLoading = false;
  const isUserPrime = false;
  const primeClaimWaitingPeriodSeconds = 90 * 24 * 60 * 60; // 9 days in seconds
  const userStakedXvsTokens = new BigNumber('100');
  const minXvsToStakeForPrimeTokens = new BigNumber('1000');
  const highestHypotheticalPrimeApyBoostPercentage = new BigNumber('3.14');
  const haveAllPrimeTokensBeenClaimed = false;

  return (
    <PrimeStatusBannerUi
      isLoading={isLoading}
      isUserPrime={isUserPrime}
      primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
      xvs={xvs!}
      userStakedXvsTokens={userStakedXvsTokens}
      minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
      highestHypotheticalPrimeApyBoostPercentage={highestHypotheticalPrimeApyBoostPercentage}
      haveAllPrimeTokensBeenClaimed={haveAllPrimeTokensBeenClaimed}
      {...props}
    />
  );
};

export default PrimeStatusBanner;
