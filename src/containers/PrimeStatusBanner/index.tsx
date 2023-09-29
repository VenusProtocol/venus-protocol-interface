/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { ContractReceipt } from 'ethers';
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'translation';
import { Token } from 'types';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { ReactComponent as PrimeLogo } from 'assets/img/primeLogo.svg';
import { PrimaryButton } from 'components/Button';
import { Icon } from 'components/Icon';
import { ProgressBar } from 'components/ProgressBar';
import { Tooltip } from 'components/Tooltip';
import { routes } from 'constants/routing';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useConvertWeiToReadableTokenString from 'hooks/useFormatTokensToReadableValue';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from './styles';

export interface PrimeStatusBannerUiProps {
  xvs: Token;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  isClaimPrimeTokenLoading: boolean;
  onClaimPrimeToken: () => Promise<ContractReceipt>;
  onRedirectToXvsVaultPage: () => void;
  userStakedXvsTokens: BigNumber;
  minXvsToStakeForPrimeTokens: BigNumber;
  highestHypotheticalPrimeApyBoostPercentage: BigNumber;
  primeClaimWaitingPeriodSeconds: number;
  hidePromotionalTitle?: boolean;
  className?: string;
}

export const PrimeStatusBannerUi: React.FC<PrimeStatusBannerUiProps> = ({
  className,
  xvs,
  claimedPrimeTokenCount,
  primeTokenLimit,
  isClaimPrimeTokenLoading,
  highestHypotheticalPrimeApyBoostPercentage,
  primeClaimWaitingPeriodSeconds,
  minXvsToStakeForPrimeTokens,
  userStakedXvsTokens,
  hidePromotionalTitle = false,
  onClaimPrimeToken,
  onRedirectToXvsVaultPage,
}) => {
  const styles = useStyles();
  const { Trans, t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const handleClaimPrimeToken = () =>
    handleTransactionMutation({
      mutate: onClaimPrimeToken,
      successTransactionModalProps: contractReceipt => ({
        title: t('primeStatusBanner.successfulTransactionModal.title'),
        content: t('primeStatusBanner.successfulTransactionModal.message'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });

  const stakeDeltaTokens = useMemo(
    () => minXvsToStakeForPrimeTokens.minus(userStakedXvsTokens),
    [minXvsToStakeForPrimeTokens, userStakedXvsTokens],
  );
  const isUserXvsStakeHighEnoughForPrime = !!stakeDeltaTokens?.isEqualTo(0);

  const haveAllPrimeTokensBeenClaimed = useMemo(
    () => claimedPrimeTokenCount >= primeTokenLimit,
    [primeTokenLimit, claimedPrimeTokenCount],
  );

  const readableStakeDeltaTokens = useConvertWeiToReadableTokenString({
    value: stakeDeltaTokens,
    token: xvs,
  });

  const readableApyBoostPercentage = useFormatPercentageToReadableValue({
    value: highestHypotheticalPrimeApyBoostPercentage,
  });

  const readableClaimWaitingPeriod = useMemo(
    () =>
      formatDistanceStrict(
        new Date(),
        new Date().getTime() + primeClaimWaitingPeriodSeconds * 1000,
      ),
    [primeClaimWaitingPeriodSeconds],
  );

  const readableMinXvsToStakeForPrimeTokens = useConvertWeiToReadableTokenString({
    value: minXvsToStakeForPrimeTokens,
    token: xvs,
  });

  const readableUserStakedXvsTokens = useConvertWeiToReadableTokenString({
    value: userStakedXvsTokens,
    token: xvs,
  });

  const title = useMemo(() => {
    if (isUserXvsStakeHighEnoughForPrime && primeClaimWaitingPeriodSeconds > 0) {
      return t('primeStatusBanner.waitForPrimeTitle', {
        claimWaitingPeriod: readableClaimWaitingPeriod,
      });
    }

    if (isUserXvsStakeHighEnoughForPrime && primeClaimWaitingPeriodSeconds === 0) {
      return t('primeStatusBanner.becomePrimeTitle');
    }

    if (!hidePromotionalTitle) {
      return (
        <Trans
          i18nKey="primeStatusBanner.promotionalTitle"
          components={{
            GreenText: <span css={styles.greenText} />,
          }}
          values={{
            percentage: readableApyBoostPercentage,
          }}
        />
      );
    }
  }, [hidePromotionalTitle, readableApyBoostPercentage, isUserXvsStakeHighEnoughForPrime]);

  const ctaButton = useMemo(() => {
    if (haveAllPrimeTokensBeenClaimed) {
      return undefined;
    }

    if (isUserXvsStakeHighEnoughForPrime) {
      return (
        <PrimaryButton
          onClick={handleClaimPrimeToken}
          css={styles.button}
          loading={isClaimPrimeTokenLoading}
        >
          {t('primeStatusBanner.claimButtonLabel')}
        </PrimaryButton>
      );
    }

    return (
      <PrimaryButton onClick={onRedirectToXvsVaultPage} css={styles.button}>
        {t('primeStatusBanner.stakeButtonLabel')}
      </PrimaryButton>
    );
  }, [isUserXvsStakeHighEnoughForPrime, haveAllPrimeTokensBeenClaimed]);

  return (
    <Paper
      css={styles.getContainer({ isProgressDisplayed: !isUserXvsStakeHighEnoughForPrime })}
      className={className}
    >
      <div css={styles.getContentColumn({ isWarningDisplayed: haveAllPrimeTokensBeenClaimed })}>
        <div css={styles.getHeader({ isProgressDisplayed: !isUserXvsStakeHighEnoughForPrime })}>
          <div
            css={styles.getPrimeLogo({ isProgressDisplayed: !isUserXvsStakeHighEnoughForPrime })}
          >
            <PrimeLogo />
          </div>

          <div>
            {!!title && (
              <Typography
                variant="h3"
                css={styles.getTitle({ isDescriptionDisplayed: !isUserXvsStakeHighEnoughForPrime })}
              >
                {title}
              </Typography>
            )}

            {!isUserXvsStakeHighEnoughForPrime && (
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
            )}
          </div>
        </div>

        {!isUserXvsStakeHighEnoughForPrime && (
          <div css={styles.getProgress({ addLeftPadding: !!title })}>
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
        css={styles.getCtaColumn({
          isWarningDisplayed: haveAllPrimeTokensBeenClaimed,
          isTitleDisplayed: !!title,
        })}
      >
        {haveAllPrimeTokensBeenClaimed ? (
          <div
            css={styles.getNoPrimeTokenWarning({
              isProgressDisplayed: !isUserXvsStakeHighEnoughForPrime,
            })}
          >
            <Typography variant="small2" component="label" css={styles.warningText}>
              {t('primeStatusBanner.noPrimeTokenWarning.text')}
            </Typography>

            <Tooltip
              title={t('primeStatusBanner.noPrimeTokenWarning.tooltip', { primeTokenLimit })}
              css={styles.tooltip}
            >
              <Icon name="info" css={styles.tooltipIcon} />
            </Tooltip>
          </div>
        ) : (
          ctaButton
        )}
      </div>
    </Paper>
  );
};

export type PrimeStatusBannerProps = Pick<
  PrimeStatusBannerUiProps,
  'className' | 'hidePromotionalTitle'
>;

const PrimeStatusBanner: React.FC<PrimeStatusBannerProps> = props => {
  const navigate = useNavigate();
  const redirectToXvsPage = () => navigate(routes.vaults.path);

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  // TODO: wire up
  const isLoading = false;
  const isUserPrime = false;
  const primeClaimWaitingPeriodSeconds = 90 * 24 * 60 * 60; // 9 days in seconds
  const userStakedXvsTokens = new BigNumber('100');
  const minXvsToStakeForPrimeTokens = new BigNumber('1000');
  const highestHypotheticalPrimeApyBoostPercentage = new BigNumber('3.14');
  const claimedPrimeTokenCount = 1000;
  const primeTokenLimit = 1000;

  const claimPrimeToken = async () => fakeContractReceipt;
  const isClaimPrimeTokenLoading = false;

  // Hide component while loading or if user is Prime already
  if (isLoading || isUserPrime) {
    return null;
  }

  return (
    <PrimeStatusBannerUi
      xvs={xvs!}
      claimedPrimeTokenCount={claimedPrimeTokenCount}
      primeTokenLimit={primeTokenLimit}
      primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
      userStakedXvsTokens={userStakedXvsTokens}
      onRedirectToXvsVaultPage={redirectToXvsPage}
      onClaimPrimeToken={claimPrimeToken}
      minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
      highestHypotheticalPrimeApyBoostPercentage={highestHypotheticalPrimeApyBoostPercentage}
      isClaimPrimeTokenLoading={isClaimPrimeTokenLoading}
      {...props}
    />
  );
};

export default PrimeStatusBanner;
