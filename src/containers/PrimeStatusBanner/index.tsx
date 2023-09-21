/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { ReactComponent as PrimeLogo } from 'assets/img/primeLogo.svg';
import { PrimaryButton } from 'components/Button';
import { Icon } from 'components/Icon';
import { ProgressBar } from 'components/ProgressBar';
import { Tooltip } from 'components/Tooltip';
import { routes } from 'constants/routing';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useConvertWeiToReadableTokenString from 'hooks/useFormatTokensToReadableValue';
import useGetToken from 'hooks/useGetToken';

import { useStyles } from './styles';

export interface PrimeStatusBannerUiProps {
  isUserPrime: boolean;
  xvs: Token;
  isLoading: boolean;
  onRedirectToXvsVaultPage: () => void;
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
  haveAllPrimeTokensBeenClaimed = false,
  onRedirectToXvsVaultPage,
}) => {
  const styles = useStyles();
  const { Trans, t } = useTranslation();

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

  const readableMinXvsToStakeForPrimeTokens = useConvertWeiToReadableTokenString({
    value: minXvsToStakeForPrimeTokens,
    token: xvs,
  });

  const readableUserStakedXvsTokens = useConvertWeiToReadableTokenString({
    value: userStakedXvsTokens,
    token: xvs,
  });

  const readableStakeDeltaTokens = useConvertWeiToReadableTokenString({
    value: stakeDeltaTokens,
    token: xvs,
  });

  const shouldDisplayTitle = !!highestHypotheticalPrimeApyBoostPercentage;
  const shouldDisplayWarning = haveAllPrimeTokensBeenClaimed;

  if (isLoading || isUserPrime) {
    return null;
  }

  return (
    <Paper css={styles.container} className={className}>
      <div
        css={[styles.column, styles.getContentColumn({ isWarningDisplayed: shouldDisplayWarning })]}
      >
        <div css={styles.header}>
          <div css={styles.primeLogo}>
            <PrimeLogo />
          </div>

          <div>
            {shouldDisplayTitle && (
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
            )}

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
                      target="_blank"
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

        {minXvsToStakeForPrimeTokens && userStakedXvsTokens && (
          <div css={styles.getProgress({ addLeftPadding: shouldDisplayTitle })}>
            <ProgressBar
              css={styles.progressBar}
              value={+userStakedXvsTokens.toFixed(0)}
              step={1}
              ariaLabel={t('primeStatusBanner.progressBar.ariaLabel')}
              min={0}
              max={+minXvsToStakeForPrimeTokens.toFixed(0)}
            />

            <Typography variant="small2">
              <Trans
                i18nKey="primeStatusBanner.progressBar.label"
                components={{
                  WhiteText: <span css={styles.whiteText} />,
                }}
                values={{
                  minXvsToStakeForPrimeTokens: readableMinXvsToStakeForPrimeTokens,
                  userStakedXvsTokens: readableUserStakedXvsTokens,
                }}
              />
            </Typography>
          </div>
        )}
      </div>

      <div
        css={[
          styles.column,
          styles.getCtaColumn({
            isWarningDisplayed: shouldDisplayWarning,
            isTitleDisplayed: shouldDisplayTitle,
          }),
        ]}
      >
        {haveAllPrimeTokensBeenClaimed ? (
          <div css={styles.noPrimeTokenWarning}>
            <Typography variant="small2" component="label" css={styles.warningText}>
              {t('primeStatusBanner.noPrimeTokenWarning.text')}
            </Typography>

            <Tooltip
              // TODO: add correct tooltip text
              title={t('primeStatusBanner.noPrimeTokenWarning.tooltip')}
              css={styles.tooltip}
            >
              <Icon name="info" css={styles.tooltipIcon} />
            </Tooltip>
          </div>
        ) : (
          <PrimaryButton onClick={onRedirectToXvsVaultPage} css={styles.stakeButton}>
            {t('primeStatusBanner.stakeButtonLabel')}
          </PrimaryButton>
        )}
      </div>
    </Paper>
  );
};

export type PrimeStatusBannerProps = Pick<PrimeStatusBannerUiProps, 'className'>;

const PrimeStatusBanner: React.FC<PrimeStatusBannerProps> = props => {
  const navigate = useNavigate();
  const redirectToXvsPage = () => navigate(routes.vaults.path);

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
  const haveAllPrimeTokensBeenClaimed = true;

  return (
    <>
      <PrimeStatusBannerUi
        isLoading={isLoading}
        isUserPrime={isUserPrime}
        primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
        xvs={xvs!}
        onRedirectToXvsVaultPage={redirectToXvsPage}
        userStakedXvsTokens={userStakedXvsTokens}
        minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
        highestHypotheticalPrimeApyBoostPercentage={highestHypotheticalPrimeApyBoostPercentage}
        haveAllPrimeTokensBeenClaimed={haveAllPrimeTokensBeenClaimed}
        {...props}
      />

      {/* DEV ONLY */}
      <PrimeStatusBannerUi
        isLoading={isLoading}
        isUserPrime={isUserPrime}
        primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
        xvs={xvs!}
        onRedirectToXvsVaultPage={redirectToXvsPage}
        userStakedXvsTokens={userStakedXvsTokens}
        minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
        highestHypotheticalPrimeApyBoostPercentage={highestHypotheticalPrimeApyBoostPercentage}
        haveAllPrimeTokensBeenClaimed={false}
        {...props}
      />

      <PrimeStatusBannerUi
        isLoading={isLoading}
        isUserPrime={isUserPrime}
        primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
        xvs={xvs!}
        onRedirectToXvsVaultPage={redirectToXvsPage}
        userStakedXvsTokens={userStakedXvsTokens}
        minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
        haveAllPrimeTokensBeenClaimed
        {...props}
      />

      <PrimeStatusBannerUi
        isLoading={isLoading}
        isUserPrime={isUserPrime}
        primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
        xvs={xvs!}
        onRedirectToXvsVaultPage={redirectToXvsPage}
        userStakedXvsTokens={userStakedXvsTokens}
        minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
        haveAllPrimeTokensBeenClaimed={false}
        {...props}
      />
      {/* END DEV ONLY */}
    </>
  );
};

export default PrimeStatusBanner;
