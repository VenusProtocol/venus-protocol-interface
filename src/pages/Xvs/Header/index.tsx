/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { EllipseAddress, Icon, LabeledProgressBar, TokenIcon } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import {
  convertWeiToTokens,
  formatTokensToReadableValue,
  generateBscScanUrl,
  getContractAddress,
} from 'utilities';

import {
  useGetBalanceOf,
  useGetMainAssets,
  useGetMainPoolTotalXvsDistributed,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { MINTED_XVS_WEI } from '../constants';
import { useStyles } from '../styles';

interface HeaderProps {
  className?: string;
}

interface HeaderContainerProps {
  remainingDistributionWei: BigNumber;
  dailyXvsDistributedTokens: BigNumber;
  venusVaiVaultDailyRateWei: BigNumber;
  totalXvsDistributedWei: BigNumber;
}

export const HeaderUi: React.FC<HeaderProps & HeaderContainerProps> = ({
  className,
  remainingDistributionWei,
  dailyXvsDistributedTokens,
  venusVaiVaultDailyRateWei,
  totalXvsDistributedWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const copy = useCopyToClipboard(t('interactive.copy.xvsAddress'));
  const copyAddress = () => copy(TOKENS.xvs.address);

  const readableDailyDistribution = useMemo(() => {
    const venusVaiVaultDailyRateTokens = convertWeiToTokens({
      valueWei: venusVaiVaultDailyRateWei,
      token: TOKENS.xvs,
    });

    const dailyDistribution = dailyXvsDistributedTokens.plus(venusVaiVaultDailyRateTokens);

    return formatTokensToReadableValue({
      value: dailyDistribution,
      token: TOKENS.xvs,
      minimizeDecimals: true,
    });
  }, [dailyXvsDistributedTokens, venusVaiVaultDailyRateWei]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: remainingDistributionWei,
        token: TOKENS.xvs,
        returnInReadableFormat: true,
        minimizeDecimals: true,
      }),
    [remainingDistributionWei],
  );

  const percentOfXvsDistributed = useMemo(
    () => totalXvsDistributedWei.dividedBy(MINTED_XVS_WEI).multipliedBy(100).toNumber(),
    [totalXvsDistributedWei],
  );

  return (
    <Paper className={className} css={styles.headerRoot}>
      <div css={styles.addressContainer}>
        <div css={styles.xvsIconContainer}>
          <TokenIcon token={TOKENS.xvs} css={styles.icon} />
        </div>

        <Typography
          href={generateBscScanUrl(TOKENS.xvs.address, 'token')}
          target="_blank"
          rel="noreferrer"
          variant="small2"
          component="a"
          css={[styles.whiteText, styles.addressText]}
        >
          <EllipseAddress address={TOKENS.xvs.address} ellipseBreakpoint="xl" />
        </Typography>

        <div css={styles.copyIconContainer}>
          <Icon name="copy" onClick={copyAddress} css={styles.copyIcon} size={styles.iconSizeXl} />
        </div>
      </div>

      <div css={styles.slider}>
        <LabeledProgressBar
          css={styles.progressBar}
          min={1}
          max={100}
          step={1}
          value={percentOfXvsDistributed}
          ariaLabel={t('xvs.progressBar')}
          greyLeftText={t('xvs.dailyDistribution')}
          whiteLeftText={readableDailyDistribution}
          greyRightText={t('xvs.remaining')}
          whiteRightText={readableRemainingDistribution}
        />
      </div>
    </Paper>
  );
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { accountAddress } = useAuth();
  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();
  const { data: getMainAssetsData } = useGetMainAssets({
    accountAddress,
  });

  const dailyXvsDistributedTokens = useMemo(
    () =>
      (getMainAssetsData?.assets || []).reduce(
        (acc, asset) =>
          acc.plus(
            // Note: assets from the main pool only yield XVS, hence why we only
            // take the first distribution token in consideration (which will
            // always be XVS here)
            asset.distributions[0].dailyDistributedTokens,
          ),
        new BigNumber(0),
      ),
    [getMainAssetsData?.assets],
  );

  const { data: mainPoolTotalXvsDistributedData } = useGetMainPoolTotalXvsDistributed();

  const { data: xvsRemainingDistributionData } = useGetBalanceOf({
    token: TOKENS.xvs,
    accountAddress: getContractAddress('comptroller'),
  });

  return (
    <HeaderUi
      remainingDistributionWei={xvsRemainingDistributionData?.balanceWei || new BigNumber(0)}
      venusVaiVaultDailyRateWei={venusVaiVaultDailyRateData?.dailyRateWei || new BigNumber(0)}
      className={className}
      dailyXvsDistributedTokens={dailyXvsDistributedTokens}
      totalXvsDistributedWei={
        mainPoolTotalXvsDistributedData?.totalXvsDistributedWei || new BigNumber(0)
      }
    />
  );
};

export default Header;
