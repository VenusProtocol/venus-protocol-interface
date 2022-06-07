/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import { useGetVenusVaiVaultRate, useGetBalanceOf, useGetUserMarketInfo } from 'clients/api';
import { EllipseText, Icon, LabeledProgressBar } from 'components';
import { AuthContext } from 'context/AuthContext';
import copy from 'copy-to-clipboard';
import { getToken, generateBscScanUrl, getContractAddress } from 'utilities';
import { convertWeiToCoins, formatCoinsToReadableValue } from 'utilities/common';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import { MINTED_XVS_WEI } from '../constants';

interface IHeaderProps {
  className?: string;
}

interface IHeaderContainerProps {
  remainingDistributionWei: BigNumber;
  dailyVenus: BigNumber;
  venusVaiVaultRate: BigNumber;
  totalXvsDistributedWei: BigNumber;
}

export const HeaderUi: React.FC<IHeaderProps & IHeaderContainerProps> = ({
  className,
  remainingDistributionWei,
  dailyVenus,
  venusVaiVaultRate,
  totalXvsDistributedWei,
}) => {
  const styles = useStyles();
  const xvsAddress = getToken('xvs').address;
  const copyAddress = () => copy(xvsAddress);
  const { t } = useTranslation();

  const readableDailyDistribution = useMemo(() => {
    const dailyDistribution = dailyVenus
      .div(new BigNumber(10).pow(getToken('xvs').decimals))
      .plus(venusVaiVaultRate);

    return formatCoinsToReadableValue({
      value: dailyDistribution,
      tokenId: 'xvs',
      minimizeDecimals: true,
    });
  }, [dailyVenus.toFixed(), venusVaiVaultRate]);

  const readableRemainingDistribution = useMemo(
    () =>
      convertWeiToCoins({
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
      <EllipseText css={styles.address} text={xvsAddress}>
        <div css={styles.xvsIconContainer}>
          <Icon name="xvs" size={styles.iconSize} />
        </div>

        <Typography
          className="ellipse-text"
          href={generateBscScanUrl('xvs')}
          target="_blank"
          rel="noreferrer"
          variant="small2"
          component="a"
          css={[styles.whiteText, styles.addressText]}
        />

        <div css={styles.copyIconContainer}>
          <Icon name="copy" onClick={copyAddress} css={styles.copyIcon} size={styles.iconSizeXl} />
        </div>
      </EllipseText>

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

const Header: React.FC<IHeaderProps> = ({ className }) => {
  const { account } = useContext(AuthContext);
  const { data: venusVAIVaultRate } = useGetVenusVaiVaultRate();
  const {
    data: { dailyVenus, totalXvsDistributedWei },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });
  const { data: xvsRemainingDistribution } = useGetBalanceOf({
    tokenId: 'xvs',
    accountAddress: getContractAddress('comptroller'),
  });

  return (
    <HeaderUi
      remainingDistributionWei={xvsRemainingDistribution || new BigNumber(0)}
      venusVaiVaultRate={venusVAIVaultRate || new BigNumber(0)}
      className={className}
      dailyVenus={dailyVenus}
      totalXvsDistributedWei={totalXvsDistributedWei}
    />
  );
};

export default Header;
