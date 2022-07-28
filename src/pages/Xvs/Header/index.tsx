/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { EllipseAddress, Icon, LabeledProgressBar } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import {
  convertWeiToTokens,
  formatTokensToReadableValue,
  generateBscScanUrl,
  getContractAddress,
  getToken,
} from 'utilities';

import { useGetBalanceOf, useGetUserMarketInfo, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { MINTED_XVS_WEI } from '../constants';
import { useStyles } from '../styles';

interface HeaderProps {
  className?: string;
}

interface HeaderContainerProps {
  remainingDistributionWei: BigNumber;
  dailyVenusWei: BigNumber;
  venusVaiVaultDailyRateWei: BigNumber;
  totalXvsDistributedWei: BigNumber;
}

export const HeaderUi: React.FC<HeaderProps & HeaderContainerProps> = ({
  className,
  remainingDistributionWei,
  dailyVenusWei,
  venusVaiVaultDailyRateWei,
  totalXvsDistributedWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const xvsAddress = getToken('xvs').address;
  const copy = useCopyToClipboard(t('interactive.copy.xvsAddress'));
  const copyAddress = () => copy(xvsAddress);

  const readableDailyDistribution = useMemo(() => {
    const dailyVenusTokens = convertWeiToTokens({
      valueWei: dailyVenusWei,
      tokenId: 'xvs',
    });

    const venusVaiVaultDailyRateTokens = convertWeiToTokens({
      valueWei: venusVaiVaultDailyRateWei,
      tokenId: 'xvs',
    });

    const dailyDistribution = dailyVenusTokens.plus(venusVaiVaultDailyRateTokens);

    return formatTokensToReadableValue({
      value: dailyDistribution,
      tokenId: 'xvs',
      minimizeDecimals: true,
    });
  }, [dailyVenusWei.toFixed(), venusVaiVaultDailyRateWei.toFixed()]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: remainingDistributionWei,
        tokenId: 'xvs',
        returnInReadableFormat: true,
        minimizeDecimals: true,
      }),
    [remainingDistributionWei.toFixed()],
  );

  const percentOfXvsDistributed = useMemo(
    () => totalXvsDistributedWei.dividedBy(MINTED_XVS_WEI).multipliedBy(100).toNumber(),
    [],
  );

  return (
    <Paper className={className} css={styles.headerRoot}>
      <div css={styles.addressContainer}>
        <div css={styles.xvsIconContainer}>
          <Icon name="xvs" size={styles.iconSize} />
        </div>

        <Typography
          href={generateBscScanUrl('xvs')}
          target="_blank"
          rel="noreferrer"
          variant="small2"
          component="a"
          css={[styles.whiteText, styles.addressText]}
        >
          <EllipseAddress address={xvsAddress} ellipseBreakpoint="xl" />
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
  const { account } = useContext(AuthContext);
  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();
  const {
    data: { dailyVenusWei, totalXvsDistributedWei },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });
  const { data: xvsRemainingDistributionData } = useGetBalanceOf({
    tokenId: 'xvs',
    accountAddress: getContractAddress('comptroller'),
  });

  return (
    <HeaderUi
      remainingDistributionWei={xvsRemainingDistributionData?.balanceWei || new BigNumber(0)}
      venusVaiVaultDailyRateWei={venusVaiVaultDailyRateData?.dailyRateWei || new BigNumber(0)}
      className={className}
      dailyVenusWei={dailyVenusWei}
      totalXvsDistributedWei={totalXvsDistributedWei}
    />
  );
};

export default Header;
